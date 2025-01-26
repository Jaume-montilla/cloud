const Redis = require('ioredis');

const redis = new Redis({
	host: 'localhost',
	port: 6379,
	db: 0

});

redis.on('connect', () => {
});

redis.on('error', (error) => {
	console.error('Error pwd o host o algo de esto anda mal:', error);
});

redis.set('Jaume-send-laura', 'Hola Laura que tal por galicia?')
	.then(() => {
		return redis.get('Jaume-send-laura');
	})
	.then((result) => {
		console.log('continua el msg donde lo dejaste:', result);
	})
	.catch((error) => {
		console.error('Redis se jodio:', error);
	});

