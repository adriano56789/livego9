import { Server, Socket } from 'socket.io';

// Minimal User interface for WebSocket logic
interface User {
  id: string;
  name: string;
  // Any other properties sent from the client on 'join:stream'
}

// In-memory store for rooms and participants. In a real app, use Redis or another store.
const rooms: Record<string, { participants: Map<string, User> }> = {};

export const setupWebSocket = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        const userId = socket.handshake.query.userId as string;
        console.log(`[WS] ✔️  Cliente conectado: ${userId} (Socket ID: ${socket.id})`);

        // Helper to find which room a socket is in
        const findUserRoom = (socketId: string): string | null => {
            for (const streamId in rooms) {
                if (rooms[streamId].participants.has(socketId)) {
                    return streamId;
                }
            }
            return null;
        };

        // 1️⃣ & 2️⃣: join:stream & user:status (on connect)
        socket.on('join:stream', ({ streamId, user }: { streamId: string, user: User }) => {
            if (!streamId || !user) return;
            
            socket.join(streamId);
            
            if (!rooms[streamId]) {
                rooms[streamId] = { participants: new Map() };
            }
            rooms[streamId].participants.set(socket.id, user);

            console.log(`[WS] 🚪 ${user.name} entrou na sala: ${streamId}`);

            // Notificar outros na sala que um novo usuário entrou
            socket.to(streamId).emit('user:joined', user);

            // Notificar sobre mudança de status
            io.to(streamId).emit('user:status', { userId: user.id, status: 'online' });
            
            // Forçar atualização da lista de usuários no frontend
            io.to(streamId).emit('onlineUsersUpdate', { roomId: streamId });
        });

        // 3️⃣: leave:stream
        socket.on('leave:stream', ({ streamId, userId }: { streamId: string, userId: string }) => {
            socket.leave(streamId);
            if (rooms[streamId]) {
                rooms[streamId].participants.delete(socket.id);
                console.log(`[WS] 🚪 Usuário ${userId} saiu da sala: ${streamId}`);

                // Notificar outros
                io.to(streamId).emit('user:left', { userId });
                io.to(streamId).emit('user:status', { userId, status: 'offline' });
                io.to(streamId).emit('onlineUsersUpdate', { roomId: streamId });
            }
        });

        // 4️⃣ & 5️⃣: stream:started & stream:ended (Server-side authoritative)
        socket.on('stream:started', (streamData) => {
            console.log(`[WS] 🔴 LIVE! Stream iniciada: ${streamData.id}`);
            io.emit('stream:started', streamData);
        });
        
        socket.on('stream:ended', ({ streamId }) => {
            console.log(`[WS] ⚫ FIM! Stream encerrada: ${streamId}`);
            io.emit('stream:ended', { streamId });
            if (rooms[streamId]) {
                delete rooms[streamId];
            }
        });

        // 8️⃣: disconnect
        socket.on('disconnect', () => {
            console.log(`[WS] ❌ Cliente desconectado: ${userId} (Socket ID: ${socket.id})`);
            const streamId = findUserRoom(socket.id);
            if (streamId && rooms[streamId]) {
                const user = rooms[streamId].participants.get(socket.id);
                rooms[streamId].participants.delete(socket.id);
                
                if (user) {
                    // Notificar outros na sala que o usuário saiu
                    io.to(streamId).emit('user:left', { userId: user.id });
                    io.to(streamId).emit('user:status', { userId: user.id, status: 'offline' });
                    io.to(streamId).emit('onlineUsersUpdate', { roomId: streamId });
                }
            }
        });
    });
};
