class exports.Scene extends Backbone.Model

  defaults:
    width: 600
    height: 300
    text: "Pizza"
    font: "helvetiker"
    style: "normal"
    weight: "normal"
    "material": "MeshPhongMaterial"
    "material.color": 0xCC00CC
    "material.ambient": 0xCC0000
    "material.emissive": 0x000000
    "material.color.hex": "#CC00CC"
    "material.ambient.hex": "#CC0000"
    "material.emissive.hex": "#000000"
    "camera.angle": 45
    "camera.near": 0.1
    "camera.far": 10000
    "camera.position":
        x: 0
        y: 0
        z: 130

  fonts: [
    'gentilis'
    'optimer'
    'helvetiker'
  ]

  materials: {
    Phong: "MeshPhongMaterial"
    Lambert: "MeshLambertMaterial"
  }

  initialize: () ->
    @on("change:material.color.hex", @setColorFromHex.bind(@, 'material.color'))
    @on("change:material.emissive.hex", @setColorFromHex.bind(@, 'material.emissive'))
    @on("change:material.ambient.hex", @setColorFromHex.bind(@, 'material.ambient'))

  setColorFromHex: (attribute, model, color, options) ->
    model.set(attribute, parseInt(color.slice(1), 16), options)

  aspect: () ->
    return @get('width') / @get('height')
