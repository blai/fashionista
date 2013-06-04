'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var temp = require('temp');
var stylus = require('stylus');
var connect = require('connect');

var client = fs.readFileSync(path.resolve(__dirname, '../browser/fashionista.js'), {encoding: 'utf8'});

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

	if (_.pluck(options.themes, 'theme').indexOf('foundation') === -1) {
		options.themes.push(require('foundation'));
	}

	if (!options.names) {
		options.names = _.pluck(options.themes.slice(), 'theme');
	}

	options.path = options.path || '/fashionista';
	if (options.path.charAt(0) !== '/') {
		options.path = '/' + options.path;
	}

	this.options = options;
}

fashionista.prototype.decorate = function(app) {
	var self = this;
	var themes = {};

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

		themes[theme.theme] = theme.url = mountPath + '/' + theme.theme + '.css';
	}, this);

	app.use(this.options.path, function(req, res, next) {
		if (req.url === '/') {
			res.type('application/javascript');
			res.send(client + ';var fashionista = new Fashionista(' + JSON.stringify(themes) + ', {themeList: ' + JSON.stringify(self.options.names) + '});fashionista.use("' + self.options.names[0] + '");');
		} else if (req.url === '/themes') {
			res.json({
				'themes': themes,
				'names': self.options.names
			});
		} else {
			next();
		}
	});

	app.use(this.options.path, connect['static'](path.resolve(__dirname, '../browser')));

	return this;
};

module.exports = fashionista;
