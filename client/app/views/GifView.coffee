{BaseView} = require 'views/BaseView'
qs = require 'lib/querystring'

class exports.GifView extends BaseView

  templateName: 'gif'
  className: 'view gif'
  events:
    'click .tumblr_share': 'share'

  initialize: (options) ->
    super
    @blob = options.blob
    @dataURL = URL.createObjectURL(@blob)
    @uploadDeferred = @upload()
    @uploadDeferred.done @updateImageElement

  render: () ->
    @$el.html @template(imgsrc: @dataURL)
    @

  upload: () ->
    def = new $.Deferred()
    req = $.get '/upload/url'
    req.done (url) =>
      @publicURL = url.substring 0, url.indexOf('?')
      xhr = new XMLHttpRequest
      xhr.open 'PUT', url, true
      xhr.setRequestHeader 'Content-Type', 'image/gif'
      xhr.setRequestHeader 'x-amz-acl', 'public-read'
      xhr.onprogress = def.notify
      xhr.onload = def.resolve
      xhr.onerror = def.reject
      xhr.send @blob

    return def.promise()

  updateImageElement: () =>
    image = new Image
    image.src = @publicURL
    image.onload = () =>
      @$('img').attr('src', @publicURL)

  share: (event) =>
    event.preventDefault()
    return @_share() unless @uploadDeferred.state() == 'pending'

    @$('share').addClass 'loading'
    @uploadDeferred.done @_share

  _share: () =>
    @$('.tumblr_share').removeClass 'loading'
    url = "http://www.tumblr.com/share/photo?" + qs.stringify
      source: @publicURL
      tags: ['pizzatext', 'pizza'].join(',')
    window.open url, "_blank", "width=500px,height=500px"
    