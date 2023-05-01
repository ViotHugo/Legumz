var zombie = require("zombie");
var assert = require("assert");
var redis = require("redis");
//var client = redis.createClient();
//client.flushdb();

// Load the page from localhost
zombie.visit("http://localhost:3333/", {
	debug : false
},
function(err, browser, status) {
	if (err) {
		throw (err.message);
	}

    assert.equal(browser.text("title"), "test");
});
