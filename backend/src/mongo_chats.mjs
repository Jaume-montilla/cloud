import mongoose from 'mongoose';
export async function connect(senderU, receiverU, messageU) {
    mongoose.connect("mongodb://localhost:27017", {
    }).then(() => {
        const Schema = mongoose.Schema;

        const messageSchema = new Schema({
            sender: String,
            receiver: String,
            message: String,
            timestamp: Date
        });

        const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
        var message = new Message({
            sender: senderU,
            receiver: receiverU,
            message: messageU,
            timestamp: Date.now()
        });
        async function saveMessage() {
            const newMessage = new Message({
                sender: senderU,
                receiver: receiverU,
                message: messageU,
                timestamp: Date.now()
            });
            console.log(newMessage);
            newMessage.save()
                .then(() => {
                    console.log(message);
                })
                .catch(err => {
                    console.error('Error al guardar los datos:', err);
                });
        }

        saveMessage();
    });
}

export async function getMessages(senderU, receiverU) {
    let messagesList = [];
    await mongoose.connect("mongodb://localhost:27017");

    const Schema = mongoose.Schema;

    const messageSchema = new Schema({
        sender: String,
        receiver: String,
        message: String,
        timestamp: Date
    });

    const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

    const sms = await Message.find({
        $or: [
            { sender: senderU, receiver: receiverU },
            { sender: receiverU, receiver: senderU }
        ]
    });

    messagesList = sms;
    return messagesList;
}