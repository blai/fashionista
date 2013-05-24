(function() {
	function fashionista(themes, options) {
		this.themes = themes;
		this.options = (options || {});
		this.themeList = options.themeList || Object.keys(themes);
		for (var theme in themes) {
			$('head').append('<link rel="stylesheet" title="' + theme + '" href="' + themes[theme] + '" type="text/css" disabled="disabled" />');
		}

		var libs = [
			'/fashionista/foundation/foundation/foundation.js',
			'/fashionista/foundation/foundation/foundation.alerts.js',
			'/fashionista/foundation/foundation/foundation.clearing.js',
			'/fashionista/foundation/foundation/foundation.cookie.js',
			'/fashionista/foundation/foundation/foundation.dropdown.js',
			'/fashionista/foundation/foundation/foundation.forms.js',
			'/fashionista/foundation/foundation/foundation.joyride.js',
			'/fashionista/foundation/foundation/foundation.magellan.js',
			'/fashionista/foundation/foundation/foundation.orbit.js',
			'/fashionista/foundation/foundation/foundation.placeholder.js',
			'/fashionista/foundation/foundation/foundation.reveal.js',
			'/fashionista/foundation/foundation/foundation.section.js',
			'/fashionista/foundation/foundation/foundation.section.js',
			'/fashionista/foundation/foundation/foundation.tooltips.js',
			'/fashionista/foundation/foundation/foundation.topbar.js'
		];
		var libLoaded = 0;

		libs.forEach(function(js) {
			$.getScript(js, function() {
				libLoaded++;
				if (libLoaded === libs.length) {
					$(document).foundation();
				}
			});
		});
	}

	/**
	 * Request to apply a theme by name.
	 *
	 * @param  {String} theme Name of the theme intended to apply
	 * @return {Array}       Relative urls to each of the css of the requested theem
	 */
	fashionista.prototype.use = function(theme) {
		if (this.currentTheme != theme) {
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

	fashionista.prototype.next = function() {
		var cur = this.themeList.indexOf(this.currentTheme);
		if (cur === -1 || (cur + 1) >= this.themeList.length) {
			cur = 0;
		} else {
			cur++;
		}
		this.use(this.themeList[cur]);
	}

	return fashionista;
})();
