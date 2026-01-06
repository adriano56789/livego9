import { API_CONFIG } from './config';
import { User, Streamer, Gift, Conversation, RankedUser, MusicTrack, PurchaseRecord, Obra, ConnectedAccount, FeedPhoto } from '../types';
import { webSocketManager } from './websocket';
import { GIFTS } from '../constants';
import { GiftPayload } from '../components/live/GiftAnimationOverlay';
import { apiTrackerService } from './apiTrackerService';

// API Settings
const TOKEN_KEY = '@LiveGo:token';
const USER_KEY = '@LiveGo:user';
const REQUEST_TIMEOUT = 10000; // 10 seconds

export const storage = {
    setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
    getToken: () => localStorage.getItem(TOKEN_KEY),
    setUser: (user: any) => {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    getUser: () => {
        const stored = localStorage.getItem(USER_KEY);
        return stored ? JSON.parse(stored) : null;
    },
    clear: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }
};

const request = async (method: string, endpoint: string, body?: any): Promise<any> => {
    const logId = apiTrackerService.addLog(method, endpoint);
    
    // Sanitize sensitive data for logging
    let loggableBody: any = "";
    if (body) {
        loggableBody = { ...body };
        if (loggableBody.password) loggableBody.password = '********';
        if (loggableBody.email && typeof loggableBody.email === 'string') {
            const parts = loggableBody.email.split('@');
            loggableBody.email = parts.length > 1 ? `${parts[0][0]}***@***${parts[1].slice(-1)}` : '********';
        }
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
        
        const url = `${API_CONFIG.BASE_URL}${endpoint}`;
        const token = storage.getToken();
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(url, { 
            method, 
            headers, 
            body: body ? JSON.stringify(body) : undefined, 
            signal: controller.signal 
        });
        
        clearTimeout(timeoutId);
        const data = await response.json();
        
        if (!response.ok) {
            const errorMessage = data.error || data.message || 'Erro de comunicação com o servidor.';
            apiTrackerService.updateLog(logId, { status: 'Error', error: errorMessage });
            throw new Error(errorMessage);
        }
        
        apiTrackerService.updateLog(logId, { status: 'Success', statusCode: response.status });
        return data;

    } catch (error: any) {
        const errorMessage = error.message || 'Erro na requisição';
        apiTrackerService.updateLog(logId, { status: 'Error', error: errorMessage });
        console.error(`%c[API ERROR] ${method} ${endpoint}`, "color: #FF4444; font-weight: bold;", errorMessage);
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
    cancelPurchaseTransaction() {
        return request('POST', '/wallet/cancel-purchase');
    },

    // User Action Modal
    userActions: {
        viewProfile(userId: string) {
            return request('GET', `/users/${userId}`);
        },
        mentionUser(userId: string) {
            return request('POST', `/users/${userId}/mention`);
        },
        makeModerator(streamId: string, userId: string) {
            return request('POST', `/streams/${streamId}/moderators`, { userId });
        },
        kickUser(streamId: string, userId: string) {
            return request('POST', `/streams/${streamId}/kick`, { userId });
        }
    },
    updateBillingAddress: (address: any) => request('POST', '/users/me/billing-address', address),
    updateCreditCard: (card: any) => request('POST', '/users/me/credit-card', card),
};
