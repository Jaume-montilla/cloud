import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

let mongoConnected = false
export async function connectToMongo() {
	if (mongoConnected) {
		return;
	}

	try {
		console.log('Conectando a MongoDB...');

		/// cambiar de localhost a mongo si se usa en DOCKER!!! 

		await mongoose.connect('mongodb://localhost:27017/test', {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		mongoConnected = true;
		console.log('Conexión a MongoDB exitosa');
	} catch (err) {
		console.error('Error de conexión a MongoDB:', err);
		setTimeout(connectToMongo, 5000);
	}
}

// Función para obtener los contactos
export async function getContacts() {
	if (!mongoConnected) {
		console.log('Esperando conexión a MongoDB...');
		await connectToMongo();
	}

	try {
		const Schema = mongoose.Schema;
		const usrSchema = new Schema({
			name: String,
			psswd: String,
			email: String,
		});

		const User = mongoose.models.User || mongoose.model('User', usrSchema);

		const users = await User.find({});
		console.log('Usuarios recuperados:', users);
		return users;
	} catch (err) {
		console.error('Error al obtener los contactos:', err);
		return [];
	}
}

// Función para obtener los mensajes entre dos usuarios
export async function getMessages(senderU, receiverU) {
	if (!mongoConnected) {
		console.log('Esperando conexión a MongoDB...');
		await connectToMongo();
	}

	try {
		const Schema = mongoose.Schema;
		const messageSchema = new Schema({
			sender: String,
			receiver: String,
			message: String,
			timestamp: Date,
		});

		const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

		const messages = await Message.find({
			$or: [
				{ sender: senderU, receiver: receiverU },
				{ sender: receiverU, receiver: senderU }
			]
		});

		console.log('Mensajes recuperados:', messages);
		return messages;
	} catch (err) {
		console.error('Error al obtener los mensajes:', err);
		return [];
	}
}

// Función para guardar un mensaje
export async function saveMessage(senderU, receiverU, messageU) {
	if (!mongoConnected) {
		console.log('Esperando conexión a MongoDB...');
		await connectToMongo();
	}

	try {
		const Schema = mongoose.Schema;
		const messageSchema = new Schema({
			sender: String,
			receiver: String,
			message: String,
			timestamp: Date,
		});

		const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

		const newMessage = new Message({
			sender: senderU,
			receiver: receiverU,
			message: messageU,
			timestamp: Date.now(),
		});

		await newMessage.save();
		console.log('Mensaje guardado:', newMessage);
	} catch (err) {
		console.error('Error al guardar el mensaje:', err);
	}
}

// Función para guardar un usuario
export async function saveUser(user, passwd, email) {
	if (!mongoConnected) {
		console.log('Esperando conexión a MongoDB...');
		await connectToMongo();
	}

	try {
		const Schema = mongoose.Schema;
		const usrSchema = new Schema({
			name: String,
			psswd: String,
			email: String,
			uuid: String,
		});

		const User = mongoose.models.User || mongoose.model('User', usrSchema);

		const newUser = new User({
			name: user,
			psswd: passwd,
			email: email,
			uuid: nanoid(),
		});

		await newUser.save();
		console.log('Usuario guardado:', newUser);
	} catch (err) {
		console.error('Error al guardar el usuario:', err);
	}
}

// Función para verificar un usuario
export async function checkUser(user, passwd) {
	if (!mongoConnected) {
		console.log('Esperando conexión a MongoDB...');
		await connectToMongo();
	}

	try {
		const Schema = mongoose.Schema;
		const usrSchema = new Schema({
			name: String,
			psswd: String,
			email: String,
		});

		const User = mongoose.models.User || mongoose.model('User', usrSchema);

		const foundUser = await User.findOne({ name: user });
		if (!foundUser) {
			return 'Usuario no encontrado';
		}

		if (foundUser.psswd !== passwd) {
			return 'Contraseña incorrecta';
		}

		return 'Inicio de sesión exitoso; ' + foundUser._id;
	} catch (err) {
		console.error('Error al verificar el usuario:', err);
		return 'Error al verificar usuario';
	}
}
