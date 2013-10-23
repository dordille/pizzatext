class exports.BaseView extends Backbone.View

  initialize: (options) ->
    @app = options.app

  template: (data) -> 
    require("views/templates/#{@templateName}")(data)

  render: (data) ->
    @$el.html @template data
    @

  show: ->
    @$el.off helpers.natives.transEnd
    @$el.show()
    _.defer => @$el.removeClass 'off'

  hide: ->
    @$el.addClass('off').on helpers.natives.transEnd, =>
      @$el.off helpers.natives.transEnd
      @$el.hide()