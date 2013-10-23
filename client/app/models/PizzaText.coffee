class exports.PizzaText extends Backbone.Model

  defaults:
    text: "Pizza Text"
    font: "droid sans"
    style: "normal"
    weight: "normal"
    size: 18
    height: 10
    vY: 0
    vX: 0
    vZ: 0
    bY: 40
    bX: 40
    bZ: 40
    bYe: false
    bXe: false
    bZe: false
    texture: 'images/pepperoni.png'

  textures: [
    'images/pizza.png'
    'images/bacon.png'
    'images/pepperoni.png'
    'images/supreme.png'
    'images/white.png'
  ]

  initialize: (options) ->
    super
    
    @object = new THREE.Object3D
    @createText()
    @animations = []
    @on 'change:text', @createText
    @on 'change:texture', @createText
    @on 'animate', @animate

  cycleTexture: () =>
    i = @textures.indexOf @get('texture')
    i = -1 if i >= @textures.length - 1
    @set 'texture', @textures[i+1]

  createText: () =>
    @object.remove @text
    return unless @get('text').length > 0

    @createGeometry()
    @createMaterial()
    @createMesh()

    @object.add @text

  createGeometry: () =>
    @geo = new THREE.TextGeometry(@get('text'), {
      size: @get('size'),
      height: @get('height'),
      curveSegments: 10,
      font: @get('font'),
      weight: @get('weight'),
      style: @get('style'),
      bevelEnabled: false
    })

  createMaterial: () =>
    texture = new THREE.ImageUtils.loadTexture @get('texture')
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set( 1/32, 1/32 )
    textureMaterial = new THREE.MeshBasicMaterial( { map: texture } )
    @material = new THREE.MeshFaceMaterial([textureMaterial])

  createMesh: () =>
    @text = new THREE.Mesh @geo, @material
    @geo.computeBoundingBox()
    @text.position.x = -0.5 * ( @geo.boundingBox.max.x - @geo.boundingBox.min.x )
    @text.position.y = -0.5 * ( @geo.boundingBox.max.y - @geo.boundingBox.min.y )

  toggleV: (prop) =>
    if @get(prop) > 0
      @set prop, 0
    else
      @set prop, Math.PI

  toggle: (prop) =>
    @set prop, !@get prop

  animate: (delta) =>
    @object.rotation.x += @get('vX') * (delta / 1000)
    @object.rotation.y += @get('vY') * (delta / 1000)
    @object.rotation.z += @get('vZ') * (delta / 1000)

    @bounce('x', 'bX', 20, delta) if @get 'bXe'
    @bounce('y', 'bY', 20, delta) if @get 'bYe'
    @bounce('z', 'bZ', 20, delta) if @get 'bZe'


  bounce: (axis, v, limit, delta) =>
    @object.position[axis] += @get(v) * (delta / 1000)
    if (@object.position[axis] > limit && @get(v) > 0) || (@object.position[axis] < -limit && @get(v) < 0)
      @set v, @get(v) * -1

    









