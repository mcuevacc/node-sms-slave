const aws = require('aws-sdk');

aws.config.loadFromPath(__dirname + '/../aws.json');

module.exports = new aws.SQS();