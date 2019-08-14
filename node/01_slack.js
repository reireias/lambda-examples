const https = require('https')

exports.handler = async (event) => {
    await notify('Hello World Node')
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
