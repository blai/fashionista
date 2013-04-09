(function() {
	function fashionista(themes) {
		this.themes = themes;
		for (var theme in themes) {
			$('head').append('<link rel="stylesheet" title="' + theme + '" href="' + themes[theme] + '" type="text/css" disabled="disabled" />');
		}
	}

	/**
	 * Request to apply a theme by name.
	 *
	 * @param  {String} theme Name of the theme intended to apply
	 * @return {Array}       Relative urls to each of the css of the requested theem
	 */
	fashionista.prototype.use = function(theme) {
		var self = this, links = [];
		$('link[rel*=style]').each(function(i) {
			this.disabled = true;
			if (this.getAttribute('title') === theme) {
				links.push(self.themes[theme]);
				this.disabled = false;
			}
		});
		return links;
	};

	return fashionista;
})();
