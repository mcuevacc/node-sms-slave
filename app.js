require('./config/config');

const {execSync} = require('child_process');
const global = require('./config/global');
const sqs = require('./config/sqs');
const db = require('./config/db');
const DbServices = require('./services/DbServices');

init();

async function init(){
	try {
		await db.authenticate();
		console.log('Connection has been established successfully.');
		
		if( process.env.NODE_ENV!=='prod' ){
			await db.sync({ alter: true });
			console.log("All models were synchronized successfully."); 
		}
		
		getSQS_Data();
	} catch (err) {
		console.error('Unable to connect to the database:', err);
	}
}

async function getSQS_Data(){
	try {
		sqs.receiveMessage(global.paramsGetSQS, async (err, data) => {
			if(err) {
				console.error('Error receiveMessage in getSQS_Data():', err);
				sleep();
				return;
			}
			
			if( !('Messages' in data) ){
				console.log('No messages in the queue');
				sleep();
				return;
			}

			let message = data.Messages[0];
			deleteSQS_Data(message.ReceiptHandle);

			data = {
				message: message.Body,
				phone: message.MessageAttributes.phone.StringValue,
				key: 'key' in message.MessageAttributes ? message.MessageAttributes.key.StringValue : undefined,
				id: 'id' in message.MessageAttributes ? message.MessageAttributes.id.StringValue : undefined,
			}
			console.log('Data', data);
						
			if(typeof data.id!=='undefined'){
				let pending = await DbServices.getPendingById(data.id);
				if(pending===null){
					console.error('Not found data in pending');
					getSQS_Data();
					return;
				}
				data = pending;
			}else if(typeof data.key!=='undefined'){
				deprecatePending(data);
			}

			if(data.isDeprecated){
				pendingToDeprecated(data);
			}else{
				if( sendSMS(data) ){
					successSMS(data);
				}else{
					failedSMS(data);
				}
			}
			getSQS_Data();
		});
	} catch (err) {
		console.error('Error in getSQS_Data():', err);
		sleep();
	}
}

async function deleteSQS_Data(ReceiptHandle){
	try {
		sqs.deleteMessage({...global.paramsDeleteSQS, ReceiptHandle}, async (err, data) => {
			if(err) {
				console.error('Error deleteMessage in deleteSQS_Data():', err);
				return;
			}
			console.log("Message Deleted", data);
		});
	} catch (err) {
		console.error('Error in deleteSQS_Data():', err);
	}
}

async function enqueueSQS_Data(data){
	try {
		let MessageAttributes = {
			phone: {
				DataType: "String",
				StringValue: data.phone
			},
			id: {
				DataType: "Number",
				StringValue: `${data.id}`
			}
		}
		if(data.key){
			MessageAttributes.key = {
				DataType: "String",
				StringValue: data.key
			}
		}

		let params = {
			MessageBody: data.message,
			MessageAttributes
		}
		
		sqs.sendMessage({...global.paramsEnqueueSQS, ...params}, (err, data) => {
			if(err) {
				console.error('Error sendMessage in enqueueSQS_Data():', err);
				return;
			}
			console.log("Message Enqueued", data.MessageId);
		});
	} catch (err) {
		console.error('Error in enqueueSQS_Data():', err);
	}
}

async function pendingToDeprecated(data){
	await DbServices.deletePending(data.id);
	await DbServices.saveDeprecated(data);
}

async function deprecatePending(data){
	await DbServices.deprecatePending(data);
}
 
async function sleep(){
	console.log("Go to sleep!");
	setTimeout(getSQS_Data, global.sleepSecond*1000);
}

function sendSMS(data){
	let output = execSync(`gammu -c /etc/gammu/configGsm_1 sendsms TEXT ${data.phone} -text "${data.message}"`, { encoding: 'utf8', maxBuffer: 1024 }).toString();;
	if(output.includes('Aceptar')){
		return true;
	}
	return false;
}

async function successSMS(data){
	if(data.id){
		await DbServices.deletePending(data.id);
	}
	await DbServices.saveSended(data);
}

async function failedSMS(data){
	data.retry = (data.id) ? data.retry+1 : 1;
	if( data.retry<global.retryMax ){
		if(data.id){
			await DbServices.updatePending(data.id, {retry: data.retry});
		}else{
			data = await DbServices.savePending(data);
		}
		enqueueSQS_Data(data);
	}else{
		if(data.id){
			await DbServices.deletePending(data.id);
		}
		await DbServices.saveFailed(data);
	}
}