import { saveFileHash } from './mysql_hash.mjs';

saveFileHash('./ftp.mjs', 'jaume')
	.then(() => console.log('Hash saved successfully'))
	.catch(err => console.error('Error:', err));

