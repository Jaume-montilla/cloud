const ws = require('ws')
const serv = new ws.Server({ port: 8080})
console.log("connected")
serv.on('connection', () => {console.log("connected")})
