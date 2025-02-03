import ftpd from 'ftpd'
import fs from 'fs'
import path from 'path'

const baseDir = path.join('./', '..', 'users');

function startFtpServer(username) {
	const options = {
		host: '127.0.0.1',
		port: 9876,
		tls: null,
	};

	let server = new ftpd.FtpServer(options.host, {
		getInitialCwd: function () {
			return './';
		},
		getRoot: function () {
			return path.join(baseDir, username);
		},
		pasvPortRangeStart: 1025,
		pasvPortRangeEnd: 1050,
		tlsOptions: options.tls,
		allowUnauthorizedTls: true,
		useWriteFile: false,
		useReadFile: false,
		uploadMaxSlurpSize: 7000,
		allowedCommands: [
			'XMKD', 'AUTH', 'TLS', 'SSL', 'USER', 'PASS', 'PWD', 'OPTS', 'TYPE',
			'PORT', 'PASV', 'LIST', 'CWD', 'MKD', 'SIZE', 'STOR', 'MDTM', 'DELE',
			'QUIT', 'RNFR', 'RNTO', 'EPSV', 'EPRT', 'RETR', 'NLST'
		]
	});

	server.on('error', function (error) {
		console.log('FTP Server error:', error)
	})

	server.on('client:connected', function (connection) {
		console.log('client connected: ' + connection.remoteAddress)

		connection.on('command:mkd', function (dirName) {
			const userDir = path.join(baseDir, process.env.usuari, dirName);
			fs.mkdirSync(userDir, { recursive: true });
		});


		connection.on('command:user', function (user, success, failure) {
			if (user == username) {
				success()
			} else {
				failure()
			}
		})

		connection.on('command:pass', function (pass, success, failure) {
			success(username)
		})
	})


	server.debugging = 4;
	server.listen(options.port);
	console.log('FTP Server listening on port ' + options.port);
}

export default startFtpServer;

