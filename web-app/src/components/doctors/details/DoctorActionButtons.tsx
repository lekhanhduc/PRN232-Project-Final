'use client';
import React from 'react';
import { Heart, Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DoctorActionButtonsProps {
    isFavorite: boolean;
    onToggleFavorite: () => void;
    onContact: () => void;
    onVideoCall: () => void;
}

export const DoctorActionButtons: React.FC<DoctorActionButtonsProps> = ({
    isFavorite,
    onToggleFavorite,
    onContact,
    onVideoCall,
}) => {
    return (
        <div className="flex flex-wrap gap-4">
            <button
                onClick={onToggleFavorite}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 ${isFavorite
                        ? 'bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-400 text-red-100 hover:from-red-600/30 hover:to-red-500/30'
                        : 'bg-gradient-to-r from-gray-700/20 to-gray-800/20 border border-white/30 text-white hover:from-gray-700/30 hover:to-gray-800/30'
                    }`}
            >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-400 text-red-400' : ''}`} />
                {isFavorite ? 'Saved' : 'Save Doctor'}
            </button>

            <Button
                variant="outline"
                icon={Phone}
                onClick={onContact}
                className="bg-white/10 text-white border-white/30 hover:bg-white/20 text-lg px-6 py-3 rounded-xl shadow-md"
            >
                Contact Now
            </Button>

            <Button
                variant="success"
                icon={Video}
                onClick={onVideoCall}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white text-lg px-6 py-3 rounded-xl shadow-lg hover:from-green-700 hover:to-green-800"
            >
                Video Call
            </Button>
        </div>
    );
};