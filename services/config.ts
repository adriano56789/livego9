/**
 * CONFIGURAÇÃO DE CONEXÃO DA API
 * Permite alternar facilmente entre o ambiente de desenvolvimento local e o servidor de produção (VPS).
 */

// Mude para 'local' para usar o backend rodando na sua máquina (via proxy do Vite).
// Mude para 'vps' para conectar diretamente ao servidor de produção.
// FIX: Changed const to let to prevent type narrowing that caused a comparison error.
let CONNECTION_MODE: 'local' | 'vps' = 'vps'; 

const VPS_DOMAIN = 'livego.store';

let backendHost: string;

if (CONNECTION_MODE === 'local') {
    // Em modo local, usamos uma string vazia. As chamadas de API (ex: /api/status)
    // serão relativas ao host do frontend (localhost:5173) e interceptadas
    // pelo proxy do Vite, que as redireciona para o backend local (localhost:3000).
    backendHost = ''; 
} else {
    // Em modo VPS, usamos la URL completa do servidor de produção.
    // O frontend fará chamadas diretas para https://livego.store.
    backendHost = `https://${VPS_DOMAIN}`;
}

export const API_CONFIG = {
    // Para chamadas HTTP (fetch), o endpoint da API é sempre prefixado com /api.
    // Local: /api/...
    // VPS: https://livego.store/api/...
    BASE_URL: `${backendHost}/api`,
    
    // Para WebSockets, a URL é a raiz do domínio.
    // O cliente Socket.IO lida com a URL vazia (local) ou completa (vps) corretamente.
    WS_URL: backendHost,
    
    // Para arquivos estáticos, se houver.
    STATIC_URL: `${backendHost}/uploads`
};