start-redis:
	~/database/redis-2.2.0-rc4/src/redis-server

t:
	nodeunit test/

zombie:
	node zombie-test/zombie.test.js

.PHONY: test activate zombie start-redis
