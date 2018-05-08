# SPVanilla

A simple project structure for promo-sites or multi-page applications. Provides a starter pack with
ready-to-use environment.
NOTE: all run command need execute from a project root folder.

## Features

* VanillaJS based
* jQuery-free (NOTE: jQuery can be added)
* Uses JADE - NODE template engine
* Uses LESS or SASS framework for stylesheets
* Allows to get the release in one command (NOTE: configurable)
* And many others!

## Get started

* Checkout this repository to your hard drive
* Download and install the latest version of [node.js](http://nodejs.org)
* Run `npm install` to install node modules
* Run `npm install -g webpack` to install Webpack
* Run `npm run serve`


* NOTE: the project uses LESS and SASS frameworks for CSS styles, that is compiled in runtime.
If you run this website on the file system, it is highly recommended to use Google Chrome with flag __--disable-web-security__.
As an option, you can also host the website on any server (IIS, node.js, Apache etc.).

## Tasks
* Run `npm run serve` to start the server and open project page
* Run `npm run debug` to start working with project
* Run `npm run deploy` to compile you project like dist version (minified and uglified) in dist folder

## Folder structure

* app - contains static files (fonts, images, documents, swf etc.)
	* resources - contains all static elements (fonts, images, documents, swf etc.)
	* scripts - contains all custom Javascript code
	* styles
		* css-contains all css files
		* scss-contains all scss files
		* less-contains all less files
	* pages - contains all JADE pages
	* templates - contains all JADE pages parts
	* index.js - file that consist of imports of style files and all js files( there you can add new js files or disable css frameworks)
* dist - this folder contain release or development version of site
