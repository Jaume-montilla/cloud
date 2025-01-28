const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017';

mongoose.connect(url, {
})
	.then(() => {
		const Schema = mongoose.Schema;

		const usrSchema = new Schema({
			name: String,
			mail: String,
			pwd: String,
			uuid: String,
			connections: [String],
			public_id: String,
			cookie: String
		});

		const User = mongoose.model('User', usrSchema);

		const nuevaPersona = new User({
			name: 'Juan',
			mail: "test@test.test",
			pwd: "encryptedPwd",
			uuid: "super duper private uuid",
			connections: ["uuid1", "uuid2", "uuid3"],
			public_id: "lets stay connected",
			cookie: "current valid cookie"
		});

		nuevaPersona.save()
			.then(() => {
				console.log("Datos guardados");
			})
			.catch(err => {
				console.error('Error al guardar los datos:', err);
			});
	})
	.catch(err => {
		console.log('Error de conexión a MongoDB:', err);
	});