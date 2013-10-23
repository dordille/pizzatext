express   = require 'express'
passport  = require 'passport'
http      = require 'http'
path      = require 'path'

app = express()

app.set 'port', process.env.PORT || 3000
app.set 'views', __dirname + '/views'
app.set 'view engine', 'jade'
app.use express.favicon()
app.use express.logger('dev')
app.use express.bodyParser()
app.use express.methodOverride()
app.use app.router
app.use express.static(path.join(__dirname, '..', 'public'))

if app.get('env') == 'development'
    app.use express.errorHandler()

# S3 Configuration
aws = require 'aws-sdk'
app.set 's3', new aws.S3 params: Bucket: process.env.AWS_BUCKET

require('./routes/main')(app)

server = http.createServer app
server.listen app.get('port'), () ->
    console.log "Express server listening on port " + app.get('port')
