module.exports = {
	globDirectory: 'source/',
	globPatterns: [
		'**/*.{html,css,eot,ttf,woff,woff2,svg,js,json,png,jpg}'
	],
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	swDest: 'source/sw.js'
};