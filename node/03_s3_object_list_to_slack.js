const https = require('https')
const AWS = require('aws-sdk')

exports.handler = async (event) => {
    const client = new AWS.S3()
    const bucket = event.Records[0].s3.bucket.name
    const res = await client.listObjectsV2({ Bucket: bucket }).promise()
    await notify(res.Contents.map(obj => obj.Key).join(', '))
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    }
    return response
}

const notify = text => {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({ text: text })
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const req = https.request(process.env['WEBHOOK_URL'], options, res => {
            console.log(res.statusCode)
            resolve()
        })
        req.write(data)
        req.end()
    })
}
