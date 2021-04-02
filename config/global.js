const paramsGetSQS = {
        QueueUrl: process.env.SQS_URL,
        MaxNumberOfMessages: 1,
        MessageAttributeNames: ["phone","key","id"]
    };

const paramsDeleteSQS = {
        QueueUrl: process.env.SQS_URL,
    };

const paramsEnqueueSQS = {
        QueueUrl: process.env.SQS_URL,
        DelaySeconds: 0
    };

const retryMax = 3;

const sleepSecond = 1;

module.exports = {
    paramsGetSQS,
    paramsDeleteSQS,
    paramsEnqueueSQS,
    retryMax,
    sleepSecond
}