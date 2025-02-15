import crypto from 'crypto';
import fs from 'fs';
import mysql from 'mysql2/promise';

const dbConfig = {
	host: 'localhost',
	user: 'ftp',
	password: 'ftp_hash_admin1',
	database: 'ftp_hash'
};

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

export { saveFileHash };
