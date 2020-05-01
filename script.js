const s3 = require('./utils/s3');
const es = require('event-stream');
const fs = require('fs');

const params = {
  Bucket: "", // process.env.bucket
  Key: "", // process.env.bucket_key
}


const replaceText = line => {
  const regexTest = /\bDOB\b\=\'\d{1,2}\/\d{1,2}\/\d{4}/;
  if (regexTest.test(line)) {
    return line.split(' ').map( function (item) {
      if (item.includes('DOB=')) {
        let date = item.split('=')[1];
        const year = date.split('/')[2];
        return `DOB='X/X/${year}`;
      } else {
        return item;
      }
    }).join(' ');
  } else {
    return line;
  }
}

const uploadData =(fileName) => {
  const uploadStream = fs.createReadStream(fileName);
  s3.upload({...params, Body: uploadData}, function(err, data) {
    if (err) {
      console.log('Error uploading processed data to S3:', err)
    } 
    else {
      console.log('Successfully updated processed data to S3...')
    }
  })
}

const updateLogFiles = async () => {
  // Grabs log file
  const stream = s3
  .getObject(params)
  .createReadStream()
  
  // Processes file data
  await stream
  .pipe(es.split())
  .pipe(es.mapSync(replaceText)
    .on('error', function(err) {
      console.log('Error parsing stream:', err)
    })
    .on('end', function() {
      console.log('Finished processing data...')
    })
  )
  .pipe(es.join('\n'))
  .pipe(fs.createWriteStream(params.Key))

  // Uploads and replaces original file with processed data
  uploadData(params.Key)
}

updateLogFiles()
