import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, Trash2 } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, message, itemName }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
                >
                    <div className="p-8 pb-0 flex justify-between items-start">
                        <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500">
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
                            {title || 'Delete Confirmation'}
                        </h3>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            {message || 'Are you sure you want to delete this item? This action cannot be undone.'}
                        </p>
                        
                        {itemName && (
                            <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Target Item</span>
                                <span className="text-sm font-bold text-slate-700">{itemName}</span>
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
                            className="flex-1 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Trash2 size={16} />
                            Confirm Delete
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default DeleteConfirmModal;
