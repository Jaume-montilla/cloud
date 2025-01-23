const ftpd = require('ftpd')
const fs = require('fs')
const path = require('path')

require('dotenv').config()

var keyFile
var certFile
var server

var options = {
	host: process.env.IP,
	port: process.env.PORT,
	tls: null,
}

if (process.env.KEY_FILE && process.env.CERT_FILE) {
	console.log('Running as FTPS server')
	if (process.env.KEY_FILE.charAt(0) !== '/') {
		keyFile = path.join(__dirname, process.env.KEY_FILE)
	}
	if (process.env.CERT_FILE.charAt(0) !== '/') {
		certFile = path.join(__dirname, process.env.CERT_FILE)
	}
	options.tls = {
		key: fs.readFileSync(keyFile),
		cert: fs.readFileSync(certFile),
		ca: !process.env.CA_FILES
			? null
			: process.env.CA_FILES.split(':').map(function (f) {
				return fs.readFileSync(f)
			}),
	}
}
const baseDir = path.join('./', '..', 'users');

server = new ftpd.FtpServer(options.host, {
	getInitialCwd: function () {
		return './';
	},
	getRoot: function () {
		return path.join(baseDir, process.env.usuari);
	},
	pasvPortRangeStart: 1025,
	pasvPortRangeEnd: 1050,
	tlsOptions: options.tls,
	allowUnauthorizedTls: true,
	useWriteFile: false,
	useReadFile: false,
	uploadMaxSlurpSize: 7000,
	allowedCommands: [
		'XMKD',
		'AUTH',
		'TLS',
		'SSL',
		'USER',
		'PASS',
		'PWD',
		'OPTS',
		'TYPE',
		'PORT',
		'PASV',
		'LIST',
		'CWD',
		'MKD',
		'SIZE',
		'STOR',
		'MDTM',
		'DELE',
		'QUIT',
		'RNFR',
		'RNTO',
		'EPSV',
		'EPRT',
	],
})

server.on('error', function (error) {
	console.log('FTP Server error:', error)
})

server.on('client:connected', function (connection) {
	var username = null

	console.log('client connected: ' + connection.remoteAddress)

	connection.on('command:mkd', function (dirName) {
		const userDir = path.join(baseDir, process.env.usuari, dirName);
		fs.mkdirSync(userDir, { recursive: true });
	});


	connection.on('command:user', function (user, success, failure) {
		if (user == process.env.usuari) {
			username = process.env.usuari
			success()
		} else {
			failure()
		}
	})

	connection.on('command:pass', function (pass, success, failure) {
		if (process.env.paswd == pass) {
			success(username)
		}
		else {
			failure()
		}
	})
})

server.debugging = 4
server.listen(options.port)
console.log('Listening on port ' + options.port)
