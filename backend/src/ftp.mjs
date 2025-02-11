import ftpd from 'ftpd'
import fs from 'fs'
import path from 'path'

const baseDir = path.join('./', '..', 'users');

function startFtpServer(username, port) {
	const options = {
		host: '127.0.0.1',
		port: port,
		tls: null,
	};

	let server = new ftpd.FtpServer(options.host, {
		getInitialCwd: function () {
			return './';
		},
		getRoot: function () {
			if (username == "admin") {
				return baseDir;
			}
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

		// Aquí manejamos el comando quit
		connection.on('command:quit', function () {
			console.log("Cliente ha cerrado la conexión. Cerrando servidor...");
			server.close();  // Detenemos el servidor FTP
		})
	})


	server.debugging = 4;
	server.listen(options.port);
	console.log('FTP Server listening on port ' + options.port);
	return server;  // Devolvemos el objeto server para poder cerrarlo desde otro lugar
}

export default startFtpServer;

