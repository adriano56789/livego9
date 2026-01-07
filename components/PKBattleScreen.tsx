import React, { useState, useEffect, useRef, useMemo } from 'react';
import OnlineUsersModal from './live/OnlineUsersModal';
import ChatMessage from './live/ChatMessage';
import CoHostModal from './CoHostModal';
import EntryChatMessage from './live/EntryChatMessage';
import ToolsModal from './ToolsModal';
import { GiftIcon, SendIcon, MoreIcon, CloseIcon, ViewerIcon, BellIcon, LockIcon } from './icons';
import { Streamer, User, Gift, RankedUser, LiveSessionState, ToastType } from '../types';
import ContributionRankingModal from './ContributionRankingModal';
import BeautyEffectsPanel from './live/BeautyEffectsPanel';
import ResolutionPanel from './live/ResolutionPanel';
import GiftModal from './live/GiftModal';
import GiftAnimationOverlay, { GiftPayload } from './live/GiftAnimationOverlay';
import { useTranslation } from '../i18n';
import { api } from '../services/api';
import { webSocketManager } from '../services/websocket';
import FullScreenGiftAnimation from './live/FullScreenGiftAnimation';
import PrivateInviteModal from './live/PrivateInviteModal';
import SupportersBar from './live/SupportersBar';
import { GIFTS } from '../constants';

interface ChatMessageType {
    id: number;
    type: 'chat' | 'entry' | 'follow' | 'private_invite';
    user?: string;
    level?: number;
    message?: string | React.ReactNode;
    avatar?: string;
    fullUser?: User;
    inviteData?: {
        fromName: string;
        toName: string;
        streamId: string;
    };
}

interface PKBattleScreenProps {
    streamer: Streamer;
    streamers: User[];
    opponent: User;
    onSelectStream: (streamer: User) => void;
    onEndPKBattle: () => void;
    onRequestEndStream: () => void;
    onLeaveStreamView: () => void;
    onViewProfile: (user: User) => void;
    currentUser: User;
    onOpenWallet: (initialTab?: 'Diamante' | 'Ganhos') => void;
    onFollowUser: (user: User, streamId?: string) => void;
    onOpenPrivateChat: () => void;
    onOpenPrivateInviteModal: () => void;
    onStartChatWithStreamer: (user: User) => void;
    onOpenPKTimerSettings: () => void;
    onOpenFans: () => void;
    onOpenFriendRequests: () => void;
    liveSession: LiveSessionState | null;
    updateLiveSession: (updates: Partial<LiveSessionState>) => void;
    logLiveEvent: (type: string, data: any) => void;
    updateUser: (user: User) => void;
    onStreamUpdate: (updates: Partial<Streamer>) => void;
    refreshStreamRoomData: (streamerId: string) => void;
    addToast: (type: ToastType, message: string) => void;
    followingUsers?: User[];
    pkBattleDuration: number;
    onOpenVIPCenter: () => void;
    onOpenFanClubMembers: (streamer: User) => void;
    allUsers?: User[];
}

export const PKBattleScreen: React.FC<PKBattleScreenProps> = ({ 
    streamer, streamers, opponent, onSelectStream, onEndPKBattle, onRequestEndStream, onLeaveStreamView, onViewProfile, currentUser,
    onOpenWallet, onFollowUser, onOpenPrivateChat, onOpenPrivateInviteModal, onStartChatWithStreamer,
    onOpenPKTimerSettings, onOpenFans, onOpenFriendRequests, liveSession,
    updateLiveSession, logLiveEvent, updateUser, onStreamUpdate, refreshStreamRoomData, addToast,
    followingUsers = [], pkBattleDuration, onOpenVIPCenter, onOpenFanClubMembers, allUsers
}) => {
    const { t } = useTranslation();
    const [timeLeft, setTimeLeft] = useState(pkBattleDuration * 60);
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [chatInput, setChatInput] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);
    
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const [isGiftModalOpen, setGiftModalOpen] = useState(false);
    const [isCoHostModalOpen, setIsCoHostModalOpen] = useState(false);
    const [isOnlineUsersOpen, setOnlineUsersOpen] = useState(false);
    const [isPrivateInviteModalOpen, setIsPrivateInviteModalOpen] = useState(false);
    const [isRankingOpen, setIsRankingOpen] = useState(false);
    const [isBeautyEffectsOpen, setIsBeautyEffectsOpen] = useState(false);
    const [isResolutionPanelOpen, setResolutionPanelOpen] = useState(false);
    const [currentResolution, setCurrentResolution] = useState(streamer.quality || '480p');
    const [onlineUsers, setOnlineUsers] = useState<(User & { value: number })[]>([]);
    const [currentEffect, setCurrentEffect] = useState<GiftPayload | null>(null);
    const [bannerGifts, setBannerGifts] = useState<(GiftPayload & { id: number })[]>([]);
    const nextGiftId = useRef(0);
    const [receivedGifts, setReceivedGifts] = useState<(Gift & { count: number })[]>([]);
    
    // Estado para os apoiadores de cada time
    const [streamerSupporters, setStreamerSupporters] = useState<(User & { contribution: number })[]>([]);
    const [opponentSupporters, setOpponentSupporters] = useState<(User & { contribution: number })[]>([]);


    const isBroadcaster = streamer.hostId === currentUser.id;

    const handleEndPKBattle = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Primeiro chama o onRequestEndStream para mostrar o diálogo de confirmação
        onRequestEndStream();
        // O onEndPKBattle será chamado após a confirmação do usuário
        // através do fluxo de confirmação do diálogo
    };

    const handleFullscreenGiftAnimationEnd = () => {
        setCurrentEffect(null);
    };

    const handleBannerAnimationEnd = (giftId: number) => {
        setBannerGifts(prev => prev.filter(g => g.id !== giftId));
    };

    const streamerUser: User = useMemo(() => ({
        id: streamer.hostId,
        identification: streamer.hostId,
        name: streamer.name,
        avatarUrl: streamer.avatar,
        coverUrl: `https://picsum.photos/seed/${streamer.id}/800/1600`,
        country: '',
        age: 0,
        gender: 'not_specified',
        level: 0,
        xp: 0,
        location: '',
        distance: '',
        fans: 0,
        following: 0,
        receptores: 0,
        enviados: 0,
        topFansAvatars: [],
        isLive: false,
        diamonds: 0,
        earnings: 0,
        earnings_withdrawn: 0,
        bio: '',
        obras: [],
        curtidas: [],
        ownedFrames: [],
        activeFrameId: null,
        frameExpiration: null,
    }), [streamer]);

    // Cleanup effect for when component unmounts
    useEffect(() => {
        return () => {
            onLeaveStreamView();
        };
    }, [onLeaveStreamView]);

    useEffect(() => {
        if (!streamer.id) return;
        
        // Log battle start
        logLiveEvent('pk_battle_start', {
            streamerId: streamer.hostId,
            opponentId: opponent.id,
            battleId: streamer.id,
            timestamp: new Date().toISOString()
        });

        api.users.getOnlineUsers(streamer.id).then(data => {
            const users = Array.isArray(data) ? data : [];
            const mappedUsers = users.map(u => ({ ...u, value: (u as any).value || 0 }));
            setOnlineUsers(mappedUsers);
            
            // Log initial viewers
            logLiveEvent('viewers_update', {
                streamerId: streamer.hostId,
                battleId: streamer.id,
                viewerCount: mappedUsers.length,
                timestamp: new Date().toISOString()
            });
        });
        
        api.gifts.getGallery().then(gifts => {
            if (Array.isArray(gifts)) {
                setReceivedGifts(gifts);
            }
        });
        
        const handleInvite = (payload: any) => {
            if (payload.toUserId === currentUser.id || isBroadcaster) {
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    type: 'private_invite',
                    inviteData: payload
                } as ChatMessageType]);
            }
        };

        const handleNewGift = (payload: GiftPayload) => {
            if (payload.roomId !== streamer.id) return;
            if (liveSession) {
                const totalGiftValue = payload.gift.price * payload.quantity;
                updateLiveSession({ coins: (liveSession.coins || 0) + totalGiftValue });
            }
            setMessages(prev => [...prev, {
                id: Date.now(), type: 'chat', user: payload.fromUser.name, avatar: payload.fromUser.avatarUrl,
                message: `enviou ${payload.quantity}x ${payload.gift.icon} ${payload.gift.name}`
            }]);
            setCurrentEffect(payload);
        };

        webSocketManager.on('privateRoomInvite', handleInvite);
        webSocketManager.on('newStreamGift', handleNewGift);
        return () => { 
            webSocketManager.off('privateRoomInvite', handleInvite); 
            webSocketManager.off('newStreamGift', handleNewGift);
        };
    }, [streamer.id, currentUser.id, isBroadcaster, liveSession, updateLiveSession]);

    useEffect(() => {
        const timerId = setInterval(() => {
            setTimeLeft(t => {
                const newTime = Math.max(0, t - 1);
                // Log when battle is about to end (last 30 seconds)
                if (newTime === 30) {
                    logLiveEvent('battle_ending_soon', {
                        streamerId: streamer.hostId,
                        battleId: streamer.id,
                        timeRemaining: 30,
                        timestamp: new Date().toISOString()
                    });
                }
                // Log battle end
                if (newTime === 0) {
                    logLiveEvent('battle_ended', {
                        streamerId: streamer.hostId,
                        opponentId: opponent.id,
                        battleId: streamer.id,
                        timestamp: new Date().toISOString()
                    });
                }
                return newTime;
            });
        }, 1000);
        return () => clearInterval(timerId);
    }, [streamer.hostId, streamer.id, opponent.id]);

    const handleSendMessage = () => {
        if (!chatInput.trim()) return;
        const message = chatInput.trim();
        setMessages(prev => [...prev, {
            id: Date.now(),
            type: 'chat',
            user: currentUser.name,
            avatar: currentUser.avatarUrl,
            message: message
        }]);
        setChatInput('');
        
        // Log chat message
        logLiveEvent('chat_message', {
            userId: currentUser.id,
            userName: currentUser.name,
            streamerId: streamer.hostId,
            battleId: streamer.id,
            message: message,
            timestamp: new Date().toISOString()
        });
    };

    const handleJoinPrivate = (invite: any) => {
        addToast(ToastType.Success, `Saindo da batalha para entrar na sala de ${invite.fromName}...`);
        onEndPKBattle();
    };

    const handleStreamerSelect = (selectedStreamer: User) => {
        // Chama a função onSelectStream passando o streamer selecionado
        onSelectStream(selectedStreamer);
        
        // Opcional: Adiciona um feedback visual
        addToast(ToastType.Info, `Streamer selecionado: ${selectedStreamer.name}`);
    };

    const handleInviteCoHost = async (friend: User) => {
        try {
            const response = await api.inviteFriendForCoHost(streamer.id, friend.id);
            if (response.success) {
                addToast(ToastType.Success, `Convite enviado para ${friend.name}!`);
                // Log co-host invitation
                logLiveEvent('cohost_invite_sent', {
                    fromUserId: currentUser.id,
                    toUserId: friend.id,
                    streamId: streamer.id,
                    timestamp: new Date().toISOString()
                });
            } else {
                addToast(ToastType.Error, 'Falha ao enviar convite');
                // Log failed co-host invitation
                logLiveEvent('cohost_invite_failed', {
                    fromUserId: currentUser.id,
                    toUserId: friend.id,
                    streamId: streamer.id,
                    timestamp: new Date().toISOString(),
                    reason: 'API call failed'
                });
            }
        } catch (error) {
            console.error('Erro ao convidar co-apresentador:', error);
            addToast(ToastType.Error, 'Erro ao enviar convite');
        }
    };

    const handleOpenResolutionPanel = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsToolsOpen(false);
        setResolutionPanelOpen(true);
    };

    const handleOpenFansView = (e: React.MouseEvent) => {
        e.stopPropagation();
        onOpenFans();
    };

    const handleSelectResolution = async (resolution: string) => {
        const { success } = await api.streams.updateVideoQuality(streamer.id, resolution);
        if (success) {
            setCurrentResolution(resolution);
            onStreamUpdate({ quality: resolution });
            addToast(ToastType.Success, `Qualidade do vídeo alterada para ${resolution}`);
            // Log resolution change
            logLiveEvent('resolution_changed', {
                streamerId: streamer.hostId,
                battleId: streamer.id,
                resolution,
                timestamp: new Date().toISOString()
            });
        } else {
            const error = `Falha ao alterar a qualidade do vídeo para ${resolution}`;
            addToast(ToastType.Error, error);
            // Log resolution change failure
            logLiveEvent('resolution_change_failed', {
                streamerId: streamer.hostId,
                battleId: streamer.id,
                resolution,
                error: error,
                timestamp: new Date().toISOString()
            });
        }
        setResolutionPanelOpen(false);
    };

    const handleSendGift = async (gift: Gift, quantity: number, targetId?: string): Promise<User | null> => {
        const totalCost = (gift.price || 0) * quantity;
        if (currentUser.diamonds < totalCost) {
            onOpenWallet('Diamante');
            return null;
        }
        
        // Log gift sending attempt
        logLiveEvent('gift_send_attempt', {
            userId: currentUser.id,
            recipientId: targetId || streamer.hostId,
            giftId: gift.id || gift.name,
            quantity,
            totalCost,
            timestamp: new Date().toISOString()
        });
        
        try {
            // CHAMADA API NO PK
            const result = await api.sendGift(currentUser.id, streamer.id, gift.name, quantity, targetId || streamer.hostId);
            if (result.success) {
                if (result.updatedSender) {
                    updateUser(result.updatedSender);
                }
                
                // Atualiza os dados da sala após o envio do presente
                refreshStreamRoomData(streamer.hostId);
                
                const giftPayload: GiftPayload = {
                    fromUser: currentUser,
                    toUser: { id: targetId || streamer.hostId, name: 'Streamer' },
                    gift,
                    quantity,
                    roomId: streamer.id
                };

                // Feedback visual
                setCurrentEffect(giftPayload);

                if (liveSession && (targetId === streamer.hostId || !targetId)) {
                    updateLiveSession({ coins: (liveSession.coins || 0) + totalCost });
                    
                    // Log successful gift
                    logLiveEvent('gift_sent', {
                        userId: currentUser.id,
                        recipientId: streamer.hostId,
                        giftId: gift.id || gift.name,
                        quantity,
                        totalValue: totalCost,
                        timestamp: new Date().toISOString()
                    });
                }

                // Atualiza a lista de apoiadores
                const updateSupporters = (supporters: (User & { contribution: number })[], userId: string, amount: number): (User & { contribution: number })[] => {
                    const supporterIndex = supporters.findIndex(s => s.id === userId);
                    if (supporterIndex >= 0) {
                        // Se já existe, atualiza a contribuição
                        const updated = [...supporters];
                        updated[supporterIndex] = {
                            ...updated[supporterIndex],
                            contribution: (updated[supporterIndex].contribution || 0) + amount
                        };
                        return updated;
                    } else {
                        // Se não existe, adiciona um novo apoiador
                        const existingUser = allUsers?.find(u => u.id === userId);
                        const newSupporter: User & { contribution: number } = existingUser 
                            ? { 
                                ...existingUser,
                                contribution: amount 
                              }
                            : {
                                // Criar um usuário mínimo compatível com a interface User
                                id: userId,
                                identification: userId,
                                name: currentUser.id === userId ? currentUser.name : 'Usuário',
                                avatarUrl: currentUser.id === userId ? currentUser.avatarUrl : '',
                                coverUrl: '',
                                country: '',
                                age: 0,
                                gender: 'not_specified',
                                level: 1,
                                xp: 0,
                                location: '',
                                distance: '',
                                fans: 0,
                                following: 0,
                                receptores: 0,
                                enviados: 0,
                                topFansAvatars: [],
                                isLive: false,
                                diamonds: 0,
                                earnings: 0,
                                earnings_withdrawn: 0,
                                bio: '',
                                obras: [],
                                curtidas: [],
                                ownedFrames: [],
                                activeFrameId: null,
                                frameExpiration: null,
                                contribution: amount
                            };
                        return [...supporters, newSupporter];
                    }
                };

                // Determina se o presente foi para o streamer ou para o oponente
                if (!targetId || targetId === streamer.hostId) {
// ...
                    setStreamerSupporters(prev => 
                        updateSupporters(prev, currentUser.id, totalCost)
                    );
                } else if (targetId === opponent.id) {
                    // Presente para o oponente
                    setOpponentSupporters(prev => 
                        updateSupporters(prev, currentUser.id, totalCost)
                    );
                }

                return result.updatedSender;
            }
            return null;
        } catch(error: any) {
            addToast(ToastType.Error, error.message || "Falha ao enviar o presente.");
            api.users.me().then(user => updateUser(user)); 
            return null;
        }
    };

    return (
        <div className="absolute inset-0 bg-black flex flex-col font-sans text-white z-10 overflow-hidden">
            <div className="h-[60%] w-full relative grid grid-cols-2">
                <div className="h-full border-r border-yellow-400/50 relative">
                    <img src={`https://picsum.photos/seed/${streamer.hostId}/500/800`} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold">ME</div>
                    <div className="absolute bottom-2 left-2 right-2">
                        <SupportersBar 
                            streamerSupporters={streamerSupporters}
                            opponentSupporters={[]}
                            onViewProfile={onViewProfile}
                        />
                    </div>
                </div>
                <div className="h-full relative" onClick={() => onSelectStream(opponent)}>
                    <img src={opponent.coverUrl} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase">Opponent</div>
                    <div className="absolute bottom-2 left-2 right-2">
                        <SupportersBar 
                            streamerSupporters={[]}
                            opponentSupporters={opponentSupporters}
                            onViewProfile={onViewProfile}
                        />
                    </div>
                </div>
                
                <FullScreenGiftAnimation payload={currentEffect} onEnd={handleFullscreenGiftAnimationEnd} />
                
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 bg-black/60 backdrop-blur-md px-4 py-1 rounded-full border border-white/10 font-black text-xs">
                    {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </div>
            </div>

            <div className="flex-1 bg-black flex flex-col p-3 gap-2 overflow-hidden">
                <div className="absolute top-[62%] left-3 z-30 pointer-events-none flex flex-col-reverse items-start">
                    {bannerGifts.map((payload) => (
                        <GiftAnimationOverlay 
                            key={payload.id}
                            giftPayload={payload}
                            onAnimationEnd={handleBannerAnimationEnd}
                        />
                    ))}
                </div>
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-2">
                    {messages.map(msg => (
                        <div key={msg.id}>
                            {msg.type === 'private_invite' ? (
                                <div onClick={() => handleJoinPrivate(msg.inviteData)} className="bg-purple-600/90 p-3 rounded-xl border border-white/20 cursor-pointer active:scale-95 transition-all">
                                    <p className="text-[12px] font-bold text-white leading-tight">
                                        "{msg.inviteData?.fromName} convidou para a sala privada"
                                    </p>
                                    <span className="text-[10px] text-purple-200 mt-1 block font-bold uppercase">Toque para aceitar</span>
                                </div>
                            ) : msg.type === 'entry' && msg.fullUser ? (
                                <EntryChatMessage 
                                    key={msg.id}
                                    user={msg.fullUser}
                                    currentUser={currentUser}
                                    onClick={onViewProfile}
                                    onFollow={onFollowUser}
                                    isFollowed={followingUsers.some(u => u.id === msg.fullUser!.id)}
                                    streamer={{
                                        id: streamerUser.id,
                                        name: streamerUser.name,
                                        avatar: streamerUser.avatarUrl // Mapeando avatarUrl para avatar
                                    }}
                                />
                            ) : (
                                <ChatMessage 
                                    userObject={{ name: msg.user || '', avatarUrl: msg.avatar, level: 1 }} 
                                    message={msg.message!} 
                                    onAvatarClick={() => {}} 
                                    streamerId={streamer.hostId} 
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <input type="text" className="flex-1 bg-white/10 rounded-full px-4 py-2 outline-none text-sm" placeholder="Diga algo..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} />
                    <button onClick={() => setGiftModalOpen(true)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-yellow-400"><GiftIcon className="w-6 h-6" /></button>
                    <button onClick={() => setIsToolsOpen(true)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"><MoreIcon className="w-6 h-6" /></button>
                </div>
            </div>

            <GiftModal 
                isOpen={isGiftModalOpen} 
                onClose={() => setGiftModalOpen(false)} 
                currentUser={currentUser}
                onUpdateUser={updateUser}
                onSendGift={handleSendGift} 
                onRecharge={() => onOpenWallet('Diamante')} 
                gifts={GIFTS}
                onOpenVIPCenter={onOpenVIPCenter}
                receivedGifts={receivedGifts}
                hostUser={streamerUser}
                onlineUsers={onlineUsers}
                streamId={streamer.id}
                hostId={streamer.hostId}
                isBroadcaster={isBroadcaster}
            />

            <ToolsModal 
                isOpen={isToolsOpen} 
                onClose={() => setIsToolsOpen(false)} 
                onOpenCoHostModal={() => {}}
                onOpenBeautyPanel={() => {}}
                isMicrophoneMuted={false}
                onToggleMicrophone={() => {}}
                isSoundMuted={false}
                onToggleSound={() => {}}
                onOpenClarityPanel={() => {}}
                isModerationActive={false}
                onToggleModeration={() => {}}
                onOpenPrivateInviteModal={onOpenPrivateInviteModal}
                onOpenPrivateChat={onOpenPrivateChat}
                onOpenFriendRequests={onOpenFriendRequests}
                onStartChatWithStreamer={() => onStartChatWithStreamer(streamerUser)}
                onToggleAutoFollow={() => {}}
                isAutoFollowEnabled={false}
                onToggleAutoPrivateInvite={() => {}}
                isAutoPrivateInviteEnabled={false}
                isPKBattleActive={false}
                onEndPKBattle={handleEndPKBattle}
                onOpenRanking={() => {}}
                onOpenFans={() => {}}
            />

            {isPrivateInviteModalOpen && <PrivateInviteModal isOpen={isPrivateInviteModalOpen} onClose={() => setIsPrivateInviteModalOpen(false)} streamId={streamer.id} hostId={streamer.hostId} />}
            {isOnlineUsersOpen && <OnlineUsersModal onClose={() => setOnlineUsersOpen(false)} streamId={streamer.id} users={onlineUsers} />}
            <CoHostModal 
                isOpen={isCoHostModalOpen}
                onClose={() => setIsCoHostModalOpen(false)}
                streamId={streamer.id}
                currentUser={currentUser}
                onInvite={handleInviteCoHost}
                onOpenTimerSettings={() => {
                    // Fecha o modal de co-host e abre as configurações do temporizador PK
                    setIsCoHostModalOpen(false);
                    onOpenPKTimerSettings();
                }}
                addToast={addToast}
            />
            {isBeautyEffectsOpen && (
                <BeautyEffectsPanel
                    onClose={() => setIsBeautyEffectsOpen(false)}
                    addToast={addToast}
                />
            )}
            {isRankingOpen && (
                <ContributionRankingModal 
                    onClose={() => setIsRankingOpen(false)} 
                    liveRanking={onlineUsers}
                />
            )}
            <ResolutionPanel 
                isOpen={isResolutionPanelOpen}
                onClose={() => setResolutionPanelOpen(false)}
                onSelectResolution={handleSelectResolution}
                currentResolution={currentResolution}
            />
        </div>
    );
};

export default PKBattleScreen;