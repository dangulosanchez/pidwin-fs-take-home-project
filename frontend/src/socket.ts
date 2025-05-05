import { io, Socket } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3001/';
let socket : Socket | null = null;
let userEmail = "";

const initializeSocket = (email?: string) => {
    socket = io(URL, {
        withCredentials: false,
        auth: {
            email
        }
    });
};

const getSocket = (email?: string) => {
    if(!userEmail?.length && email){
        userEmail = email;
        initializeSocket(email);
    }
    if(!socket){
        initializeSocket(email);
    }
    return socket;
}

export {
    initializeSocket,
    getSocket
}