// connectar a mongo
const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017';

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		//crear un esquema 
		const Schema = mongoose.Schema;

		// cuando tengamos el ok crear estructura 
		const usrSchema = new Schema({
			name: String,
		});
		const User = mongoose.model('User', usrSchema);

		const nuevaPersona = new User({
			name: 'Juan',
		});
		nuevaPersona.save().then(console.log("Datos guardados"));
	})
	.catch((err) => {
		console.log('error', err);
	});


