var express = require('express');
var app = express.createServer();
var RedisStore = require('connect-redis');
var redis = require('redis');
var client = redis.createClient();

app.configure(function() {
	app.use(express.bodyDecoder());
	app.use(express.cookieDecoder());
	app.use(express.logger());
	app.use(express.session( {
		key : "123",
		secret : "123",
		store : new RedisStore( {
			maxAge : 10080000
		})
	}));
});

app.get('/', function(req, res) {
	res.render('index.jade', {
	    locals: {
            title: "test"
        }
	});
});

app.get('/test', function(req, res) {
    req.session.name = 'alfred';
    res.render('index.jade', {
        locals: {
            title: "test"
        }
    });
});

app.listen(3333, 'localhost');
