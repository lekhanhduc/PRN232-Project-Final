import React from 'react';
import { Heart, Phone, Video } from 'lucide-react';
import { Button } from '../ui/Button';

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
    onVideoCall
}) => {
    return (
        <div className="flex flex-wrap gap-3">
            <button
                onClick={onToggleFavorite}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${isFavorite
                    ? 'bg-red-500/20 border border-red-300 text-red-100 hover:bg-red-500/30'
                    : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                    }`}
            >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-400 text-red-400' : ''}`} />
                {isFavorite ? 'Saved' : 'Save Doctor'}
            </button>

            <Button
                variant="outline"
                icon={Phone}
                onClick={onContact}
                className="bg-white text-blue-600 hover:bg-blue-50"
            >
                Contact Now
            </Button>

            <Button
                variant="success"
                icon={Video}
                onClick={onVideoCall}
            >
                Video Call
            </Button>
        </div>
    );
};
