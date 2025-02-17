import ftpd from 'ftpd';
import fs from 'fs';
import path from 'path';
import { send_info } from './mysql_hash.mjs';  // Asegúrate de que la ruta esté correcta
const baseDir = path.join('./', '..', 'users');

function startFtpServer(username, port) {
	const options = {
		host: '127.0.0.1',
		port: port,
		tls: null,
	};

	let server = new ftpd.FtpServer(options.host, {
		getInitialCwd: () => './',
		getRoot: () => username === "admin" ? baseDir : path.join(baseDir, username),
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

	server.on('error', (error) => console.log('FTP Server error:', error));

	server.on('client:connected', (connection) => {
		console.log('Client connected:', connection.remoteAddress);


		send_info(username)
			.then(() => console.log('Información de archivos actualizada'))
			.catch(error => console.error('Error al actualizar la información de archivos:', error));

		connection.on('command:user', (user, success, failure) => user === username ? success() : failure());
		connection.on('command:pass', (pass, success) => success(username));

		connection.on('command:quit', () => {
			console.log("Client disconnected. Closing server...");
			server.close();
		});
	});

	server.debugging = 4;
	server.listen(options.port);
	console.log('FTP Server listening on port ' + options.port);
	return server;
}

export default startFtpServer;

