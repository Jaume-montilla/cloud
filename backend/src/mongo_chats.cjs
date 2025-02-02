const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017';

mongoose.connect(url, {
}).then(() => {
    const Schema = mongoose.Schema;

    const messageSchema = new Schema({
        sender: String,
        receiver: String,
        message: String,
        timestamp: { type: Date, default: Date.now }
    });

    const Message = mongoose.model('Message', messageSchema);

    async function saveMessage() {
        const newMessage = new Message({
            sender: "Ana",
            receiver: "Carlos",
            message: "Hola"
        });
        newMessage.save()
            .then(() => {
                console.log("Datos guardados");
            })
            .catch(err => {
                console.error('Error al guardar los datos:', err);
            });
    }

    saveMessage();
});