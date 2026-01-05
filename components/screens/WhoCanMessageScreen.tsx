import React from 'react';
import { BackIcon, CheckIcon } from '../icons';

const WhoCanMessageScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <div className="flex flex-col h-full bg-[#111]">
            <header className="flex items-center p-4 flex-shrink-0 border-b border-white/5">
                <button onClick={onBack}><BackIcon className="w-6 h-6 text-white" /></button>
                <div className="flex-grow text-center mr-6"><h1 className="text-lg font-bold text-white">Mensagens</h1></div>
            </header>
            <div className="pt-2">
                {['Todos', 'Apenas Seguidores', 'Ninguém'].map((opt, idx) => (
                    <div key={opt} className="flex items-center justify-between px-4 py-4 border-b border-white/5">
                        <span className="text-white">{opt}</span>
                        {idx === 0 && <CheckIcon className="w-5 h-5 text-purple-500" />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WhoCanMessageScreen;