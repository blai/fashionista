# fashionista.js [![Build Status](https://secure.travis-ci.org/blai/fashionista.png?branch=master)](http://travis-ci.org/blai/fashionista)

> Apply customized themes to connect/express apps, based on the [Stylus port of Zurb Foundation theme](https://github.com/blai/foundation)


## Getting Started
`fashionista` comes with `Foundation v4` loaded. To decorating your express app with Foundation. In your express app, add the following code:
```javascript
var express = require('express');
var app = express();
var fashionista = require('fashionista');

fashionista().decorate(app);
```

And in your html code (note: `fashionista` requires either jQuery or Zepto's `$`  to work):

```html
<html>
  <head>
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script type="text/javascript" src="/fashionista"></script>
  </head>
  <body>
    <h1>your content ... </h1>
  </body>
</html>
```

### more themes please

Of course, you don't want to stop here. `fashionista` allows you to load more than one theme at a time. Here's how:

```javascript
var express = require('express');
var app = express();
var fashionista = require('fashionista');

fashionista([require('myTheme'), require('yourTheme')]).decorate(app);
```

When you have one or more themes loaded, the default `foundation` theme will be appended at the end of the list (if you manually included `foundation` in the list, the duplicated copy will not be appended). In any case (including when there is only `foundation` theme is loaded), the first in the list will be applied to your app. But you can easily switch the theme using what's `fashionista`'s client support using javascript:

```html
<html>
  <head>
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script type="text/javascript" src="/fashionista"></script>
    <script type="text/javascript">
      $(document).ready(function() {
        $('.myTheme').click(function() {
          fashionista.use('myTheme');
        })
        $('.yourTheme').click(function() {
          fashionista.use('yourTheme');
        })
      });
    </script>
  </head>
  <body>
    <h1>your content ... </h1>
    <button class='myTheme'>Apply myTheme</button>
    <button class='yourTheme'>Apply yourTheme</button>
  </body>
</html>
```
In the above code, clicking each button will apply the named theme respectively.


### more options please

As we see, integrating `fashionista` on html side is simply inserting the following line anywhere after your jQuery or Zepto:

```html
<script type="text/javascript" src="/fashionista"></script>
```

In fact, all themes managed by `fashionista` (and any assets being consumed by these themes) will all be loaded under the root `/fashionista`. For example, the `myTheme` in the previous example is mounted at `/fashionista/myTheme/myTheme.css`. If, for any reason, you dislike `fashionista` to be part of your path, you can change it like so:
```javascript
// in your express.js script
var express = require('express');
var app = express();
var fashionista = require('fashionista');

fashionista({
  themes: [require('myTheme'), require('yourTheme')],
  path: '/themes'
}).decorate(app);
```
Now your `myTheme` will be mounted at `/themes/myTheme/myTheme.css` after your integrate `fashionista` in html like so:
```html
<script type="text/javascript" src="/themes"></script>
```

If you like to make your code look less clunky, the following code is equivalent to the above:
```javascript
// in your express.js script
var express = require('express');
var app = express();
var Fashionista = require('fashionista');

var fashionista = new Fashionista({
  themes: [require('myTheme'), require('yourTheme')],
  path: '/themes'
});
fashionista.decorate(app);
```

### creating `fashionista`-compatible customized Foundation theme

`fashionista` only serve the [Stylus port of Foundation](https://github.com/blai/foundation) for now. With that in mind, your theme module should already be exporting a `plugin` function much like [this one](https://github.com/blai/foundation/blob/master/stylus/foundation.js). All variables being exported in the stylus port of foundation.js is required for any custom theme that is intended to work with `fashionista`.

It would be much easier if you use [generator-foundation](https://github.com/blai/generator-foundation) to generate your custome theme module project.

### examples
* [https://github.com/blai/foundation-theme-patience](https://github.com/blai/foundation-theme-patience) - a very simple custom foundation theme


## License
Copyright (c) 2013 Brian Lai Licensed under the MIT license.

## Release History


