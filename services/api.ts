import { API_CONFIG } from './config';
import { mockData } from './mockData';
import { User, Streamer, Gift, Conversation, RankedUser, MusicTrack, PurchaseRecord, Obra, ConnectedAccount, FeedPhoto } from '../types';
import { webSocketManager } from './websocket';
import { GIFTS } from '../constants';
import { GiftPayload } from '../components/live/GiftAnimationOverlay';
import { apiTrackerService } from './apiTrackerService';

// MOTOR MOCHA DESATIVADO -> CONEXÃO REAL COM VPS
const USE_MOCK = false;
const TOKEN_KEY = '@LiveGo:token';
const USER_KEY = '@LiveGo:user';
const REQUEST_TIMEOUT = 10000; // 10 seconds

/**
 * BANCO DE DADOS MOCHA PERSISTENTE (INATIVO QUANDO USE_MOCK = FALSE)
 */
let db_currentUser: User = { 
    ...mockData.currentUser, 
    email: 'adrianomdk5@gmail.com', 
    diamonds: 50000, 
    blockedIds: ['1122334'], 
    createdAt: '2023-10-20T10:00:00Z',
    obras: [
        { id: 'obra-avatar-1', url: mockData.currentUser.avatarUrl, type: 'image', createdAt: '2023-11-01T10:00:00Z' },
        { id: 'obra-2', url: 'https://picsum.photos/seed/obra2/500', type: 'image', createdAt: '2023-12-15T10:00:00Z' }
    ],
    curtidas: [
        { id: 'curtida-1', url: 'https://picsum.photos/seed/liked1/500', type: 'image' },
    ],
    platformEarnings: 1250.75,
    withdrawal_method: { method: 'email', details: { email: 'adrianomdk5@gmail.com' } },
    connectedAccounts: [
        { id: 'g-12345', provider: 'google', name: 'Adriano MDK', email: 'adrianomdk5@gmail.com' }
    ],
    notificationSettings: {
        newMessages: true,
        streamerLive: true,
        newFollower: false,
        followedPosts: true,
        pedido: true,
        interactive: false,
        push: true,
        followerPost: true,
        order: false,
        giftAlertsOnScreen: true,
        giftSoundEffects: true,
        giftLuxuryBanners: false,
    },
    uiSettings: {
        zoomLevel: 100,
    }
};
let db_onlineUsers = [...mockData.onlineUsers];
let db_streams = [...mockData.streams];
let db_reminders = [
    { id: 'rem-1', name: 'Mirella Oficial', avatar: 'https://picsum.photos/seed/rem1/200', isLive: true },
    { id: 'rem-2', name: 'DJ Arromba', avatar: 'https://picsum.photos/seed/rem2/200', isLive: false },
    { id: 'rem-3', name: 'Gamer Master', avatar: 'https://picsum.photos/seed/rem3/200', isLive: true }
];

const db_streamer_users: User[] = [
    { ...mockData.currentUser, id: '9928374', identification: '9928374', name: 'Mirella Oficial', avatarUrl: 'https://picsum.photos/seed/9928374/200', coverUrl: 'https://picsum.photos/seed/9928374-c/800/1200', fans: 1250, location: 'São Paulo', isLive: true, bio: 'Bem-vindo à minha live oficial! Curta e siga para não perder nada.' },
    { ...mockData.currentUser, id: '2239485', identification: '2239485', name: 'DJ Arromba', avatarUrl: 'https://picsum.photos/seed/2239485/200', coverUrl: 'https://picsum.photos/seed/2239485-c/800/1200', fans: 800, location: 'Rio de Janeiro', isLive: true, bio: 'As melhores batidas que você vai ouvir hoje. Solta o som!' },
    { ...mockData.currentUser, id: '1122334', identification: '1122334', name: 'Gamer Master', avatarUrl: 'https://picsum.photos/seed/1122334/200', coverUrl: 'https://picsum.photos/seed/1122334-c/800/1200', fans: 2100, location: 'Curitiba', isLive: true, bio: 'Gameplay de alto nível e muita resenha. Chega mais!' },
    { ...mockData.currentUser, id: '3344556', identification: '3344556', name: 'Alice Star', avatarUrl: 'https://picsum.photos/seed/3344556/200', coverUrl: 'https://picsum.photos/seed/3344556-c/800/1200', fans: 3500, location: 'Miami', isLive: true, bio: 'Conversando sobre a vida e espalhando boas energias.' },
];

const db_all_users = [db_currentUser, ...db_onlineUsers, ...db_streamer_users];

let db_livekit_rooms: any[] = [
    {
        sid: 'RM_abc123',
        name: 'minha-sala-teste',
        empty_timeout: 300,
        max_participants: 20,
        creation_time: Date.now() / 1000,
        turn_password: 'turn-password-xyz',
        num_participants: 2,
        participants: [
            { sid: 'PA_user1', identity: 'participante-exemplo', name: 'Adriano', state: 'ACTIVE', joined_at: Date.now() / 1000, is_muted: false },
            { sid: 'PA_user2', identity: 'user-id-2', name: 'Mirella', state: 'ACTIVE', joined_at: Date.now() / 1000, is_muted: false }
        ]
    }
];

let db_livekit_tracks: any[] = [
    { sid: 'TR_audio123', kind: 'audio', name: 'microphone', muted: false, room: 'minha-sala-teste' },
    { sid: 'TR_video456', kind: 'video', name: 'webcam', muted: false, room: 'minha-sala-teste' }
];

let db_livekit_webhooks: any[] = [
    { id: 'wh_abc', url: 'https://meuservidor.com/webhook', events: ['room_started', 'room_finished'] }
];

const db_feed_videos: FeedPhoto[] = [
    {
        id: 'vid1',
        mediaUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg',
        type: 'video',
        user: db_streamer_users[0],
        description: 'Dia incrível na praia! 🌊☀️ #natureza #viral',
        likes: 1234,
        commentCount: 56,
        musicTitle: 'Som Original - Mirella Oficial',
        isLiked: false,
    } as FeedPhoto,
    {
        id: 'vid2',
        mediaUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
        type: 'video',
        user: db_streamer_users[1],
        description: 'Curtindo o som! 🎧 #dj #music',
        likes: 5678,
        commentCount: 123,
        musicTitle: 'Electronic Mix 2024',
        isLiked: true,
    } as FeedPhoto,
    {
        id: 'vid3',
        mediaUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
        type: 'video',
        user: db_streamer_users[2],
        description: 'Jogando um pouco pra relaxar. #gamer #pro',
        likes: 9101,
        commentCount: 245,
        musicTitle: 'Game Lofi',
        isLiked: false,
    } as FeedPhoto
];

const generateInitialAdminWithdrawals = (): PurchaseRecord[] => {
    const records: PurchaseRecord[] = [];
    const recordCount = Math.floor(Math.random() * 10) + 8;
    const statuses: PurchaseRecord['status'][] = ['Concluído', 'Pendente', 'Cancelado', 'Processando', 'Falhou'];
    const names = ['Mirella', 'DJ Arromba', 'Gamer Master', 'Alice Star', 'Usuário VIP'];

    for (let i = 0; i < recordCount; i++) {
        const type = Math.random() > 0.2 ? 'fee' : 'withdrawal';
        let status = statuses[Math.floor(Math.random() * statuses.length)];
        const amount = type === 'fee' ? Math.random() * 200 + 10 : Math.random() * 1000 + 500;
        const name = names[Math.floor(Math.random() * names.length)];
        
        records.push({
            id: `adm-wd-${Date.now()}-${i}`,
            userId: type === 'fee' ? `streamer-${i}` : 'admin-id',
            amountBRL: parseFloat(amount.toFixed(2)),
            status: status,
            type: type,
            timestamp: new Date(Date.now() - i * 1000 * 60 * 60 * (Math.random() * 12 + 4)).toISOString(),
            description: type === 'fee' ? `Taxa de Saque - ${name}` : `Saque para ${db_currentUser.withdrawal_method?.details.email || 'adrianomdk5@gmail.com'}`,
            relatedUserName: type === 'fee' ? name : undefined,
        });
    }
    return records;
};

let db_admin_withdrawals: PurchaseRecord[] = generateInitialAdminWithdrawals();
let db_lastLoginEmail: string | null = 'adrianomdk5@gmail.com';

export const storage = {
    setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
    getToken: () => localStorage.getItem(TOKEN_KEY),
    setUser: (user: any) => {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        db_currentUser = { ...db_currentUser, ...user };
    },
    getUser: () => {
        const stored = localStorage.getItem(USER_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            db_currentUser = { ...db_currentUser, ...parsed };
            return db_currentUser;
        }
        return db_currentUser;
    },
    clear: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }
};

const request = async (method: string, endpoint: string, body?: any): Promise<any> => {
    const logId = apiTrackerService.addLog(method, endpoint);
    
    let loggableBody: any = "";
    if (body) {
        loggableBody = { ...body }; 
        if (loggableBody.password) loggableBody.password = '********';
        if (loggableBody.email && typeof loggableBody.email === 'string') {
            const parts = loggableBody.email.split('@');
            loggableBody.email = parts.length > 1 ? `${parts[0][0]}***@***${parts[1].slice(-1)}` : '********';
        }
    }
    
    const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), REQUEST_TIMEOUT)
    );

    try {
        let executionPromise;

        if (USE_MOCK) {
            executionPromise = (async () => {
                await new Promise(resolve => setTimeout(resolve, 150));
                console.log(`%c[MOCHA-API REQUEST] ${method} ${endpoint}`, "color: #A855F7; font-weight: bold;", loggableBody || "");
                const cleanEndpoint = endpoint.replace('/undefined', '/me');

                 if (cleanEndpoint.startsWith('/livekit')) {
                    return Promise.reject({ message: `Endpoint LiveKit não implementado no modo MOCK: ${cleanEndpoint}` });
                }

                if (cleanEndpoint.startsWith('/live/')) {
                    const parts = cleanEndpoint.split('/');
                    const cat = parts.length > 2 ? parts[2].split('?')[0] : '';
                    const urlParams = new URLSearchParams(cleanEndpoint.split('?')[1] || '');
                    const region = urlParams.get('region');
        
                    if (cat === 'followed') return [];
                    if (region && region !== 'global') return db_streams.filter(s => s.country === region);
                    return db_streams;
                }

                if (cleanEndpoint === '/auth/login' && method === 'POST') {
                    const userWithAdminEmail = { ...db_currentUser, email: 'adrianomdk5@gmail.com' };
                    storage.setUser(userWithAdminEmail);
                    storage.setToken('mocha-token-123');
                    return { success: true, user: userWithAdminEmail, token: 'mocha-token-123' };
                }

                if (cleanEndpoint === '/auth/register' && method === 'POST') return { success: true };
                if (cleanEndpoint === '/auth/last-email') return { email: db_lastLoginEmail };
                
                if (cleanEndpoint.startsWith('/users/search') && method === 'GET') {
                    const q = new URLSearchParams(cleanEndpoint.split('?')[1] || '').get('q')?.toLowerCase() || '';
                    if (q) return db_all_users.filter(u => u.name.toLowerCase().includes(q));
                    return [];
                }

                if (cleanEndpoint.startsWith('/users/online') && method === 'GET') {
                    return [...db_onlineUsers].sort((a, b) => (b.value || 0) - (a.value || 0));
                }

                if (cleanEndpoint.endsWith('/friends') && !cleanEndpoint.includes('quick-friends') && method === 'GET') {
                    return db_streamer_users.filter(u => u.id !== db_currentUser.id);
                }
                 if (cleanEndpoint === '/users/me/ui-settings' && method === 'POST') {
                    if (!db_currentUser.uiSettings) db_currentUser.uiSettings = { zoomLevel: 100 };
                    db_currentUser.uiSettings.zoomLevel = body.zoomLevel;
                    storage.setUser(db_currentUser);
                    return { success: true, user: db_currentUser };
                }

                if (cleanEndpoint.startsWith('/users/me/blocklist/')) {
                    const userIdToBlock = cleanEndpoint.split('/').pop();
                    if (method === 'POST') {
                        if (userIdToBlock && db_currentUser) {
                            if (!db_currentUser.blockedIds) db_currentUser.blockedIds = [];
                            if (!db_currentUser.blockedIds.includes(userIdToBlock)) db_currentUser.blockedIds.push(userIdToBlock);
                            storage.setUser(db_currentUser);
                        }
                        return { success: true };
                    }
                }

                 if (cleanEndpoint.startsWith('/users/') && !cleanEndpoint.includes('blocklist') && !cleanEndpoint.includes('purchase') && !cleanEndpoint.includes('active-frame') && method === 'GET') {
                    const id = cleanEndpoint.split('/')[2];
                    if (id === 'me' || id === db_currentUser.id) return { ...db_currentUser };
                    const foundUser = db_all_users.find(u => u.id === id);
                    if (foundUser) return foundUser;
                    return Promise.reject({ message: `User with ID ${id} not found in mock DB.` });
                }
                
                if ((cleanEndpoint === '/users/me' || cleanEndpoint === `/users/${db_currentUser.id}`) && method === 'POST') {
                    db_currentUser = { ...db_currentUser, ...(body || {}) };
                    storage.setUser(db_currentUser);
                    return { success: true, user: db_currentUser };
                }

                if (cleanEndpoint.includes('/active-frame') && method === 'POST') {
                    const { frameId } = body || {};
                    if (db_currentUser) {
                        db_currentUser.activeFrameId = frameId;
                        if (!db_currentUser.ownedFrames) db_currentUser.ownedFrames = [];
                        if (!db_currentUser.ownedFrames.some(f => f.frameId === frameId)) {
                            db_currentUser.ownedFrames.push({ frameId: frameId, expirationDate: '2025-12-31' });
                        }
                        storage.setUser(db_currentUser);
                        return db_currentUser;
                    }
                    return Promise.reject({ message: "Usuário não encontrado" });
                }

                if (cleanEndpoint === '/earnings/withdraw/methods' && method === 'POST') {
                    const data = body || {};
                    const details = data.details || { key: 'adrianomdk5@gmail.com' };
                    if (db_currentUser) {
                        db_currentUser.withdrawal_method = { method: data.method || 'pix', details: { email: details.key || details.email || 'adrianomdk5@gmail.com' } };
                        storage.setUser(db_currentUser);
                        return { success: true, user: db_currentUser };
                    }
                    return Promise.reject({ message: "Usuário não encontrado" });
                }

                if (cleanEndpoint === '/admin/withdrawals/method' && method === 'POST') {
                    const { email } = body || { email: 'adrianomdk5@gmail.com' };
                    if (!db_currentUser.withdrawal_method) db_currentUser.withdrawal_method = { method: 'email', details: {} };
                    db_currentUser.withdrawal_method.details.email = email;
                    return { success: true };
                }
                
                if (cleanEndpoint === '/gift' && method === 'POST') {
                    const data = body || {};
                    const giftName = data.giftName || 'Rosa';
                    const count = data.count || 1;
                    const gift = GIFTS.find(g => g.name === giftName) || GIFTS[0];
                    const totalCost = gift.price * count;
                    if (db_currentUser.diamonds < totalCost) return Promise.reject({ message: "Diamantes insuficientes." });
                    db_currentUser.diamonds -= totalCost;
                    storage.setUser(db_currentUser);
                    let senderInOnline = db_onlineUsers.find(u => u.id === db_currentUser.id);
                    if (!senderInOnline) {
                        senderInOnline = { ...db_currentUser, value: 0 } as any;
                        db_onlineUsers.push(senderInOnline!);
                    }
                    senderInOnline!.value = (senderInOnline!.value || 0) + totalCost;
                    const stream = db_streams.find(s => s.id === data.streamId);
                    const receiverId = data.targetId || stream?.hostId;
                    if (receiverId) {
                        const receiver = db_all_users.find(u => u.id === receiverId);
                        if (receiver) {
                            receiver.receptores = (receiver.receptores || 0) + totalCost;
                        }
                    }
                    return { success: true, updatedSender: { ...db_currentUser }, leveledUp: false };
                }

                 if (cleanEndpoint === '/posts' && method === 'POST') {
                    const { mediaData, type, caption } = body || { mediaData: 'https://picsum.photos/seed/post/500', type: 'image', caption: 'Post' };
                    const { obras, ...userForPost } = db_currentUser;
                    const newPost: Obra & FeedPhoto = { 
                        id: `post-${Date.now()}`,
                        url: mediaData ? `${mediaData}` : 'https://picsum.photos/seed/post/500', 
                        mediaUrl: mediaData ? `${mediaData}` : 'https://picsum.photos/seed/post/500',
                        type: type as any || 'image',
                        caption: caption, 
                        description: caption,
                        createdAt: new Date().toISOString(),
                        user: userForPost as User,
                        likes: 0,
                        commentCount: 0,
                    } as any;
                    if (!db_currentUser.obras) db_currentUser.obras = [];
                    db_currentUser.obras.unshift(newPost);
                    db_feed_videos.unshift(newPost);
                    storage.setUser(db_currentUser);
                    webSocketManager.emit('feed:newPost', newPost);
                    return { success: true, user: db_currentUser };
                }
                
                 if (cleanEndpoint === '/feed/videos' && method === 'GET') return [...db_feed_videos];
                if (cleanEndpoint.includes('/posts/') && cleanEndpoint.endsWith('/like') && method === 'POST') {
                    const postId = cleanEndpoint.split('/')[2];
                    const post = db_feed_videos.find(p => p.id === postId);
                    if (post) {
                        post.isLiked = !post.isLiked;
                        post.likes += post.isLiked ? 1 : -1;
                    }
                    return { success: true };
                }
                if (cleanEndpoint.includes('/posts/') && cleanEndpoint.endsWith('/comment') && method === 'POST') {
                    const postId = cleanEndpoint.split('/')[2];
                    const post = db_feed_videos.find(p => p.id === postId);
                    if (post) post.commentCount += 1;
                    return { success: true, comment: { id: Date.now(), text: body.text, user: db_currentUser } };
                }

                if (cleanEndpoint === '/translate' && method === 'POST') {
                    return { success: true, translatedText: `[PT] ${body?.text || ''}` };
                }

                if (method === 'GET') {
                    if (cleanEndpoint.includes('/gifts/gallery')) {
                        const gallery = [];
                        const foguete = GIFTS.find(g => g.name === 'Foguete'); if (foguete) gallery.push({ ...foguete, count: 2 });
                        const coracao = GIFTS.find(g => g.name === 'Coração'); if (coracao) gallery.push({ ...coracao, count: 152 });
                        const carro = GIFTS.find(g => g.name === 'Carro Esportivo'); if (carro) gallery.push({ ...carro, count: 1 });
                        return gallery;
                    }
                    if (cleanEndpoint.includes('/gifts')) return GIFTS;
                    if (cleanEndpoint.includes('/conversations')) return mockData.conversations;
                    if (cleanEndpoint.includes('/tasks/quick-friends')) return [{ id: 'qf1', name: 'Mirella Oficial', status: 'pendente' }, { id: 'qf2', name: 'DJ Arromba', status: 'concluido' }];
                    if (cleanEndpoint.includes('/ranking')) return mockData.ranking;
                    if (cleanEndpoint.includes('/history')) return [];
                    if (cleanEndpoint.includes('/reminders')) return db_reminders;
                    if (cleanEndpoint.includes('/blocklist')) return db_currentUser.blockedIds || [];
                    if (cleanEndpoint.includes('/visitors')) return [];
                    if (cleanEndpoint.includes('/following')) return [];
                    if (cleanEndpoint.includes('/assets/frames')) return [{ id: 'FrameBlazingSun', name: 'Sol Escaldante', price: 500 }, { id: 'FrameBlueCrystal', name: 'Cristal Azul', price: 300 }, { id: 'FrameBlueFire', name: 'Fogo Azul', price: 600 }];
                    return [];
                }

                return { success: true };
            })();
        } else {
            // Chamada Real Fetch para VPS
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
            const url = `${API_CONFIG.BASE_URL}${endpoint}`;
            const token = storage.getToken();
            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;
            
            executionPromise = fetch(url, { 
                method, 
                headers, 
                body: body ? JSON.stringify(body) : undefined, 
                signal: controller.signal 
            }).then(async response => {
                clearTimeout(timeoutId);
                const json = await response.json();
                if (!response.ok) {
                    throw new Error(json.error || json.message || 'Erro de comunicação com o servidor.');
                }
                return json;
            });
        }

        const result = await Promise.race([executionPromise, timeoutPromise]);
        apiTrackerService.updateLog(logId, { status: 'Success', statusCode: 200 });
        return result.data !== undefined ? result.data : result;

    } catch (error: any) {
        apiTrackerService.updateLog(logId, { status: 'Error', error: error.message });
        console.error(`%c[API ERROR] ${method} ${endpoint}`, "color: #FF4444; font-weight: bold;", error.message);
        throw error;
    }
};

export const api = {
    auth: {
        login: (creds: any) => request('POST', '/auth/login', creds),
        register: (data: any) => request('POST', '/auth/register', data),
        logout: () => { storage.clear(); return Promise.resolve(); },
        getLastEmail: (): Promise<{ email: string | null }> => request('GET', '/auth/last-email'),
        saveLastEmail: (email: string): Promise<{ success: boolean }> => request('POST', '/auth/save-email', { email }),
    },
    livekit: {
        token: {
            generate: (userId: string, userName: string) => request('POST', '/livekit/token/generate', { userId, userName }),
        },
        room: {
            create: (roomId: string) => request('POST', '/livekit/room/create', { roomId }),
            get: (roomId: string) => request('GET', `/livekit/room/${roomId}`),
            list: () => request('GET', '/livekit/rooms'),
            delete: (roomId: string) => request('DELETE', `/livekit/room/${roomId}`),
            join: (roomId: string) => request('POST', `/livekit/room/${roomId}/join`, { action: 'join' }),
            leave: (roomId: string) => request('POST', `/livekit/room/${roomId}/leave`, { action: 'leave' }),
        },
        participants: {
            list: (roomId: string) => request('GET', `/livekit/room/${roomId}/participants`),
            get: (roomId: string, participantId: string) => request('GET', `/livekit/room/${roomId}/participants/${participantId}`),
            remove: (roomId: string, participantId: string) => request('POST', `/livekit/room/${roomId}/participants/${participantId}/remove`),
            mute: (roomId: string, participantId: string) => request('POST', `/livekit/room/${roomId}/participants/${participantId}/mute`),
            unmute: (roomId: string, participantId: string) => request('POST', `/livekit/room/${roomId}/participants/${participantId}/unmute`),
        },
        tracks: {
            list: (roomId: string) => request('GET', `/livekit/tracks/${roomId}`),
            mute: (roomId: string, trackId: string) => request('POST', `/livekit/tracks/${roomId}/${trackId}/mute`),
            unmute: (roomId: string, trackId: string) => request('POST', `/livekit/tracks/${roomId}/${trackId}/unmute`),
            remove: (roomId: string, trackId: string) => request('DELETE', `/livekit/tracks/${roomId}/${trackId}`),
        },
        record: {
            start: (roomId: string) => request('POST', `/livekit/record/${roomId}/start`),
            stop: (roomId: string) => request('POST', `/livekit/record/${roomId}/stop`),
        },
        ingest: (roomId: string) => request('POST', `/livekit/ingest/${roomId}`),
        monitoring: {
            stats: (roomId: string) => request('GET', `/livekit/monitoring/stats/${roomId}`),
            health: () => request('GET', '/livekit/system/health'),
            metrics: () => request('GET', '/livekit/system/metrics'),
            info: () => request('GET', '/livekit/system/info'),
            getConfig: () => request('GET', '/livekit/system/config'),
            updateConfig: (config: any) => request('PUT', '/livekit/system/config', { config }),
            logs: () => request('GET', '/livekit/system/logs'),
        },
        webhook: {
            register: (url: string) => request('POST', '/livekit/webhook/register', { url }),
            delete: (id: string) => request('DELETE', `/livekit/webhook/${id}`),
        }
    },
    srs: {
        getVersions: () => request('GET', '/v1/versions'),
        getSummaries: () => request('GET', '/v1/summaries'),
        getFeatures: () => request('GET', '/v1/features'),
        getClients: () => request('GET', '/v1/clients'),
        getClientById: (id: string) => request('GET', `/v1/clients/${id}`),
        getStreams: () => request('GET', '/v1/streams'),
        getStreamById: (id: string) => request('GET', `/v1/streams/${id}`),
        deleteStreamById: (id: string) => request('DELETE', `/v1/streams/${id}`),
        getConnections: () => request('GET', '/v1/connections'),
        getConnectionById: (id: string) => request('GET', `/v1/connections/${id}`),
        deleteConnectionById: (id: string) => request('DELETE', `/v1/connections/${id}`),
        getConfigs: () => request('GET', '/v1/configs'),
        updateConfigs: (config: string) => request('PUT', '/v1/configs', { config }),
        getVhosts: () => request('GET', '/v1/vhosts'),
        getVhostById: (id: string) => request('GET', `/v1/vhosts/${id}`),
        getRequests: () => request('GET', '/v1/requests'),
        getSessions: () => request('GET', '/v1/sessions'),
        getMetrics: () => request('GET', '/v1/metrics'),
        rtcPublish: (sdp: string, streamUrl: string): Promise<{ code: number; sdp: string; sessionid: string }> => request('POST', '/v1/rtc/publish', { sdp, streamUrl }),
        trickleIce: (sessionId: string, candidate: any): Promise<{ code: number }> => request('POST', `/v1/rtc/trickle/${sessionId}`, { candidate }),
    },
    users: {
        me: (): Promise<User> => request('GET', '/users/me'),
        get: (id: string): Promise<User> => request('GET', `/users/${id}`),
        getOnlineUsers: (roomId: string): Promise<User[]> => request('GET', `/users/online?roomId=${roomId}`),
        getFansUsers: (id: string): Promise<User[]> => request('GET', `/users/${id}/fans`),
        getFriends: (id: string): Promise<User[]> => request('GET', `/users/${id}/friends`),
        search: (q: string): Promise<User[]> => request('GET', `/users/search?q=${q}`),
        setLanguage: (code: string) => request('POST', '/users/me/language', { code }),
        update: (id: string, data: any): Promise<{ success: boolean; user: User }> => request('POST', `/users/${id}`, data),
        toggleFollow: (id: string) => request('POST', `/users/${id}/follow`),
        getWithdrawalHistory: (status: string): Promise<PurchaseRecord[]> => request('GET', `/users/me/withdrawal-history?status=${status}`),
        blockUser: (userId: string): Promise<{ success: boolean }> => request('POST', `/users/me/blocklist/${userId}`),
        updateUiSettings: (settings: { zoomLevel: number }): Promise<{success: boolean, user: User}> => request('POST', '/users/me/ui-settings', settings),
    },
    chats: {
        listConversations: (): Promise<Conversation[]> => request('GET', '/chats/conversations'),
        start: (userId: string) => request('POST', '/chats/start', { userId }),
        sendMessage: (roomId: string, message: any) => request('POST', `/chats/stream/${roomId}/message`, message),
    },
    gifts: {
        list: (category?: string): Promise<Gift[]> => request('GET', `/gifts?category=${category || 'Popular'}`),
        getGallery: (): Promise<(Gift & { count: number })[]> => request('GET', '/gifts/gallery'),
        recharge: (): Promise<{ success: boolean; user: User }> => request('POST', '/presentes/recarregar'),
    },
    streams: {
        listByCategory: (cat: string, region?: string): Promise<Streamer[]> => request('GET', `/live/${cat}?region=${region || 'global'}`),
        getById: (id: string) => request('GET', `/v1/streams/${id}`),
        deleteById: (id: string) => request('DELETE', `/v1/streams/${id}`),
        create: (data: any): Promise<Streamer> => request('POST', '/streams', data),
        update: (id: string, data: any) => request('PATCH', `/streams/${id}`, data),
        updateVideoQuality: (id: string, quality: string) => request('PATCH', `/streams/${id}/quality`, { quality }),
        getGiftDonors: (streamId: string): Promise<User[]> => request('GET', `/streams/${streamId}/donors`),
        search: (q: string): Promise<Streamer[]> => request('GET', `/streams/search?q=${q}`),
        inviteToPrivateRoom: (streamId: string, userId: string): Promise<{ success: boolean }> => request('POST', `/streams/${streamId}/invite`, { userId }),
        getBeautySettings: (): Promise<any> => request('GET', '/streams/beauty-settings'),
        saveBeautySettings: (settings: any): Promise<{ success: boolean }> => request('POST', '/streams/beauty-settings', { settings }),
        resetBeautySettings: (): Promise<{ success: boolean }> => request('POST', '/streams/beauty-settings/reset'),
        applyBeautyEffect: (effect: any): Promise<{ success: boolean }> => request('POST', `/streams/beauty-settings/apply`, { effect }),
        logBeautyTabClick: (tab: any): Promise<{ success: boolean }> => request('POST', '/streams/beauty-settings/log-tab', { tab }),
    },
    diamonds: {
        getBalance: (userId: string) => request('GET', `/wallet/balance`),
        purchase: (userId: string, diamonds: number, price: number): Promise<{ success: boolean; user: User }> => request('POST', `/users/${userId}/purchase`, { diamonds, price }),
    },
    earnings: {
        withdraw: {
            calculate: (amount: number): Promise<{ gross_value: number; platform_fee: number; net_value: number }> => request('POST', '/earnings/withdraw/calculate', { amount }),
            request: (amount: number, method: any): Promise<{ success: boolean; message: string }> => request('POST', '/earnings/withdraw/request', { amount, method }),
            methods: {
                update: (method: string, details: any): Promise<{ success: boolean; user: User }> => request('POST', '/earnings/withdraw/methods', { method, details }),
            }
        }
    },
    admin: {
        getAdminWithdrawalHistory: (): Promise<PurchaseRecord[]> => request('GET', '/admin/withdrawals'),
        withdraw: {
            request: (amount: number): Promise<{ success: boolean }> => request('POST', '/admin/withdrawals/request', { amount }),
        },
        saveAdminWithdrawalMethod: (details: { type: string; email: string; }): Promise<{ success: boolean; }> => request('POST', '/admin/withdrawals/method', details),
    },
    db: {
        checkCollections: (): Promise<string[]> => request('GET', '/db/collections'),
        setupDatabase: (collections: string[]): Promise<{ createdCollections: string[], userCreated: boolean, message: string }> => request('POST', '/db/setup', { collections }),
    },
    getFeedVideos: (): Promise<FeedPhoto[]> => request('GET', '/feed/videos'),
    likePost: (postId: string): Promise<{ success: boolean }> => request('POST', `/posts/${postId}/like`),
    addComment: (postId: string, text: string): Promise<{ success: boolean; comment: any }> => request('POST', `/posts/${postId}/comment`, { text }),
    sendGift: (from: string, streamId: string, giftName: string, count: number, targetId?: string): Promise<{ success: boolean; updatedSender: User, leveledUp: boolean }> => {
        return request('POST', `/gift`, { from, streamId, giftName, count, targetId });
    },
    
    getQuickCompleteFriends: (): Promise<any[]> => request('GET', '/tasks/quick-friends'),
    inviteFriendForCoHost: (streamId: string, friendId: string): Promise<{ success: boolean }> => request('POST', `/streams/${streamId}/cohost/invite`, { friendId }),
    completeQuickFriendTask: (friendId: string): Promise<{ success: boolean }> => request('POST', `/tasks/quick-friends/${friendId}/complete`),
    getDailyRanking: (): Promise<RankedUser[]> => request('GET', '/ranking/daily'),
    getWeeklyRanking: (): Promise<RankedUser[]> => request('GET', '/ranking/weekly'),
    getMonthlyRanking: (): Promise<RankedUser[]> => request('GET', '/ranking/monthly'),
    getTopFans: (): Promise<any[]> => request('GET', '/ranking/top-fans'),
    getBlocklist: (): Promise<User[]> => request('GET', '/users/me/blocklist'),
    unblockUser: (userId: string) => request('POST', `/users/me/blocklist/${userId}/unblock`),
    getFollowingUsers: (userId: string): Promise<User[]> => request('GET', `/users/${userId}/following`),
    getVisitors: (userId: string): Promise<any[]> => request('GET', `/users/${userId}/visitors`),
    getStreamHistory: (): Promise<any[]> => request('GET', '/users/me/history'),
    getReminders: (): Promise<any[]> => request('GET', '/users/me/reminders'),
    removeReminder: (id: string) => request('DELETE', `/users/me/reminders/${id}`),
    getMusicLibrary: (): Promise<MusicTrack[]> => request('GET', '/assets/music'),
    getAvatarFrames: (): Promise<any[]> => request('GET', '/assets/frames'),
    setActiveFrame: (userId: string, frameId: string): Promise<User> => request('POST', `/users/${userId}/active-frame`, { frameId }),
    translate: (text: string): Promise<{ translatedText: string }> => request('POST', '/translate', { text }),
    kickUser: (r: string, u: string) => request('POST', `/streams/${r}/kick`, { userId: u }),
    makeModerator: (r: string, u: string) => request('POST', `/streams/${r}/moderator`, { userId: u }),
    toggleMicrophone: () => request('POST', '/live/toggle-mic'),
    toggleStreamSound: () => request('POST', '/live/toggle-sound'),
    toggleAutoFollow: () => request('POST', '/live/toggle-autofollow'),
    toggleAutoPrivateInvite: () => request('POST', '/live/toggle-autoinvite'),
    createFeedPost: (data: any): Promise<{ success: boolean; user: User }> => request('POST', '/posts', data),
    confirmPurchaseTransaction: (details: any, method: string): Promise<any> => request('POST', '/wallet/confirm-purchase', { details, method }),
    cancelPurchaseTransaction: () => request('POST', '/wallet/cancel-purchase'),
    updateBillingAddress: (address: any) => request('POST', '/users/me/billing-address', address),
    updateCreditCard: (card: any) => request('POST', '/users/me/credit-card', card),
};
