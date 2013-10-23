{BaseView} = require 'views/BaseView'
{Scene}    = require 'models/Scene'

class exports.ControlsView extends BaseView

    templateName: 'controls'
    className: 'controls'
    animations: []

    initialize: (options) ->
        super
        @pizza = options.pizza
        @app = options.app

        Mousetrap.bind 'alt+x', @pizza.toggleV.bind @pizza, 'vX'
        Mousetrap.bind 'alt+y', @pizza.toggleV.bind @pizza, 'vY'
        Mousetrap.bind 'alt+z', @pizza.toggleV.bind @pizza, 'vZ'

        @$el.delegate '[data-action="rotateX"]', 'click', @pizza.toggleV.bind @pizza, 'vX'
        @$el.delegate '[data-action="rotateY"]', 'click', @pizza.toggleV.bind @pizza, 'vY'
        @$el.delegate '[data-action="rotateZ"]', 'click', @pizza.toggleV.bind @pizza, 'vZ'

        @$el.delegate '[data-action="bounceX"]', 'click', @pizza.toggle.bind @pizza, 'bXe'
        @$el.delegate '[data-action="bounceY"]', 'click', @pizza.toggle.bind @pizza, 'bYe'
        @$el.delegate '[data-action="bounceZ"]', 'click', @pizza.toggle.bind @pizza, 'bZe'

        Mousetrap.bind 'shift+alt+x', @reset.bind @pizza.object.rotation, 'x'
        Mousetrap.bind 'shift+alt+y', @reset.bind @pizza.object.rotation, 'y'
        Mousetrap.bind 'shift+alt+z', @reset.bind @pizza.object.rotation, 'z'

        Mousetrap.bind 'alt+left', @pizza.cycleTexture

        @pizza.on 'change:vX', @toggleV.bind @, "rotateX"
        @pizza.on 'change:vY', @toggleV.bind @, "rotateY"
        @pizza.on 'change:vZ', @toggleV.bind @, "rotateZ"

        @pizza.on 'change:bXe', @toggleV.bind @, "bounceX"
        @pizza.on 'change:bYe', @toggleV.bind @, "bounceY"
        @pizza.on 'change:bZe', @toggleV.bind @, "bounceZ"

        @$el.delegate '[data-action="bake"]', 'click', @app.trigger.bind @app, 'start:capture'
        @$el.delegate '[data-action="setTexture"]', 'click', @setTexture
        @$el.delegate 'input.text', 'keyup', @setText

        @pizza.on 'change:texture', @updateTexture

    setText: (event) =>
        @pizza.set 'text', $(event.currentTarget).val()

    setTexture: (event) =>
        event.preventDefault()
        @pizza.set 'texture', event.currentTarget.dataset.texture

    updateTexture: () =>
        @$('.pizza_texture').removeClass('active')
        @$(".pizza_texture[data-texture='#{@pizza.get('texture')}']").addClass('active')

    toggleV: (action) =>
        @$("[data-action='#{action}']").toggleClass 'active'

    reset: (prop) ->
        @[prop] = 0

    toggleAnimation: (fn) ->
        i = @pizza.animations.indexOf fn
        if i >= 0
            @pizza.animations.splice( i, 1 )
        else
            @pizza.animations.push fn
        
    render: (data) =>
        @$el.html @template(model: @pizza)
        @updateTexture()
        @

