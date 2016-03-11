A socket.io application powered by socketbeams.

## Integrating Socket.IO
Socket.IO is composed of two parts:

1) A server that integrates with (or mounts on)
     the Node.JS HTTP Server: socket.io.
2) A client library that loads on the browser side: socket.io-client.

During development, socket.io serves the client automatically for us.

## Emitting events
The main idea behind Socket.IO is that you can send and receive any
  events you want, with any data you want. Any objects that can be encoded
  as JSON will do, and binary data is supported too.

