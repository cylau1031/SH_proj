# Upload Logs Script

## Function:
Grabs S3 file, updates specificed text, and replaces file on S3.
In this case, it replaces DOB month and date with 'X'

## Technical Stack:
* Node v10
* AWS SDK
* [Event Stream](https://www.npmjs.com/package/event-stream)

## Run:
* Make sure to have Node v10
* install dependencies with:
```js
npm install
```
* Run script by with you are in the directory:
```js
npm start
// OR
node ./scripts.js
```


## Considerations
* Current keys are omitted and can be added upon run, but the intention is that is can be added to process.env variables from run or config in a build process. Or if run manually, these values can be added manually in 'utils/config.json'
* This above can also be applied to bucket name and key at the top of the script, when run or during a build process.