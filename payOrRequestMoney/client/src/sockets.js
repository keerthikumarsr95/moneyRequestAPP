import io from 'socket.io-client';
const socket = io('http://localhost:6001');

export const checkIfThisNewEventIsForThisComponent = (newUpdateFromSocket, componentSocketCode) => {
  if (newUpdateFromSocket.code === componentSocketCode) {
    return true;
  }
  return false;
};

export const listenToSocket = (cb) => {
  socket.on('pay_or_request', cb);
};

console.log(socket)