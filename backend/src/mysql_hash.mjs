import crypto from 'crypto';
import fs from 'fs';
import mysql from 'mysql2/promise';
import path from 'path';

const dbConfig = {
	host: 'localhost',
	user: 'ftp',
	password: 'ftp_hash_admin1',
	database: 'ftp_hash'
};

async function send_info(username) {
	const userDir = path.join('./', '..', 'users', username);
	const connection = await mysql.createConnection(dbConfig);

	try {
		await connection.execute(
			`DELETE FROM file_hashes WHERE username = ?`,
			[username]
		);
		const filePaths = await getFilesFromDirectory(userDir);
		for (let filePath of filePaths) {
			await saveFileHash(filePath, username);
		}
		console.log('Archivos procesados correctamente');
	} catch (error) {
		console.error('Error al procesar los archivos:', error);
	} finally {
		await connection.end();
	}
}

async function getFilesFromDirectory(dir) {
	let files = [];

	const items = fs.readdirSync(dir);
	for (let item of items) {
		const fullPath = path.join(dir, item);
		const stat = fs.statSync(fullPath);

		if (stat.isFile()) {
			files.push(fullPath);
		}
	}

	return files;
}

async function saveFileHash(filePath, username) {
	try {
		const hash = await calculateFileHash(filePath);
		const connection = await mysql.createConnection(dbConfig);

		await connection.execute(
			`INSERT INTO file_hashes (username, file_path, file_hash) VALUES (?, ?, ?) 
            ON DUPLICATE KEY UPDATE file_hash = VALUES(file_hash)`,
			[username, filePath, hash]
		);

		await connection.end();
		console.log(`Hash guardado para el archivo: ${filePath}`);
	} catch (error) {
		console.error('Error saving file hash:', error);
	}
}

function calculateFileHash(filePath) {
	return new Promise((resolve, reject) => {
		const hash = crypto.createHash('sha256');
		const stream = fs.createReadStream(filePath);

		stream.on('data', (data) => hash.update(data));
		stream.on('end', () => resolve(hash.digest('hex')));
		stream.on('error', (error) => reject(error));
	});
}

export { send_info };
