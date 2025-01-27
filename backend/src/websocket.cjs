const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
    console.log('Nuevo cliente conectado');
    ws.on('message', message => {
        console.log(`Recibido: ${message}`);
    });
});

console.log('El servidor está ejecutándose en el puerto 8080');

const clients = new Set();

wss.on('connection', ws => {
    clients.add(ws);
    ws.on('message', message => {
        console.log(`Recibido: ${message}`);
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
    ws.on('close', () => {
        clients.delete(ws);
    });
});
