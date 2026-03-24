import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, Trash2 } from 'lucide-react';

const DeleteConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    itemName,
    confirmText = "Confirm Delete",
    variant = "danger" // 'danger' | 'warning' | 'info'
}) => {
    if (!isOpen) return null;

    const variantStyles = {
        danger: {
            bg: 'bg-rose-50',
            icon: 'text-rose-500',
            btn: 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'
        },
        warning: {
            bg: 'bg-amber-50',
            icon: 'text-amber-500',
            btn: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
        },
        info: {
            bg: 'bg-blue-50',
            icon: 'text-blue-500',
            btn: 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20'
        }
    };

    const style = variantStyles[variant] || variantStyles.danger;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100"
                >
                    <div className="p-8 pb-0 flex justify-between items-start">
                        <div className={`w-14 h-14 ${style.bg} rounded-2xl flex items-center justify-center ${style.icon}`}>
                            <AlertCircle size={28} />
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-8 pt-6">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                            {title || 'Confirmation'}
                        </h3>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            {message || 'Are you sure you want to proceed?'}
                        </p>
                        
                        {itemName && (
                            <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1 text-left">Target Item</span>
                                <span className="text-sm font-bold text-slate-700 block text-left">{itemName}</span>
                            </div>
                        )}
                    </div>

                    <div className="p-8 pt-0 flex gap-3">
                        <button 
                            onClick={onClose}
                            className="flex-1 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={() => { onConfirm(); onClose(); }}
                            className={`flex-1 py-4 ${style.btn} text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2`}
                        >
                            <Trash2 size={16} />
                            {confirmText}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default DeleteConfirmModal;
