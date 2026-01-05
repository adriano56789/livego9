import express from 'express';
import cors from 'cors';
import http from 'http';
import https from 'https';
import fs from 'fs';
import { Server } from 'socket.io';
import { connectDB } from './database';
import apiRoutes from './routes/api';
import srsRoutes from './routes/srsRoutes'; // Import the new SRS routes
import { config } from './config/settings';
import { globalErrorHandler } from './middleware/errorHandler';
import { setupWebSocket } from './controllers/websocketController';

// Conectar ao DB primeiro é crucial antes de iniciar o servidor
connectDB().catch(err => {
    console.error("ERRO CRÍTICO NA CONEXÃO COM O BANCO:", err);
    // FIX: Cast process to any to avoid TypeScript error on exit.
    (process as any).exit(1);
});

const app = express();
const isProduction = config.node_env === 'production';

// 1. Middlewares
app.use(cors({
    origin: ["http://livego.store", "https://livego.store", "http://localhost:5173"],
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true
}) as any);
app.use(express.json({ limit: '10mb' }) as any);
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} (${duration}ms)`);
    });
    next();
});

// 2. Definir servidor e IO com base no ambiente
let server: http.Server | https.Server;
let io: Server;

if (isProduction) {
    console.log('🚀 MODO PRODUÇÃO ATIVADO. TENTANDO INICIAR SERVIDOR SEGURO...');
    try {
        const privateKey = fs.readFileSync('/etc/letsencrypt/live/livego.store/privkey.pem', 'utf8');
        const certificate = fs.readFileSync('/etc/letsencrypt/live/livego.store/fullchain.pem', 'utf8');
        const credentials = { key: privateKey, cert: certificate };
        
        server = https.createServer(credentials, app);
        io = new Server(server, { cors: { origin: "*" }, transports: ['websocket'] });

        // Servidor HTTP para redirecionamento para HTTPS
        http.createServer((req, res) => {
            res.writeHead(301, { "Location": `https://${req.headers['host']}${req.url}` });
            res.end();
        }).listen(config.port, '0.0.0.0', () => {
            console.log(`📡 Servidor HTTP rodando na porta ${config.port} para redirecionar para HTTPS.`);
        });

    } catch (err: any) {
        console.error('❌ ERRO CRÍTICO AO INICIAR SERVIDOR HTTPS ❌');
        console.error('Certificados SSL não encontrados ou inválidos. Verifique os caminhos em /etc/letsencrypt/live/livego.store/');
        console.error('DICA: Rode `sudo certbot certonly --standalone -d livego.store` na VPS para gerar os certificados.');
        console.error(err.message);
        // FIX: Cast process to any to avoid TypeScript error on exit.
        (process as any).exit(1); // Finaliza o processo se o SSL falhar em produção
    }
} else {
    // --- DEVELOPMENT (HTTP + WS) ---
    server = http.createServer(app);
    io = new Server(server, { cors: { origin: "*" }, transports: ['websocket'] });
}

// 3. Injetar IO e configurar WebSocket
setupWebSocket(io);
app.use((req, res, next) => {
    (req as any).io = io;
    next();
});

// 4. Rotas da API
app.use('/api', apiRoutes);
app.use('/api', srsRoutes); // Mount the new SRS API service on the /api path
app.get('/', (req, res) => {
    res.send(`<h1>Servidor LiveGo Online (${isProduction ? 'HTTPS' : 'HTTP'})</h1><p>API em: <a href="/api/status">/api/status</a></p>`);
});

// 5. Tratamento de Erros
app.use(globalErrorHandler as any);

// 6. Iniciar Servidor Principal
const listenPort = isProduction ? config.https_port : config.port;
server.listen(listenPort, '0.0.0.0', () => {
    if (isProduction) {
        console.log(`
        ################################################
        👑 API REST DEDICADA LIVEGO - ONLINE (HTTPS/WSS)
        🔒 PORTA SEGURA: ${listenPort}
        🌐 DOMÍNIO: https://livego.store
        🚀 TESTE: https://livego.store/api/status
        ################################################
        `);
    } else {
        console.log(`
        ################################################
        🔧 API REST DEDICADA LIVEGO - MODO DESENVOLVIMENTO
        ⚡️ PORTA: ${listenPort}
        🚀 TESTE: http://localhost:${listenPort}/api/status
        ################################################
        `);
    }
});