import React, { useState, useRef } from "react";

interface CharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentCharacterUrl: string;
}

const PRESET_CHARACTERS = [
  { id: "ayano", name: "Ayano", url: "/partner.png" },
  { id: "lebron", name: "LeBron James", url: "/lebron_custom.png" },
];

export const CharacterModal = ({ isOpen, onClose, onSelect, currentCharacterUrl }: CharacterModalProps) => {
  const [characterImage, setCharacterImage] = useState<File | string | null>(currentCharacterUrl);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const charInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleConfirm = () => {
    let charUrl = currentCharacterUrl;
    if (characterImage instanceof File) {
      charUrl = URL.createObjectURL(characterImage);
    } else if (typeof characterImage === "string") {
      charUrl = characterImage;
    }
    onSelect(charUrl);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-300 pointer-events-auto p-4">
      <div 
        className="bg-[#fdfaf6] rounded-[2rem] p-6 md:p-8 max-w-xl w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-pink-200/50 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col gap-6"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(244, 114, 182, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(244, 114, 182, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      >
        <div className="text-center mb-2">
          <h2 className="text-3xl font-extrabold text-slate-700 mb-2 tracking-wide" style={{ fontFamily: '"Nunito", sans-serif' }}>Select Partner</h2>
          <p className="text-slate-500 font-medium">Choose your companion for this journey</p>
        </div>

        <div className="space-y-4">
          {/* Presets */}
          <div className="grid grid-cols-2 gap-4">
            {PRESET_CHARACTERS.map((char) => (
              <div 
                key={char.id}
                onClick={() => setCharacterImage(char.url)}
                className={`
                  relative rounded-xl overflow-hidden cursor-pointer border-4 transition-all bg-white
                  ${characterImage === char.url ? 'border-pink-500 scale-105 shadow-lg' : 'border-transparent hover:scale-105 hover:shadow'}
                `}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={char.url} alt={char.name} className="w-full h-32 object-contain p-2" />
                <div className="absolute bottom-0 w-full bg-black/50 backdrop-blur-sm text-white text-xs p-1 text-center font-medium">
                  {char.name}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-slate-400 text-xs font-bold tracking-widest my-4">- OR UPLOAD CUSTOM -</div>

          {/* Open Upload Modal Button */}
          <div 
            onClick={() => setShowUploadModal(true)}
            className={`border-2 border-dashed transition-colors rounded-2xl p-4 text-center cursor-pointer flex flex-col items-center justify-center
              ${characterImage instanceof File ? 'border-pink-500 bg-pink-50' : 'border-pink-300 hover:border-pink-500 hover:bg-pink-50/50'}`}
          >
            {characterImage instanceof File ? (
              <div className="text-pink-600 font-medium">Selected: {characterImage.name}</div>
            ) : (
              <div className="text-pink-500 font-bold uppercase tracking-wide">
                + Upload Character
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button 
            onClick={onClose} 
            className="flex-1 py-3 px-6 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-600 rounded-2xl font-bold text-lg transition-all hover:scale-105"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm} 
            className="flex-1 py-3 px-6 bg-pink-400 hover:bg-pink-500 text-white shadow-[0_0_15px_rgba(244,114,182,0.4)] rounded-2xl font-bold text-lg transition-all hover:scale-105"
          >
            Confirm
          </button>
        </div>
      </div>

      {/* Nested Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl flex flex-col gap-6 animate-in zoom-in-95">
            <div className="text-center">
              <h3 className="text-2xl font-extrabold text-slate-700 mb-1" style={{ fontFamily: '"Nunito", sans-serif' }}>Upload Character</h3>
              <p className="text-slate-500 text-sm">Select an image file from your device</p>
            </div>
            
            <div 
              onClick={() => charInputRef.current?.click()}
              className="border-2 border-dashed transition-colors rounded-2xl p-6 text-center cursor-pointer flex flex-col items-center justify-center min-h-[160px] border-pink-300 hover:border-pink-500 hover:bg-pink-50/50 group"
            >
              <input 
                type="file" 
                ref={charInputRef} 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setCharacterImage(e.target.files[0]);
                    setShowUploadModal(false);
                  }
                }}
              />
              <div className="text-slate-500 text-sm group-hover:scale-105 transition-transform">
                <span className="text-pink-500 font-bold block text-lg mb-2">Click to upload</span>
                or drag and drop character image
              </div>
            </div>

            <button 
              onClick={() => setShowUploadModal(false)}
              className="py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
