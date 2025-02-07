// connectar a mongo
import mongoose from "mongoose";
export async function saveUser(user, passwd, email) {
	const url = "mongodb://localhost:27017";
	mongoose
		.connect(url)
		.then(() => {
			//crear un esquema
			const Schema = mongoose.Schema;

			// cuando tengamos el ok crear estructura
			const usrSchema = new Schema({
				name: String,
				psswd: String,
				email: String,
			});

			const User = mongoose.models.User || mongoose.model("User", usrSchema);

			const nuevaPersona = new User({
				name: user,
				psswd: passwd,
				email: email,
			});
			nuevaPersona.save();
		})
		.catch((err) => {
			return err;
		});
	return "Datos guardados";
}

export async function checkUser(user, passwd) {
	const url = "mongodb://localhost:27017";
	try {
		await mongoose.connect(url);

		const Schema = mongoose.Schema;
		const usrSchema = new Schema({
			name: String,
			psswd: String,
			email: String,
		});
		const User = mongoose.models.User || mongoose.model("User", usrSchema);

		const foundUser = await User.findOne({ name: user });
		if (!foundUser) {
			return "usr failed";
		}

		if (foundUser.psswd !== passwd) {
			return "Contraseña incorrecta";
		}
		return "Inicio de sesión exitoso";
	} catch (err) {
		console.error("Error en checkUser:", err);
		return err;
	} finally {
		await mongoose.connection.close();
	}
}
