module.exports = {
	globDirectory: 'application/',
	globPatterns: [
		'**/*.{html,css,eot,ttf,woff,woff2,svg,js,json,png,jpg}'
	],
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	swDest: 'application/sw.js'
};