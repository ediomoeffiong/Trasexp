import React, { useEffect } from 'react';
import { LogOut, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel" }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center p-4 transition-opacity duration-300"
            style={{ zIndex: 9999, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)' }}
        >
            <div
                className="bg-white w-full max-w-sm transform scale-100 transition-transform duration-300 relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                style={{
                    borderRadius: '24px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    padding: '0'
                }}
            >
                {/* Decorative Top Pattern */}
                <div style={{ height: '6px', width: '100%', background: 'linear-gradient(90deg, #2563EB 0%, #60A5FA 100%)' }}></div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition-colors"
                >
                    <X size={24} strokeWidth={2} />
                </button>

                <div className="flex flex-col items-center text-center p-8 pb-6">
                    <div
                        className="mb-6 flex items-center justify-center rounded-full shadow-sm"
                        style={{
                            width: '80px',
                            height: '80px',
                            backgroundColor: '#FEF2F2', // Red-50
                            color: '#EF4444', // Red-500
                            border: '4px solid #FFFFFF'
                        }}
                    >
                        <LogOut size={36} strokeWidth={2.5} />
                    </div>

                    <h3 className="text-2xl font-bold mb-3" style={{ color: '#0F172A' }}>
                        {title}
                    </h3>

                    <p className="text-base font-medium leading-relaxed" style={{ color: '#000000' }}>
                        {message}
                    </p>
                </div>

                <div className="flex flex-row gap-4 p-8 pt-0 pb-8">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 font-semibold text-lg transition-all rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3.5 text-white font-semibold text-lg transition-transform active:scale-95 shadow-lg shadow-red-500/30 hover:shadow-red-500/40 rounded-xl"
                        style={{
                            background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', // Rich Red Gradient
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
