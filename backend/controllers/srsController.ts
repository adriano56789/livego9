
import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response';

// Mock data to simulate SRS responses
const mockSrsData = {
    versions: {
        major: 5,
        minor: 0,
        revision: 135,
        version: "5.0.135"
    },
    summaries: {
        ok: true,
        self: {
            version: "5.0.135",
            pid: 1234,
            ppid: 1,
            argv: "/usr/local/srs/objs/srs -c /usr/local/srs/conf/srs.conf",
            cwd: "/usr/local/srs/objs",
            mem_kbyte: 51200,
            mem_percent: 1.2,
            cpu_percent: 5.5,
        },
        system: {
            cpu_percent: 10.2,
            mem_kbyte_total: 8192000,
            mem_kbyte_free: 4096000,
        }
    },
    streams: [
        { id: 'str_abc123', name: 'livetest', vhost: '__defaultVhost__', app: 'live', tcUrl: 'rtmp://your-domain/live', clients: 5, frames: 30, send_bytes: 1234567, recv_bytes: 0 },
        { id: 'str_def456', name: 'cameratest', vhost: '__defaultVhost__', app: 'live', tcUrl: 'rtmp://your-domain/live', clients: 10, frames: 25, send_bytes: 8765432, recv_bytes: 0 }
    ],
    clients: [
        { id: 'cli_xyz789', vhost: '__defaultVhost__', stream: 'str_abc123', ip: '192.168.1.10', type: 'Play', alive: 120 },
        { id: 'cli_uvw456', vhost: '__defaultVhost__', stream: 'str_def456', ip: '10.0.0.5', type: 'Play', alive: 300 }
    ],
    metrics: {
        network: {
            send_bytes_second: 123456,
            recv_bytes_second: 7890,
        },
        disk: {
            read_bytes_second: 1024,
            write_bytes_second: 2048,
        },
        connections: {
            total: 15,
            rtmp: 5,
            http: 10,
        },
        n_clients: 15,
        n_streams: 2,
    }
};


export const srsController = {
    getVersions: (req: Request, res: Response) => {
        sendSuccess(res, mockSrsData.versions);
    },
    getSummaries: (req: Request, res: Response) => {
        sendSuccess(res, mockSrsData.summaries);
    },
    getFeatures: (req: Request, res: Response) => {
        sendSuccess(res, {
            srs_features: {
                rtmp: true, hls: true, dvr: true, http_api: true, http_server: true,
                webrtc: true, srt: true, gb28181: false
            }
        });
    },
    getClients: (req: Request, res: Response) => {
        sendSuccess(res, { clients: mockSrsData.clients });
    },
    // Fix: Changed req type to any to resolve property 'params' does not exist error on line 77
    getClientById: (req: any, res: Response) => {
        const client = mockSrsData.clients.find(c => c.id === req.params.id);
        if (client) {
            sendSuccess(res, { client });
        } else {
            sendError(res, 'Client not found', 404);
        }
    },
    getStreams: (req: Request, res: Response) => {
        sendSuccess(res, { streams: mockSrsData.streams });
    },
    // Fix: Changed req type to any to resolve property 'params' does not exist error on line 88
    getStreamById: (req: any, res: Response) => {
        const stream = mockSrsData.streams.find(s => s.id === req.params.id);
        if (stream) {
            sendSuccess(res, { stream });
        } else {
            sendError(res, 'Stream not found', 404);
        }
    },
    // Fix: Changed req type to any to resolve property 'params' does not exist error on line 96
    deleteStreamById: (req: any, res: Response) => {
        sendSuccess(res, { code: 0, message: `Stream ${req.params.id} kicked off.` });
    },
    getConnections: (req: Request, res: Response) => {
        // Similar to clients for this mock
        sendSuccess(res, { conns: mockSrsData.clients });
    },
    // Fix: Changed req type to any to resolve property 'params' does not exist error on line 104
    getConnectionById: (req: any, res: Response) => {
        // Similar to clients for this mock
        const conn = mockSrsData.clients.find(c => c.id === req.params.id);
        if (conn) {
            sendSuccess(res, { conn });
        } else {
            sendError(res, 'Connection not found', 404);
        }
    },
    // Fix: Changed req type to any to resolve property 'params' does not exist error on line 112
    deleteConnectionById: (req: any, res: Response) => {
        sendSuccess(res, { code: 0, message: `Connection ${req.params.id} kicked off.` });
    },
    getConfigs: (req: Request, res: Response) => {
        sendSuccess(res, { config: "Listen 1935;\nMax_connections 1000;\nVhost __defaultVhost__ {}" });
    },
    updateConfigs: (req: Request, res: Response) => {
        sendSuccess(res, { code: 0, message: "Config updated successfully." });
    },
    getVhosts: (req: Request, res: Response) => {
        sendSuccess(res, { vhosts: [{ name: '__defaultVhost__', enabled: true }] });
    },
    // Fix: Changed req type to any to resolve property 'params' does not exist error on line 124
    getVhostById: (req: any, res: Response) => {
        if (req.params.id === '__defaultVhost__') {
            sendSuccess(res, { vhost: { name: '__defaultVhost__', enabled: true } });
        } else {
            sendError(res, 'Vhost not found', 404);
        }
    },
    getRequests: (req: Request, res: Response) => {
        sendSuccess(res, { requests: [] });
    },
    getSessions: (req: Request, res: Response) => {
        sendSuccess(res, { sessions: [] });
    },
    getMetrics: (req: Request, res: Response) => {
        sendSuccess(res, mockSrsData.metrics);
    },
    rtcPublish: (req: any, res: Response) => {
        const { sdp, streamUrl } = req.body;
        if (!sdp || !streamUrl) {
            return sendError(res, 'SDP and streamUrl are required.', 400);
        }

        const sessionId = `rtc-session-${Date.now()}`;
        const mockSdpAnswer = `v=0\r\no=- 0 0 IN IP4 127.0.0.1\r\ns=LiveGo WebRTC\r\nc=IN IP4 127.0.0.1\r\nt=0 0\r\nm=audio 9000 RTP/AVP 111\r\na=rtpmap:111 opus/48000/2\r\nm=video 9002 RTP/AVP 96\r\na=rtpmap:96 H264/90000\r\n`;
        
        console.log(`[SRS MOCK] RTC Publish request for ${streamUrl}. Responding with session ID ${sessionId}`);

        sendSuccess(res, { code: 0, sdp: mockSdpAnswer, sessionid: sessionId });
    },
    trickleIce: (req: any, res: Response) => {
        const { sessionId } = req.params;
        const { candidate } = req.body;

        if (!candidate) {
            return sendError(res, 'O corpo da requisição do candidate é obrigatório.', 400);
        }
        
        // Log mais detalhado simulando o processamento do lado do servidor
        const { type, protocol, address, port, relatedAddress, relatedPort } = candidate;
        console.log(`[SRS MOCK][Sessão: ${sessionId}] Recebido ICE Candidate do cliente.`);
        console.log(`  - Tipo: ${type} (${type === 'host' ? 'Endereço Local' : type === 'srflx' ? 'Endereço Público (STUN)' : 'Servidor de Retransmissão (TURN)'})`);
        console.log(`  - Protocolo: ${protocol}`);
        console.log(`  - Endereço: ${address}:${port}`);
        if (relatedAddress) {
            console.log(`  - Endereço Relacionado: ${relatedAddress}:${relatedPort}`);
        }

        // Simulação de lógica de verificação e log de falha potencial
        if (type === 'relay') {
            console.log(`  - [INFO] Rota de Relay (TURN) detectada. O servidor irá retransmitir a mídia. Isso indica uma rede restritiva.`);
        } else if (type === 'srflx') {
            console.log(`  - [INFO] Rota Direta (STUN) detectada. Tentando conexão P2P...`);
        } else if (type === 'host' && (address.startsWith('192.168') || address.startsWith('10.'))) {
            console.warn(`  - [AVISO] O candidato do tipo 'host' com IP de rede local (${address}) pode não ser acessível externamente. O sucesso dependerá de outros candidatos (STUN/TURN).`);
        }

        // Simula uma falha para um tipo específico de candidato para fins de depuração
        if (protocol === 'tcp' && type === 'host') {
            console.error(`  - [LOG DE FALHA SIMULADO] A conexão direta via TCP no candidato local falhou. Registrando para análise. WebRTC irá tentar outras rotas.`);
        }

        return sendSuccess(res, { code: 0, message: `Candidate ${type} recebido e processado.` });
    }
};
