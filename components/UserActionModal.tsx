
import React, { useState } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    onViewProfile: (user: User) => void;
    onMention: (user: User) => void;
    onMakeModerator: (user: User) => void;
    onKick: (user: User) => void;
}

const UserActionModal: React.FC<Props> = ({ isOpen, onClose, user, onViewProfile, onMention, onMakeModerator, onKick }) => {
    const [isLoading, setIsLoading] = useState({
        makeModerator: false,
        kick: false
    });

    if(!isOpen || !user) return null;

    const handleViewProfile = async () => {
        try {
            const userData = await api.userActions.viewProfile(user.id);
            onViewProfile(userData);
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            toast.error('Não foi possível carregar o perfil do usuário');
        }
    };

    const handleMention = async () => {
        try {
            await api.userActions.mentionUser(user.id);
            onMention(user);
            toast.success(`Mencionando ${user.name}`);
        } catch (error) {
            console.error('Erro ao mencionar usuário:', error);
            toast.error('Não foi possível mencionar o usuário');
        }
    };

    const handleMakeModerator = async () => {
        if (!user.id) return;
        
        setIsLoading(prev => ({ ...prev, makeModerator: true }));
        try {
            // Aqui você precisará passar o ID do stream atual
            const streamId = 'current-stream-id'; // Substitua pelo ID real do stream
            await api.userActions.makeModerator(streamId, user.id);
            onMakeModerator(user);
            toast.success(`${user.name} agora é um moderador`);
        } catch (error) {
            console.error('Erro ao tornar moderador:', error);
            toast.error('Não foi possível tornar o usuário moderador');
        } finally {
            setIsLoading(prev => ({ ...prev, makeModerator: false }));
        }
    };

    const handleKick = async () => {
        if (!user.id) return;
        
        if (!window.confirm(`Tem certeza que deseja expulsar ${user.name}?`)) {
            return;
        }

        setIsLoading(prev => ({ ...prev, kick: true }));
        try {
            // Aqui você precisará passar o ID do stream atual
            const streamId = 'current-stream-id'; // Substitua pelo ID real do stream
            await api.userActions.kickUser(streamId, user.id);
            onKick(user);
            toast.success(`${user.name} foi expulso`);
        } catch (error) {
            console.error('Erro ao expulsar usuário:', error);
            toast.error('Não foi possível expulsar o usuário');
        } finally {
            setIsLoading(prev => ({ ...prev, kick: false }));
        }
    };
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-transparent" onClick={onClose}>
            <div className="bg-[#2C2C2E] p-4 rounded-xl w-[250px] space-y-2" onClick={e => e.stopPropagation()}>
                <p className="text-white text-center font-bold mb-4">{user.name}</p>
                <button 
                    onClick={handleViewProfile} 
                    className="w-full p-2 bg-white/10 text-white rounded hover:bg-white/20 transition-colors"
                >
                    Ver Perfil
                </button>
                <button 
                    onClick={handleMention} 
                    className="w-full p-2 bg-white/10 text-white rounded hover:bg-white/20 transition-colors mt-2"
                >
                    Mencionar
                </button>
                <button 
                    onClick={handleMakeModerator} 
                    disabled={isLoading.makeModerator}
                    className={`w-full p-2 rounded mt-2 ${
                        isLoading.makeModerator 
                            ? 'bg-blue-400/30 text-blue-300' 
                            : 'bg-white/10 text-white hover:bg-white/20'
                    } transition-colors`}
                >
                    {isLoading.makeModerator ? 'Processando...' : 'Tornar Moderador'}
                </button>
                <button 
                    onClick={handleKick} 
                    disabled={isLoading.kick}
                    className={`w-full p-2 rounded mt-2 ${
                        isLoading.kick 
                            ? 'bg-red-400/30 text-red-300' 
                            : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                    } transition-colors`}
                >
                    {isLoading.kick ? 'Expulsando...' : 'Expulsar'}
                </button>
            </div>
        </div>
    )
}

export default UserActionModal;
