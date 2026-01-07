import React, { useState, useEffect } from 'react';
import { CloseIcon } from '../icons';
import { api } from '../../services/api';

interface ChatConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    roomId?: string;
    currentUser?: any;
    onSettingsUpdate?: (settings: any) => void;
}

const ChatConfigModal: React.FC<ChatConfigModalProps> = ({ 
    isOpen, 
    onClose, 
    roomId,
    currentUser,
    onSettingsUpdate 
}) => {
    const [isModerator, setIsModerator] = useState(false);
    const [settings, setSettings] = useState({
        slowMode: false,
        followersOnly: false,
        subscribersOnly: false,
        emoteOnly: false,
        chatDelay: 0
    });

    useEffect(() => {
        if (isOpen && roomId) {
            // Fetch current room settings when modal opens
            fetchRoomSettings();
        }
    }, [isOpen, roomId]);

    const fetchRoomSettings = async () => {
        if (!roomId) return;
        
        try {
            const roomSettings = await api.streams.getById(roomId);
            if (roomSettings && roomSettings.chatSettings) {
                setSettings(roomSettings.chatSettings);
            }
            // Check if current user is a moderator (you might need to adjust this based on your user roles)
            if (currentUser && currentUser.isModerator) {
                setIsModerator(true);
            }
        } catch (error) {
            console.error('Error fetching room settings:', error);
        }
    };

    const handleSettingChange = async (setting: string, value: any) => {
        if (!roomId) return;
        
        const newSettings = { ...settings, [setting]: value };
        setSettings(newSettings);
        
        try {
            // Update settings on the server
            await api.streams.update(roomId, { chatSettings: newSettings });
            
            // Notify parent component of the update
            if (onSettingsUpdate) {
                onSettingsUpdate(newSettings);
            }
        } catch (error) {
            console.error('Error updating chat settings:', error);
            // Revert on error
            setSettings(prev => ({ ...prev }));
        }
    };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/20" onClick={onClose}>
            <div className="w-full bg-[#1C1C1E] rounded-t-2xl p-5 animate-in slide-in-from-bottom" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-bold">Configurações de Chat</h3>
                    <button onClick={onClose}><CloseIcon className="w-5 h-5 text-gray-400" /></button>
                </div>
                <div className="space-y-4 pb-8">
                    {/* Chat Mode Settings */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-300">Moderação do Chat</h4>
                        
                        {/* Slow Mode */}
                        <div className="flex items-center justify-between py-2 border-b border-white/5">
                            <div>
                                <p className="text-sm font-medium text-white">Modo Lento</p>
                                <p className="text-xs text-gray-400">Limita a frequência de mensagens</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer" 
                                    checked={settings.slowMode}
                                    onChange={(e) => handleSettingChange('slowMode', e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        {/* Followers Only */}
                        <div className="flex items-center justify-between py-2 border-b border-white/5">
                            <div>
                                <p className="text-sm font-medium text-white">Apenas Seguidores</p>
                                <p className="text-xs text-gray-400">Apenas seguidores podem enviar mensagens</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer" 
                                    checked={settings.followersOnly}
                                    onChange={(e) => handleSettingChange('followersOnly', e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        {/* Subscribers Only */}
                        <div className="flex items-center justify-between py-2 border-b border-white/5">
                            <div>
                                <p className="text-sm font-medium text-white">Apenas Assinantes</p>
                                <p className="text-xs text-gray-400">Apenas assinantes podem enviar mensagens</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer" 
                                    checked={settings.subscribersOnly}
                                    onChange={(e) => handleSettingChange('subscribersOnly', e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        {/* Emote Only */}
                        <div className="flex items-center justify-between py-2 border-b border-white/5">
                            <div>
                                <p className="text-sm font-medium text-white">Apenas Emotes</p>
                                <p className="text-xs text-gray-400">Permitir apenas mensagens com emotes</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer" 
                                    checked={settings.emoteOnly}
                                    onChange={(e) => handleSettingChange('emoteOnly', e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        {/* Chat Delay */}
                        <div className="pt-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-white">Atraso do Chat</span>
                                <span className="text-xs text-gray-400">{settings.chatDelay} segundos</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="30" 
                                value={settings.chatDelay}
                                onChange={(e) => handleSettingChange('chatDelay', parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>0s</span>
                                <span>30s</span>
                            </div>
                        </div>
                    </div>

                    {/* Moderator Controls (Only show if user is a moderator) */}
                    {isModerator && (
                        <div className="pt-4 border-t border-white/10">
                            <h4 className="text-sm font-medium text-gray-300 mb-3">Controles do Moderador</h4>
                            <div className="space-y-3">
                                <button 
                                    className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                                    onClick={async () => {
                                        if (!roomId) return;
                                        
                                        if (window.confirm('Tem certeza que deseja limpar o chat? Esta ação não pode ser desfeita.')) {
                                            try {
                                                await api.chats.clearChat(roomId);
                                                alert('Chat limpo com sucesso!');
                                            } catch (error) {
                                                console.error('Erro ao limpar o chat:', error);
                                                alert('Ocorreu um erro ao tentar limpar o chat.');
                                            }
                                        }
                                    }}
                                >
                                    Limpar Chat
                                </button>
                                <button 
                                    className="w-full px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors"
                                    onClick={() => {
                                        // Implement timeout user functionality
                                    }}
                                >
                                    Silenciar Usuário
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-gray-300">Filtrar Spam</span>
                            <div className="w-10 h-5 bg-purple-600 rounded-full"></div>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-white/5">
                            <span className="text-sm text-gray-300">Traduzir Automático</span>
                            <div className="w-10 h-5 bg-gray-700 rounded-full"></div>
                        </div>
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-4">Preferências salvas localmente</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatConfigModal;
