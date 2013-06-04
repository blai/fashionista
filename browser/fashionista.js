(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return (root.Fashionista = factory());
    });
  } else {
    root.Fashionista = factory();
  }
}(this, function () {
	'use strict';
  function Fashionista(themes, options) {
  	var self = this;
		self.themes = themes;
		self.options = (options || {});
		self.names = options.names || Object.keys(themes);

		if (!self.options.skipLink) {
			for (var theme in themes) {
				$('head').append('<link rel="stylesheet" title="' + theme + '" href="' + themes[theme] + '" type="text/css" disabled="disabled" />');
			}
		}

		if (!self.options.skipLib) {
			var libs = [
				'/fashionista/foundation/foundation/foundation.js',
				'/fashionista/foundation/foundation/foundation.alerts.js',
				'/fashionista/foundation/foundation/foundation.clearing.js',
				'/fashionista/foundation/foundation/foundation.cookie.js',
				'/fashionista/foundation/foundation/foundation.dropdown.js',
				'/fashionista/foundation/foundation/foundation.forms.js',
				'/fashionista/foundation/foundation/foundation.interchange.js',
				'/fashionista/foundation/foundation/foundation.joyride.js',
				'/fashionista/foundation/foundation/foundation.magellan.js',
				'/fashionista/foundation/foundation/foundation.orbit.js',
				'/fashionista/foundation/foundation/foundation.placeholder.js',
				'/fashionista/foundation/foundation/foundation.reveal.js',
				'/fashionista/foundation/foundation/foundation.section.js',
				'/fashionista/foundation/foundation/foundation.tooltips.js',
				'/fashionista/foundation/foundation/foundation.topbar.js'
			];
			var libLoaded = 0;

			libs.forEach(function(js) {
				$.getScript(js, function() {
					libLoaded++;
					if (libLoaded === libs.length) {
						self.init();
					}
				});
			});
		} else {
			self.init();
		}
	}

	Fashionista.prototype.init = function() {
		var d = $(document);
		d.foundation.apply(d, this.options.foundation);
	};

	/**
	 * Request to apply a theme by name.
	 *
	 * @param  {String} theme Name of the theme intended to apply
	 * @return {Array}       Relative urls to each of the css of the requested theem
	 */
	Fashionista.prototype.use = function(theme) {
		if (this.currentTheme !== theme) {
			if ('undefined' === typeof this.themes[theme]) {
				throw new Error('Theme: "' + theme + '" not loaded.');
			}
			var self = this, links = [];
			$('link[rel*=style]').each(function(i) {
				this.disabled = true;
				if (this.getAttribute('title') === theme) {
					links.push(self.themes[theme]);
					this.disabled = false;
				}
			});
			this.currentTheme = theme;
			return links;
		}
	};

	Fashionista.prototype.next = function() {
		var cur = this.names.indexOf(this.currentTheme);
		if (cur === -1 || (cur + 1) >= this.names.length) {
			cur = 0;
		} else {
			cur++;
		}
		this.use(this.names[cur]);
	};

	return Fashionista;
}));
