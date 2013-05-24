'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var temp = require('temp');
var stylus = require('stylus');
var connect = require('connect');

var client = fs.readFileSync(path.resolve(__dirname, './client.js'), {encoding: 'utf8'});

function stylusCompiler(dependencies) {
  dependencies = dependencies || [];

  return function (str, path) {
    var compile = stylus(str)
            .set('filename', path)
            .set('force', false)
            .set('compress', true);
    dependencies.forEach(function(dependency) {
      compile.use(dependency.call(dependency));
    });

    return compile;
  };
}

function fashionista(options) {
  /*jshint validthis:true */

  if (!(this instanceof fashionista)) {
    return new fashionista(options);
  }

  options = options || {};

  if (Array.isArray(options)) {
    options = {themes: options};
  }

  if (!options.themes) {
    options.themes = [];
  }

  options.providedThemes = options.themes.slice();

  if (_.pluck(options.themes, 'theme').indexOf('foundation') === -1) {
    options.themes.push(require('foundation'));
  }

  options.path = options.path || '/fashionista';
  if (options.path.charAt(0) !== '/') {
    options.path = '/' + options.path;
  }

  this.options = options;
}

fashionista.prototype.decorate = function(app) {
  var themes = {};
  var providedThemes = this.options.providedThemes;

  this.options.themes.forEach(function(theme) {
    var mountPath = [this.options.path, theme.theme].join('/');
    var buildPath = temp.mkdirSync([this.options.path, theme.theme].join('-'));
    app.use(mountPath, stylus.middleware({
      src: theme.path,
      dest: buildPath,
      compile: stylusCompiler(theme.dependencies)
    }));

    app.use(mountPath, connect['static'](buildPath));

    if (theme.assetPaths && theme.assetPaths.length > 0) {
      theme.assetPaths.forEach(function(aPath) {
        app.use(mountPath, connect['static'](aPath));
      });
    }

    themes[theme.theme] = mountPath + '/' + theme.theme + '.css';
  }, this);

  app.use(this.options.path, function(req, res, next) {
    if (req.url === '/') {
      res.type('application/javascript');
      res.send('var Fashionista = ' + client + 'var fashionista = new Fashionista(' + JSON.stringify(themes) + ', {themeList: ' + JSON.stringify(_.pluck(providedThemes, 'theme')) + '});fashionista.next();');
    } else {
      next();
    }
  });

  return this;
};

module.exports = fashionista;
