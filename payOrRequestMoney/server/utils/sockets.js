let socket;
let defaultSocketChannelAtClient = 'pay_or_request';

/* Collect the socket instance save it so that it can used to update user*/
const init = (io) => {
  socket = io;
};

const emit = (data) => {
  socket.emit(defaultSocketChannelAtClient, data);
};

module.exports = {
  init,
  emit,
};