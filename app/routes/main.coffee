uuid = require 'node-uuid'

module.exports = (app) ->

  s3 = app.get 's3'

  app.get 'index', (req, res) ->
    res.render 'index'

  app.get '/upload/url', (req, res) ->
    s3.getSignedUrl 'putObject', {Key: uuid.v4(), ContentType: 'image/gif', ACL: 'public-read'}, (err, url) ->
      res.json url