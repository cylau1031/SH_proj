const AWS = require('aws-sdk');
console.log(__dirname)

AWS.config.loadFromPath(__dirname + '/config.json')

const S3 = new AWS.S3();

module.exports = S3;