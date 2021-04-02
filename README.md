# SMS Slave NodeJS

Slave that dequeue data from SQS to send it by sms and save in MySQL database.

```
cp config-sample.json config.json
cp sample.env .env
```

***NOTE: Here you will want to edit config.json with your AWS keys.***

```
node app.js
```
