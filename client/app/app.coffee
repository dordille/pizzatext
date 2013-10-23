{Helpers}    = require 'lib/helpers'
{Router}     = require 'lib/router'
{Scene}      = require 'models/Scene'
{HeaderView} = require 'views/HeaderView'
{SceneView}  = require 'views/SceneView'
{ControlsView} = require 'views/ControlsView'
{PizzaText} = require 'models/PizzaText'

class Pizza extends Backbone.View
    constructor: ->
        @router = new Router

        @scene = new Scene
        @pizza = new PizzaText

        @views =
            header:     new HeaderView(app: @)
            scene:      new SceneView(pizza: @pizza, model: @scene, app: @)
            controls:   new ControlsView(pizza: @pizza, scene: @scene, app: @)

        $ =>
            @$body = $ document.body
            @$body.append v.render().el for k, v of @views
            @views.scene.attach()
            @views.header.show()

            Backbone.history.start pushState: true


window.app = new Pizza
window.helpers = new Helpers

