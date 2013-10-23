class exports.Helpers

  constructor: ->
    @natives = do (_ = window) ->
      url: _.URL or _.webkitURL or _.mozURL
      raf: _.requestAnimationFrame or
        _.webkitRequestAnimationFrame or _.mozRequestAnimationFrame or
        _.msRequestAnimationFrame or _.oRequestAnimationFrame
      transEnd: do ->
        testEl = document.createElement 'div'
        transProps =
          transition: 'transitionEnd'
          OTransition: 'oTransitionEnd'
          MSTransition: 'msTransitionEnd'
          MozTransition: 'transitionend'
          WebkitTransition: 'webkitTransitionEnd'

        for prop, val of transProps
          return val if testEl.style[prop]?
        false

  # Shim for WebGLRenderingContext.getImageData
  WebGLRenderingContext.prototype.getImageData = (x, y, width, height) ->
    tempCanvas = document.createElement('canvas')
    tempCtx = tempCanvas.getContext('2d')
    data = tempCtx.createImageData(width, height)
    buffer = new Uint8Array(width * height * 4)
    @readPixels x, y, width, height, @RGBA, @UNSIGNED_BYTE, buffer
    w = width * 4
    h = height
    i = 0
    maxI = h / 2

    while i < maxI
      j = 0
      maxJ = w

      while j < maxJ
        index1 = i * w + j
        index2 = (h - i - 1) * w + j
        data.data[index1] = buffer[index2]
        data.data[index2] = buffer[index1]
        ++j
      ++i
    data
    