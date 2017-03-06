'use strict'

const dgram = require('dgram')

const socket = dgram.createSocket('udp4')

socket.on('error', (error) => {
  console.log({error})
})
socket.on('message', (msg, rinfo) => {
  console.log('RCVD', msg.toString('hex'), rinfo.address + ':' + rinfo.port)
})
socket.on('listening', () => {
  const {address, port} = socket.address()
  console.log('Listening ' + address + ':' + port)
})

const data = Buffer.from([0x00])
const {argv} = process
let port = 7483
let addr
for (let i = 2; i < argv.length; i++) {
  if ((argv[i] === '--addr') && (argv[i + 1] !== undefined)) {
    addr = argv[i + 1]
  } else if ((argv[i] === '--port') && (argv[i + 1] !== undefined)) {
    port = argv[i + 1]
  } else if ((argv[i] === '--send') && (argv[i + 1] !== undefined)) {
    setInterval(() => {
      socket.send(data, 7483, argv[i + 1], () => {
        console.log('SENT', data.toString('hex'))
      })
    }, 1000)
  } else if ((argv[i] === '--send-port') && (argv[i + 1] !== undefined) && (argv[i + 2] !== undefined)) {
    setInterval(() => {
      socket.send(data, argv[i + 1], argv[i + 2], () => {
        console.log('SENT', data.toString('hex'))
      })
    }, 1000)
  }
}

socket.bind(port, addr)