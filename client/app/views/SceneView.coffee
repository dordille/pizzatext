{BaseView} = require 'views/BaseView'
{GifView} = require 'views/GifView'
{PizzaText} = require 'models/PizzaText'

class exports.SceneView extends BaseView

  templateName: 'scene'
  className: 'view scene'

  attach: ->
    @$('.canvas').append(@renderer.domElement)
    @lastDraw = new Date
    @draw()

  draw: (data) =>
    if @delta
      delta = @delta
    else
      delta = new Date - @lastDraw

    @pizza.trigger 'animate', delta
    @trigger 'draw', { delta: delta }
    @renderer.render(@scene, @camera);
    @lastDraw = new Date
    requestAnimationFrame(@draw)

  initialize: (options) ->
    super
    @app = options.app
    @pizza = options.pizza

    @listenTo @app, 'start:capture', @gifCapture
    @listenTo @app, 'restart:capture', @restart

    @renderer = new THREE.WebGLRenderer(
      preserveDrawingBuffer: true
      antialias: true
    )
    @renderer.setClearColor 0x000000, 1 
    @renderer.setSize @model.get('width'), @model.get('height')

    @camera = new THREE.PerspectiveCamera(
      @model.get('camera.angle'),
      @model.aspect(),
      @model.get('camera.near'),
      @model.get('camera.far')
    )
    
    @camera.position.z = @model.get('camera.position')['z']
    
    @scene = new THREE.Scene();
    @scene.add(@camera)
    
    @scene.add(@pizza.object)

    @light = new THREE.PointLight(0xFFFFFF)
    @light.position.x = 10
    @light.position.y = 50
    @light.position.z = 130

    @scene.add(@light)

  gifCapture: () =>
    return unless !@lock
    @lock = true

    @$el.addClass 'flipped'  
    gif = new GIF
      workers: 4
      workerScript: '/js/gif.worker.js'
      width: @model.get('width')
      height: @model.get('height')

    gif.on 'finished', @gifFinished
    gif.on 'progress', @gifProgress

    frameRate = 24
    duration = 2
    frames = frameRate * duration
    @delta = 1000 / frameRate

    capture = () =>
      frames = frames - 1
      gif.addFrame @renderer.context, {copy: true, delay: @delta}
      if frames <= 0
        @.off 'draw', capture
        gif.render()
        @delta = false

    @on "draw", capture

  gifProgress: (p) =>
    @$('.percent').html( Math.round(p * 100)+'%')

  gifFinished: (blob) =>
    @lock = false
    @gifView = new GifView blob: blob
    @$('.gifs').html @gifView.render().el
    @$el.addClass 'done'

  restart: () =>
    @gifView.destroy()
    @$el.removeClass 'flipped'
    @$el.removeClass 'done'




    

