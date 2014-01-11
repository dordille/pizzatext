(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

window.require.register("app", function(exports, require, module) {
  var ControlsView, HeaderView, Helpers, Pizza, PizzaText, Router, Scene, SceneView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Helpers = require('lib/helpers').Helpers;

  Router = require('lib/router').Router;

  Scene = require('models/Scene').Scene;

  HeaderView = require('views/HeaderView').HeaderView;

  SceneView = require('views/SceneView').SceneView;

  ControlsView = require('views/ControlsView').ControlsView;

  PizzaText = require('models/PizzaText').PizzaText;

  Pizza = (function(_super) {
    __extends(Pizza, _super);

    function Pizza() {
      var _this = this;
      this.router = new Router;
      this.scene = new Scene;
      this.pizza = new PizzaText;
      this.views = {
        header: new HeaderView({
          app: this
        }),
        scene: new SceneView({
          pizza: this.pizza,
          model: this.scene,
          app: this
        }),
        controls: new ControlsView({
          pizza: this.pizza,
          scene: this.scene,
          app: this
        })
      };
      $(function() {
        var k, v, _ref;
        _this.$body = $(document.body);
        _ref = _this.views;
        for (k in _ref) {
          v = _ref[k];
          _this.$body.append(v.render().el);
        }
        _this.views.scene.attach();
        _this.views.header.show();
        return Backbone.history.start({
          pushState: true
        });
      });
    }

    return Pizza;

  })(Backbone.View);

  window.app = new Pizza;

  window.helpers = new Helpers;
  
});
window.require.register("lib/helpers", function(exports, require, module) {
  exports.Helpers = (function() {
    function Helpers() {
      this.natives = (function(_) {
        return {
          url: _.URL || _.webkitURL || _.mozURL,
          raf: _.requestAnimationFrame || _.webkitRequestAnimationFrame || _.mozRequestAnimationFrame || _.msRequestAnimationFrame || _.oRequestAnimationFrame,
          transEnd: (function() {
            var prop, testEl, transProps, val;
            testEl = document.createElement('div');
            transProps = {
              transition: 'transitionEnd',
              OTransition: 'oTransitionEnd',
              MSTransition: 'msTransitionEnd',
              MozTransition: 'transitionend',
              WebkitTransition: 'webkitTransitionEnd'
            };
            for (prop in transProps) {
              val = transProps[prop];
              if (testEl.style[prop] != null) {
                return val;
              }
            }
            return false;
          })()
        };
      })(window);
    }

    WebGLRenderingContext.prototype.getImageData = function(x, y, width, height) {
      var buffer, data, h, i, index1, index2, j, maxI, maxJ, tempCanvas, tempCtx, w;
      tempCanvas = document.createElement('canvas');
      tempCtx = tempCanvas.getContext('2d');
      data = tempCtx.createImageData(width, height);
      buffer = new Uint8Array(width * height * 4);
      this.readPixels(x, y, width, height, this.RGBA, this.UNSIGNED_BYTE, buffer);
      w = width * 4;
      h = height;
      i = 0;
      maxI = h / 2;
      while (i < maxI) {
        j = 0;
        maxJ = w;
        while (j < maxJ) {
          index1 = i * w + j;
          index2 = (h - i - 1) * w + j;
          data.data[index1] = buffer[index2];
          data.data[index2] = buffer[index1];
          ++j;
        }
        ++i;
      }
      return data;
    };

    return Helpers;

  })();
  
});
window.require.register("lib/querystring", function(exports, require, module) {
  /**
   * Object#toString() ref for stringify().
   */

  var toString = Object.prototype.toString;

  /**
   * Object#hasOwnProperty ref
   */

  var hasOwnProperty = Object.prototype.hasOwnProperty;

  /**
   * Array#indexOf shim.
   */

  var indexOf = typeof Array.prototype.indexOf === 'function'
    ? function(arr, el) { return arr.indexOf(el); }
    : function(arr, el) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] === el) return i;
        }
        return -1;
      };

  /**
   * Array.isArray shim.
   */

  var isArray = Array.isArray || function(arr) {
    return toString.call(arr) == '[object Array]';
  };

  /**
   * Object.keys shim.
   */

  var objectKeys = Object.keys || function(obj) {
    var ret = [];
    for (var key in obj) ret.push(key);
    return ret;
  };

  /**
   * Array#forEach shim.
   */

  var forEach = typeof Array.prototype.forEach === 'function'
    ? function(arr, fn) { return arr.forEach(fn); }
    : function(arr, fn) {
        for (var i = 0; i < arr.length; i++) fn(arr[i]);
      };

  /**
   * Array#reduce shim.
   */

  var reduce = function(arr, fn, initial) {
    if (typeof arr.reduce === 'function') return arr.reduce(fn, initial);
    var res = initial;
    for (var i = 0; i < arr.length; i++) res = fn(res, arr[i]);
    return res;
  };

  /**
   * Create a nullary object if possible
   */

  function createObject() {
    return Object.create
      ? Object.create(null)
      : {};
  }

  /**
   * Cache non-integer test regexp.
   */

  var isint = /^[0-9]+$/;

  function promote(parent, key) {
    if (parent[key].length == 0) return parent[key] = createObject();
    var t = createObject();
    for (var i in parent[key]) {
      if (hasOwnProperty.call(parent[key], i)) {
        t[i] = parent[key][i];
      }
    }
    parent[key] = t;
    return t;
  }

  function parse(parts, parent, key, val) {
    var part = parts.shift();
    // end
    if (!part) {
      if (isArray(parent[key])) {
        parent[key].push(val);
      } else if ('object' == typeof parent[key]) {
        parent[key] = val;
      } else if ('undefined' == typeof parent[key]) {
        parent[key] = val;
      } else {
        parent[key] = [parent[key], val];
      }
      // array
    } else {
      var obj = parent[key] = parent[key] || [];
      if (']' == part) {
        if (isArray(obj)) {
          if ('' != val) obj.push(val);
        } else if ('object' == typeof obj) {
          obj[objectKeys(obj).length] = val;
        } else {
          obj = parent[key] = [parent[key], val];
        }
        // prop
      } else if (~indexOf(part, ']')) {
        part = part.substr(0, part.length - 1);
        if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
        parse(parts, obj, part, val);
        // key
      } else {
        if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
        parse(parts, obj, part, val);
      }
    }
  }

  /**
   * Merge parent key/val pair.
   */

  function merge(parent, key, val){
    if (~indexOf(key, ']')) {
      var parts = key.split('[')
        , len = parts.length
        , last = len - 1;
      parse(parts, parent, 'base', val);
      // optimize
    } else {
      if (!isint.test(key) && isArray(parent.base)) {
        var t = createObject();
        for (var k in parent.base) t[k] = parent.base[k];
        parent.base = t;
      }
      set(parent.base, key, val);
    }

    return parent;
  }

  /**
   * Compact sparse arrays.
   */

  function compact(obj) {
    if ('object' != typeof obj) return obj;

    if (isArray(obj)) {
      var ret = [];

      for (var i in obj) {
        if (hasOwnProperty.call(obj, i)) {
          ret.push(obj[i]);
        }
      }

      return ret;
    }

    for (var key in obj) {
      obj[key] = compact(obj[key]);
    }

    return obj;
  }

  /**
   * Restore Object.prototype.
   * see pull-request #58
   */

  function restoreProto(obj) {
    if (!Object.create) return obj;
    if (isArray(obj)) return obj;
    if (obj && 'object' != typeof obj) return obj;

    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) {
        obj[key] = restoreProto(obj[key]);
      }
    }

    obj.__proto__ = Object.prototype;
    return obj;
  }

  /**
   * Parse the given obj.
   */

  function parseObject(obj){
    var ret = { base: {} };

    forEach(objectKeys(obj), function(name){
      merge(ret, name, obj[name]);
    });

    return compact(ret.base);
  }

  /**
   * Parse the given str.
   */

  function parseString(str){
    var ret = reduce(String(str).split('&'), function(ret, pair){
      var eql = indexOf(pair, '=')
        , brace = lastBraceInKey(pair)
        , key = pair.substr(0, brace || eql)
        , val = pair.substr(brace || eql, pair.length)
        , val = val.substr(indexOf(val, '=') + 1, val.length);

      // ?foo
      if ('' == key) key = pair, val = '';
      if ('' == key) return ret;

      return merge(ret, decode(key), decode(val));
    }, { base: createObject() }).base;

    return restoreProto(compact(ret));
  }

  /**
   * Parse the given query `str` or `obj`, returning an object.
   *
   * @param {String} str | {Object} obj
   * @return {Object}
   * @api public
   */

  exports.parse = function(str){
    if (null == str || '' == str) return {};
    return 'object' == typeof str
      ? parseObject(str)
      : parseString(str);
  };

  /**
   * Turn the given `obj` into a query string
   *
   * @param {Object} obj
   * @return {String}
   * @api public
   */

  var stringify = exports.stringify = function(obj, prefix) {
    if (isArray(obj)) {
      return stringifyArray(obj, prefix);
    } else if ('[object Object]' == toString.call(obj)) {
      return stringifyObject(obj, prefix);
    } else if ('string' == typeof obj) {
      return stringifyString(obj, prefix);
    } else {
      return prefix + '=' + encodeURIComponent(String(obj));
    }
  };

  /**
   * Stringify the given `str`.
   *
   * @param {String} str
   * @param {String} prefix
   * @return {String}
   * @api private
   */

  function stringifyString(str, prefix) {
    if (!prefix) throw new TypeError('stringify expects an object');
    return prefix + '=' + encodeURIComponent(str);
  }

  /**
   * Stringify the given `arr`.
   *
   * @param {Array} arr
   * @param {String} prefix
   * @return {String}
   * @api private
   */

  function stringifyArray(arr, prefix) {
    var ret = [];
    if (!prefix) throw new TypeError('stringify expects an object');
    for (var i = 0; i < arr.length; i++) {
      ret.push(stringify(arr[i], prefix + '[' + i + ']'));
    }
    return ret.join('&');
  }

  /**
   * Stringify the given `obj`.
   *
   * @param {Object} obj
   * @param {String} prefix
   * @return {String}
   * @api private
   */

  function stringifyObject(obj, prefix) {
    var ret = []
      , keys = objectKeys(obj)
      , key;

    for (var i = 0, len = keys.length; i < len; ++i) {
      key = keys[i];
      if ('' == key) continue;
      if (null == obj[key]) {
        ret.push(encodeURIComponent(key) + '=');
      } else {
        ret.push(stringify(obj[key], prefix
          ? prefix + '[' + encodeURIComponent(key) + ']'
          : encodeURIComponent(key)));
      }
    }

    return ret.join('&');
  }

  /**
   * Set `obj`'s `key` to `val` respecting
   * the weird and wonderful syntax of a qs,
   * where "foo=bar&foo=baz" becomes an array.
   *
   * @param {Object} obj
   * @param {String} key
   * @param {String} val
   * @api private
   */

  function set(obj, key, val) {
    var v = obj[key];
    if (undefined === v) {
      obj[key] = val;
    } else if (isArray(v)) {
      v.push(val);
    } else {
      obj[key] = [v, val];
    }
  }

  /**
   * Locate last brace in `str` within the key.
   *
   * @param {String} str
   * @return {Number}
   * @api private
   */

  function lastBraceInKey(str) {
    var len = str.length
      , brace
      , c;
    for (var i = 0; i < len; ++i) {
      c = str[i];
      if (']' == c) brace = false;
      if ('[' == c) brace = true;
      if ('=' == c && !brace) return i;
    }
  }

  /**
   * Decode `str`.
   *
   * @param {String} str
   * @return {String}
   * @api private
   */

  function decode(str) {
    try {
      return decodeURIComponent(str.replace(/\+/g, ' '));
    } catch (err) {
      return str;
    }
  }
  
});
window.require.register("lib/router", function(exports, require, module) {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  exports.Router = (function(_super) {
    __extends(Router, _super);

    function Router() {
      _ref = Router.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Router.prototype.routes = {
      '': 'home'
    };

    Router.prototype.home = function() {};

    return Router;

  })(Backbone.Router);
  
});
window.require.register("models/PizzaText", function(exports, require, module) {
  var _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  exports.PizzaText = (function(_super) {
    __extends(PizzaText, _super);

    function PizzaText() {
      this.bounce = __bind(this.bounce, this);
      this.animate = __bind(this.animate, this);
      this.toggle = __bind(this.toggle, this);
      this.toggleV = __bind(this.toggleV, this);
      this.createMesh = __bind(this.createMesh, this);
      this.createMaterial = __bind(this.createMaterial, this);
      this.createGeometry = __bind(this.createGeometry, this);
      this.createText = __bind(this.createText, this);
      this.cycleTexture = __bind(this.cycleTexture, this);
      _ref = PizzaText.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PizzaText.prototype.defaults = {
      text: "Pizza Text",
      font: "droid sans",
      style: "normal",
      weight: "normal",
      size: 18,
      height: 10,
      vY: 0,
      vX: 0,
      vZ: 0,
      bY: 40,
      bX: 40,
      bZ: 40,
      bYe: false,
      bXe: false,
      bZe: false,
      texture: 'images/pepperoni.png'
    };

    PizzaText.prototype.textures = ['images/pizza.png', 'images/bacon.png', 'images/pepperoni.png', 'images/supreme.png', 'images/white.png'];

    PizzaText.prototype.initialize = function(options) {
      PizzaText.__super__.initialize.apply(this, arguments);
      this.object = new THREE.Object3D;
      this.createText();
      this.animations = [];
      this.on('change:text', this.createText);
      this.on('change:texture', this.createText);
      return this.on('animate', this.animate);
    };

    PizzaText.prototype.cycleTexture = function() {
      var i;
      i = this.textures.indexOf(this.get('texture'));
      if (i >= this.textures.length - 1) {
        i = -1;
      }
      return this.set('texture', this.textures[i + 1]);
    };

    PizzaText.prototype.createText = function() {
      this.object.remove(this.text);
      if (!(this.get('text').length > 0)) {
        return;
      }
      this.createGeometry();
      this.createMaterial();
      this.createMesh();
      return this.object.add(this.text);
    };

    PizzaText.prototype.createGeometry = function() {
      return this.geo = new THREE.TextGeometry(this.get('text'), {
        size: this.get('size'),
        height: this.get('height'),
        curveSegments: 10,
        font: this.get('font'),
        weight: this.get('weight'),
        style: this.get('style'),
        bevelEnabled: false
      });
    };

    PizzaText.prototype.createMaterial = function() {
      var texture, textureMaterial;
      texture = new THREE.ImageUtils.loadTexture(this.get('texture'));
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1 / 32, 1 / 32);
      textureMaterial = new THREE.MeshBasicMaterial({
        map: texture
      });
      return this.material = new THREE.MeshFaceMaterial([textureMaterial]);
    };

    PizzaText.prototype.createMesh = function() {
      this.text = new THREE.Mesh(this.geo, this.material);
      this.geo.computeBoundingBox();
      this.text.position.x = -0.5 * (this.geo.boundingBox.max.x - this.geo.boundingBox.min.x);
      return this.text.position.y = -0.5 * (this.geo.boundingBox.max.y - this.geo.boundingBox.min.y);
    };

    PizzaText.prototype.toggleV = function(prop) {
      if (this.get(prop) > 0) {
        return this.set(prop, 0);
      } else {
        return this.set(prop, Math.PI);
      }
    };

    PizzaText.prototype.toggle = function(prop) {
      return this.set(prop, !this.get(prop));
    };

    PizzaText.prototype.animate = function(delta) {
      this.object.rotation.x += this.get('vX') * (delta / 1000);
      this.object.rotation.y += this.get('vY') * (delta / 1000);
      this.object.rotation.z += this.get('vZ') * (delta / 1000);
      if (this.get('bXe')) {
        this.bounce('x', 'bX', 20, delta);
      }
      if (this.get('bYe')) {
        this.bounce('y', 'bY', 20, delta);
      }
      if (this.get('bZe')) {
        return this.bounce('z', 'bZ', 20, delta);
      }
    };

    PizzaText.prototype.bounce = function(axis, v, limit, delta) {
      this.object.position[axis] += this.get(v) * (delta / 1000);
      if ((this.object.position[axis] > limit && this.get(v) > 0) || (this.object.position[axis] < -limit && this.get(v) < 0)) {
        return this.set(v, this.get(v) * -1);
      }
    };

    return PizzaText;

  })(Backbone.Model);
  
});
window.require.register("models/Scene", function(exports, require, module) {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  exports.Scene = (function(_super) {
    __extends(Scene, _super);

    function Scene() {
      _ref = Scene.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Scene.prototype.defaults = {
      width: 600,
      height: 300,
      text: "Pizza",
      font: "helvetiker",
      style: "normal",
      weight: "normal",
      "material": "MeshPhongMaterial",
      "material.color": 0xCC00CC,
      "material.ambient": 0xCC0000,
      "material.emissive": 0x000000,
      "material.color.hex": "#CC00CC",
      "material.ambient.hex": "#CC0000",
      "material.emissive.hex": "#000000",
      "camera.angle": 45,
      "camera.near": 0.1,
      "camera.far": 10000,
      "camera.position": {
        x: 0,
        y: 0,
        z: 130
      }
    };

    Scene.prototype.fonts = ['gentilis', 'optimer', 'helvetiker'];

    Scene.prototype.materials = {
      Phong: "MeshPhongMaterial",
      Lambert: "MeshLambertMaterial"
    };

    Scene.prototype.initialize = function() {
      this.on("change:material.color.hex", this.setColorFromHex.bind(this, 'material.color'));
      this.on("change:material.emissive.hex", this.setColorFromHex.bind(this, 'material.emissive'));
      return this.on("change:material.ambient.hex", this.setColorFromHex.bind(this, 'material.ambient'));
    };

    Scene.prototype.setColorFromHex = function(attribute, model, color, options) {
      return model.set(attribute, parseInt(color.slice(1), 16), options);
    };

    Scene.prototype.aspect = function() {
      return this.get('width') / this.get('height');
    };

    return Scene;

  })(Backbone.Model);
  
});
window.require.register("views/BaseView", function(exports, require, module) {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  exports.BaseView = (function(_super) {
    __extends(BaseView, _super);

    function BaseView() {
      _ref = BaseView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    BaseView.prototype.initialize = function(options) {
      return this.app = options.app;
    };

    BaseView.prototype.template = function(data) {
      return require("views/templates/" + this.templateName)(data);
    };

    BaseView.prototype.render = function(data) {
      this.$el.html(this.template(data));
      return this;
    };

    BaseView.prototype.show = function() {
      var _this = this;
      this.$el.off(helpers.natives.transEnd);
      this.$el.show();
      return _.defer(function() {
        return _this.$el.removeClass('off');
      });
    };

    BaseView.prototype.hide = function() {
      var _this = this;
      return this.$el.addClass('off').on(helpers.natives.transEnd, function() {
        _this.$el.off(helpers.natives.transEnd);
        return _this.$el.hide();
      });
    };

    return BaseView;

  })(Backbone.View);
  
});
window.require.register("views/ControlsView", function(exports, require, module) {
  var BaseView, Scene, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseView = require('views/BaseView').BaseView;

  Scene = require('models/Scene').Scene;

  exports.ControlsView = (function(_super) {
    __extends(ControlsView, _super);

    function ControlsView() {
      this.render = __bind(this.render, this);
      this.toggleV = __bind(this.toggleV, this);
      this.updateTexture = __bind(this.updateTexture, this);
      this.setTexture = __bind(this.setTexture, this);
      this.setText = __bind(this.setText, this);
      _ref = ControlsView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ControlsView.prototype.templateName = 'controls';

    ControlsView.prototype.className = 'controls';

    ControlsView.prototype.animations = [];

    ControlsView.prototype.initialize = function(options) {
      ControlsView.__super__.initialize.apply(this, arguments);
      this.pizza = options.pizza;
      this.app = options.app;
      Mousetrap.bind('alt+x', this.pizza.toggleV.bind(this.pizza, 'vX'));
      Mousetrap.bind('alt+y', this.pizza.toggleV.bind(this.pizza, 'vY'));
      Mousetrap.bind('alt+z', this.pizza.toggleV.bind(this.pizza, 'vZ'));
      this.$el.delegate('[data-action="rotateX"]', 'click', this.pizza.toggleV.bind(this.pizza, 'vX'));
      this.$el.delegate('[data-action="rotateY"]', 'click', this.pizza.toggleV.bind(this.pizza, 'vY'));
      this.$el.delegate('[data-action="rotateZ"]', 'click', this.pizza.toggleV.bind(this.pizza, 'vZ'));
      this.$el.delegate('[data-action="bounceX"]', 'click', this.pizza.toggle.bind(this.pizza, 'bXe'));
      this.$el.delegate('[data-action="bounceY"]', 'click', this.pizza.toggle.bind(this.pizza, 'bYe'));
      this.$el.delegate('[data-action="bounceZ"]', 'click', this.pizza.toggle.bind(this.pizza, 'bZe'));
      Mousetrap.bind('shift+alt+x', this.reset.bind(this.pizza.object.rotation, 'x'));
      Mousetrap.bind('shift+alt+y', this.reset.bind(this.pizza.object.rotation, 'y'));
      Mousetrap.bind('shift+alt+z', this.reset.bind(this.pizza.object.rotation, 'z'));
      Mousetrap.bind('alt+left', this.pizza.cycleTexture);
      this.pizza.on('change:vX', this.toggleV.bind(this, "rotateX"));
      this.pizza.on('change:vY', this.toggleV.bind(this, "rotateY"));
      this.pizza.on('change:vZ', this.toggleV.bind(this, "rotateZ"));
      this.pizza.on('change:bXe', this.toggleV.bind(this, "bounceX"));
      this.pizza.on('change:bYe', this.toggleV.bind(this, "bounceY"));
      this.pizza.on('change:bZe', this.toggleV.bind(this, "bounceZ"));
      this.$el.delegate('[data-action="bake"]', 'click', this.app.trigger.bind(this.app, 'start:capture'));
      this.$el.delegate('[data-action="setTexture"]', 'click', this.setTexture);
      this.$el.delegate('input.text', 'keyup', this.setText);
      return this.pizza.on('change:texture', this.updateTexture);
    };

    ControlsView.prototype.setText = function(event) {
      return this.pizza.set('text', $(event.currentTarget).val());
    };

    ControlsView.prototype.setTexture = function(event) {
      event.preventDefault();
      return this.pizza.set('texture', event.currentTarget.dataset.texture);
    };

    ControlsView.prototype.updateTexture = function() {
      this.$('.pizza_texture').removeClass('active');
      return this.$(".pizza_texture[data-texture='" + (this.pizza.get('texture')) + "']").addClass('active');
    };

    ControlsView.prototype.toggleV = function(action) {
      return this.$("[data-action='" + action + "']").toggleClass('active');
    };

    ControlsView.prototype.reset = function(prop) {
      return this[prop] = 0;
    };

    ControlsView.prototype.toggleAnimation = function(fn) {
      var i;
      i = this.pizza.animations.indexOf(fn);
      if (i >= 0) {
        return this.pizza.animations.splice(i, 1);
      } else {
        return this.pizza.animations.push(fn);
      }
    };

    ControlsView.prototype.render = function(data) {
      this.$el.html(this.template({
        model: this.pizza
      }));
      this.updateTexture();
      return this;
    };

    return ControlsView;

  })(BaseView);
  
});
window.require.register("views/GifView", function(exports, require, module) {
  var BaseView, qs, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseView = require('views/BaseView').BaseView;

  qs = require('lib/querystring');

  exports.GifView = (function(_super) {
    __extends(GifView, _super);

    function GifView() {
      this._share = __bind(this._share, this);
      this.share = __bind(this.share, this);
      this.updateImageElement = __bind(this.updateImageElement, this);
      _ref = GifView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    GifView.prototype.templateName = 'gif';

    GifView.prototype.className = 'view gif';

    GifView.prototype.events = {
      'click .tumblr_share': 'share'
    };

    GifView.prototype.initialize = function(options) {
      GifView.__super__.initialize.apply(this, arguments);
      this.blob = options.blob;
      this.dataURL = URL.createObjectURL(this.blob);
      this.uploadDeferred = this.upload();
      return this.uploadDeferred.done(this.updateImageElement);
    };

    GifView.prototype.render = function() {
      this.$el.html(this.template({
        imgsrc: this.dataURL
      }));
      return this;
    };

    GifView.prototype.upload = function() {
      var def, req,
        _this = this;
      def = new $.Deferred();
      req = $.get('/upload/url');
      req.done(function(url) {
        var xhr;
        _this.publicURL = url.substring(0, url.indexOf('?'));
        xhr = new XMLHttpRequest;
        xhr.open('PUT', url, true);
        xhr.setRequestHeader('Content-Type', 'image/gif');
        xhr.setRequestHeader('x-amz-acl', 'public-read');
        xhr.onprogress = def.notify;
        xhr.onload = def.resolve;
        xhr.onerror = def.reject;
        return xhr.send(_this.blob);
      });
      return def.promise();
    };

    GifView.prototype.updateImageElement = function() {
      var image,
        _this = this;
      image = new Image;
      image.src = this.publicURL;
      return image.onload = function() {
        return _this.$('img').attr('src', _this.publicURL);
      };
    };

    GifView.prototype.share = function(event) {
      event.preventDefault();
      if (this.uploadDeferred.state() !== 'pending') {
        return this._share();
      }
      this.$('share').addClass('loading');
      return this.uploadDeferred.done(this._share);
    };

    GifView.prototype._share = function() {
      var url;
      this.$('.tumblr_share').removeClass('loading');
      url = "http://www.tumblr.com/share/photo?" + qs.stringify({
        source: this.publicURL,
        tags: ['pizzatext', 'pizza'].join(',')
      });
      return window.open(url, "_blank", "width=500px,height=500px");
    };

    return GifView;

  })(BaseView);
  
});
window.require.register("views/HeaderView", function(exports, require, module) {
  var BaseView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseView = require('views/BaseView').BaseView;

  exports.HeaderView = (function(_super) {
    __extends(HeaderView, _super);

    function HeaderView() {
      _ref = HeaderView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    HeaderView.prototype.templateName = 'header';

    return HeaderView;

  })(BaseView);
  
});
window.require.register("views/SceneView", function(exports, require, module) {
  var BaseView, GifView, PizzaText, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseView = require('views/BaseView').BaseView;

  GifView = require('views/GifView').GifView;

  PizzaText = require('models/PizzaText').PizzaText;

  exports.SceneView = (function(_super) {
    __extends(SceneView, _super);

    function SceneView() {
      this.restart = __bind(this.restart, this);
      this.gifFinished = __bind(this.gifFinished, this);
      this.gifProgress = __bind(this.gifProgress, this);
      this.gifCapture = __bind(this.gifCapture, this);
      this.draw = __bind(this.draw, this);
      _ref = SceneView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    SceneView.prototype.templateName = 'scene';

    SceneView.prototype.className = 'view scene';

    SceneView.prototype.attach = function() {
      this.$('.canvas').append(this.renderer.domElement);
      this.lastDraw = new Date;
      return this.draw();
    };

    SceneView.prototype.draw = function(data) {
      var delta;
      if (this.delta) {
        delta = this.delta;
      } else {
        delta = new Date - this.lastDraw;
      }
      this.pizza.trigger('animate', delta);
      this.trigger('draw', {
        delta: delta
      });
      this.renderer.render(this.scene, this.camera);
      this.lastDraw = new Date;
      return requestAnimationFrame(this.draw);
    };

    SceneView.prototype.initialize = function(options) {
      SceneView.__super__.initialize.apply(this, arguments);
      this.app = options.app;
      this.pizza = options.pizza;
      this.listenTo(this.app, 'start:capture', this.gifCapture);
      this.listenTo(this.app, 'restart:capture', this.restart);
      this.renderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer: true,
        antialias: true
      });
      this.renderer.setClearColor(0x000000, 1);
      this.renderer.setSize(this.model.get('width'), this.model.get('height'));
      this.camera = new THREE.PerspectiveCamera(this.model.get('camera.angle'), this.model.aspect(), this.model.get('camera.near'), this.model.get('camera.far'));
      this.camera.position.z = this.model.get('camera.position')['z'];
      this.scene = new THREE.Scene();
      this.scene.add(this.camera);
      this.scene.add(this.pizza.object);
      this.light = new THREE.PointLight(0xFFFFFF);
      this.light.position.x = 10;
      this.light.position.y = 50;
      this.light.position.z = 130;
      return this.scene.add(this.light);
    };

    SceneView.prototype.gifCapture = function() {
      var capture, duration, frameRate, frames, gif,
        _this = this;
      if (!!this.lock) {
        return;
      }
      this.lock = true;
      this.$el.addClass('flipped');
      gif = new GIF({
        workers: 4,
        workerScript: '/js/gif.worker.js',
        width: this.model.get('width'),
        height: this.model.get('height')
      });
      gif.on('finished', this.gifFinished);
      gif.on('progress', this.gifProgress);
      frameRate = 24;
      duration = 2;
      frames = frameRate * duration;
      this.delta = 1000 / frameRate;
      capture = function() {
        frames = frames - 1;
        gif.addFrame(_this.renderer.context, {
          copy: true,
          delay: _this.delta
        });
        if (frames <= 0) {
          _this.off('draw', capture);
          gif.render();
          return _this.delta = false;
        }
      };
      return this.on("draw", capture);
    };

    SceneView.prototype.gifProgress = function(p) {
      return this.$('.percent').html(Math.round(p * 100) + '%');
    };

    SceneView.prototype.gifFinished = function(blob) {
      this.lock = false;
      this.gifView = new GifView({
        blob: blob
      });
      this.$('.gifs').html(this.gifView.render().el);
      return this.$el.addClass('done');
    };

    SceneView.prototype.restart = function() {
      this.gifView.destroy();
      this.$el.removeClass('flipped');
      return this.$el.removeClass('done');
    };

    return SceneView;

  })(BaseView);
  
});
window.require.register("views/templates/controls", function(exports, require, module) {
  module.exports = function anonymous(locals) {
  var buf = [];
  var locals_ = (locals || {}),model = locals_.model;buf.push("<div class=\"row\"><a data-action=\"rotateX\" class=\"pizza_button\">Rotate X</a><a data-action=\"rotateY\" class=\"pizza_button\">Rotate Y</a><a data-action=\"rotateZ\" class=\"pizza_button\">Rotate Z</a></div><div class=\"row\"><a data-action=\"bounceX\" class=\"pizza_button\">Bounce X</a><a data-action=\"bounceY\" class=\"pizza_button\">Bounce Y</a><a data-action=\"bounceZ\" class=\"pizza_button\">Bounce Z</a></div><div class=\"row textures\">");
  // iterate model.textures
  ;(function(){
    var $$obj = model.textures;
    if ('number' == typeof $$obj.length) {

      for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
        var texture = $$obj[$index];

  buf.push("<a" + (jade.attrs({ 'data-action':("setTexture"), 'data-texture':(texture), "class": [('pizza_texture')] }, {"data-action":true,"data-texture":true})) + "><img" + (jade.attrs({ 'src':(texture) }, {"src":true})) + "/></a>");
      }

    } else {
      var $$l = 0;
      for (var $index in $$obj) {
        $$l++;      var texture = $$obj[$index];

  buf.push("<a" + (jade.attrs({ 'data-action':("setTexture"), 'data-texture':(texture), "class": [('pizza_texture')] }, {"data-action":true,"data-texture":true})) + "><img" + (jade.attrs({ 'src':(texture) }, {"src":true})) + "/></a>");
      }

    }
  }).call(this);

  buf.push("</div><div class=\"row text\"><input" + (jade.attrs({ 'type':("text"), 'value':(model.get('text')), "class": [("text")] }, {"type":true,"class":true,"value":true})) + "/></div><div class=\"row last\"><a data-action=\"bake\" class=\"bake\">Bake</a></div><div class=\"right\"></div><div class=\"bottom\"></div>");;return buf.join("");
  };
});
window.require.register("views/templates/gif", function(exports, require, module) {
  module.exports = function anonymous(locals) {
  var buf = [];
  var locals_ = (locals || {}),imgsrc = locals_.imgsrc;buf.push("<a href=\"#\" title=\"Back\" class=\"scratch\">Back</a><img" + (jade.attrs({ 'src':(imgsrc), "class": [('gif')] }, {"src":true})) + "/><a href=\"#\" title=\"Share on Tumblr\" class=\"tumblr_share\">Share on Tumblr</a>");;return buf.join("");
  };
});
window.require.register("views/templates/header", function(exports, require, module) {
  module.exports = function anonymous(locals) {
  var buf = [];
  ;return buf.join("");
  };
});
window.require.register("views/templates/scene", function(exports, require, module) {
  module.exports = function anonymous(locals) {
  var buf = [];
  buf.push("<div class=\"front\"><div class=\"canvas\"></div></div><div class=\"back\"><div class=\"progress\"><div class=\"pizza\"></div><div class=\"percent\"></div></div><div class=\"gifs\"></div></div>");;return buf.join("");
  };
});
