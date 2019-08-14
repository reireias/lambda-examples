require 'json'
require 'uri'
require 'net/https'
require 'aws-sdk-s3'

def lambda_handler(event:, context:)
  client = Aws::S3::Client.new(region: ENV['AWS_REGION'])
  bucket = event['Records'].first['s3']['bucket']['name']
  text = client.list_objects(bucket: bucket).contents.map(&:key).join(', ')
  notify(text)
  { statusCode: 200, body: JSON.generate('Hello from Lambda!') }
end

def notify(text)
  uri = URI.parse(ENV['WEBHOOK_URL'])
  header = { 'Content-Type': 'application/json' }
  body = { text: text }
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true
  req = Net::HTTP::Post.new(uri.request_uri, header)
  req.body = body.to_json
  res = http.request(req)
  pp res.body
end
