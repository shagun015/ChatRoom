// frontend socketInit.js
import { io } from 'socket.io-client';

export const socketInit = () => {
  const options = {
    'force new connection': true,
    reconnectionAttempt: 'Infinity',
    timeOut: 10000,
    transports: ['websocket'], // 'webSocket' -> 'websocket'
  };

  return io('http://localhost:5500', options);
};
