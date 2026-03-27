import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShoppingBag, 
    User, 
    Phone, 
    Mail, 
    ChevronDown, 
    Search, 
    Loader2,
    RefreshCw,
    MapPin,
    Clock,
    CreditCard,
    Printer,
    XCircle,
    Download,
    Eye,
    ChevronRight,
    Filter,
    AlertCircle,
    Edit,
    Trash2,
    MoreHorizontal,
    CheckCircle2,
    UserCheck,
    Hash,
    UtensilsCrossed
} from 'lucide-react';
import { adminOrdersApi } from '../services/adminApi';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { toast } from 'react-toastify';

const StatusBadge = ({ status }) => {
    const variants = {
        'Order Received': 'bg-amber-50 text-amber-600 border-amber-100',
        'Preparing': 'bg-indigo-50 text-indigo-600 border-indigo-100',
        'Ready': 'bg-purple-50 text-purple-600 border-purple-100',
        'Completed': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'Delivered': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'Cancelled': 'bg-rose-50 text-rose-600 border-rose-100'
    };

    return (
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap ${variants[status] || 'bg-slate-50 text-slate-600 border-slate-100'}`}>
            {status}
        </span>
    );
};

const DetailModal = ({ order, isOpen, onClose }) => {
    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col border border-slate-200/60 mx-auto"
            >
                {/* Header Section */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white relative overflow-hidden">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
                            <ShoppingBag size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-xl font-bold text-slate-900">Order #{order.orderId}</h2>
                                <StatusBadge status={order.status} />
                            </div>
                            <p className="text-xs text-slate-500 font-medium tracking-tight">
                                Placed on {new Date(order.date).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })} at {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-full transition-colors text-slate-400"
                    >
                        <XCircle size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-slate-50/30">
                    {/* Modern Order Information Cards */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><User size={14}/> Customer & Service Details</h3>
                            <div className="flex items-center gap-2 bg-admin-primary/5 px-3 py-1.5 rounded-xl border border-admin-primary/10">
                                <span className="text-[9px] font-black uppercase text-admin-primary tracking-widest">Total Paid</span>
                                <span className="text-lg font-black text-admin-primary">£{Number(String(order.total || 0).replace(/[^0-9.]/g, '')).toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Customer Name */}
                            <div className="bg-white p-5 rounded-[1.5rem] border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
                                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 mb-3 border border-slate-100">
                                    <User size={14} />
                                </div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer Name</p>
                                <p className="text-sm font-bold text-slate-900 truncate">{order.customerName}</p>
                            </div>

                            {/* Contact Number */}
                            <div className="bg-white p-5 rounded-[1.5rem] border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
                                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 mb-3 border border-slate-100">
                                    <Phone size={14} />
                                </div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Contact Number</p>
                                <p className="text-sm font-bold text-slate-900 truncate">{order.customerPhone || 'N/A'}</p>
                            </div>

                            {/* Order Type */}
                            <div className="bg-white p-5 rounded-[1.5rem] border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
                                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 mb-3 border border-slate-100">
                                    <ShoppingBag size={14} />
                                </div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Order Type</p>
                                <p className="text-sm font-bold text-slate-900">{order.orderType}</p>
                            </div>

                            {/* Service Info */}
                            <div className="bg-white p-5 rounded-[1.5rem] border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
                                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 mb-3 border border-slate-100">
                                    <UtensilsCrossed size={14} />
                                </div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Service Info</p>
                                <p className="text-sm font-bold text-slate-900 truncate">
                                    {order.tableNumber ? `Table ${order.tableNumber}` : 'Standard'}
                                    {order.waiterName ? ` • ${order.waiterName}` : ''}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Admin Items Table */}
                    <div className="bg-white border border-slate-200 rounded-[1.5rem] shadow-sm overflow-hidden">
                        <div className="w-full overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left text-sm whitespace-nowrap min-w-[500px]">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-5 font-black text-slate-500 uppercase text-[10px] tracking-widest">Item Image</th>
                                        <th className="px-6 py-5 font-black text-slate-500 uppercase text-[10px] tracking-widest">Item Name</th>
                                        <th className="px-6 py-5 font-black text-slate-500 uppercase text-[10px] tracking-widest text-right">Unit Price</th>
                                        <th className="px-6 py-5 font-black text-slate-500 uppercase text-[10px] tracking-widest text-right">Qty</th>
                                        <th className="px-6 py-5 font-black text-slate-500 uppercase text-[10px] tracking-widest text-right">Line Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {order.items?.map((item, idx) => {
                                        const qty = item.qty || item.quantity || 1;
                                        const price = parseFloat(String(item.price || 0).replace(/[^0-9.]/g, '')) || 0;
                                        return (
                                            <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                                                <td className="px-6 py-4 w-[80px]">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shadow-sm">
                                                        {item.image ? <img src={item.image} className="w-full h-full object-cover"/> : <UtensilsCrossed size={14} className="text-slate-400"/>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-slate-900 truncate max-w-[250px]">{item.name}</td>
                                                <td className="px-6 py-4 font-medium text-slate-600 text-right">£{price.toFixed(2)}</td>
                                                <td className="px-6 py-4 font-bold text-slate-900 text-right">x{qty}</td>
                                                <td className="px-6 py-4 font-black text-slate-900 text-right">£{(price * qty).toFixed(2)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/30 flex gap-4">
                    <button 
                        onClick={onClose}
                        className="flex-1 px-8 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-slate-900 transition-all"
                    >
                        Close
                    </button>
                    {!['Completed', 'Delivered', 'Cancelled'].includes(order.status) && (
                        <button 
                            onClick={() => {
                                const nextStatus = order.status === 'Order Received' ? 'Preparing' : 
                                                 order.status === 'Preparing' ? 'Ready' : 
                                                 order.status === 'Ready' ? 'Delivered' : 'Completed';
                                onUpdateStatus(order.id, nextStatus);
                                onClose();
                            }}
                            className="flex-[2] px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-admin-primary transition-all shadow-xl shadow-slate-900/10"
                        >
                            Update to {order.status === 'Order Received' ? 'Preparing' : 
                                      order.status === 'Preparing' ? 'Ready' : 
                                      order.status === 'Ready' ? 'Delivered' : 'Next Status'}
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

const EditModal = ({ order, isOpen, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        orderType: 'Collection',
        tableNumber: '',
        instructions: '',
        status: 'Order Received'
    });
    
    useEffect(() => {
        if (order) {
            setFormData({
                customerName: order.customerName || '',
                customerPhone: order.customerPhone || '',
                orderType: order.orderType || 'Collection',
                tableNumber: order.tableNumber || '',
                instructions: order.instructions || '',
                status: order.status || 'Order Received'
            });
        }
    }, [order, isOpen]);

    if (!isOpen || !order) return null;

    const statuses = ['Order Received', 'Preparing', 'Ready', 'Completed', 'Delivered', 'Cancelled'];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <div className="text-left">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Edit Order <span className="text-slate-300 font-light">#{order.orderId}</span></h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 text-left">Edit</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"><XCircle size={24} /></button>
                </div>

                <div className="p-8 overflow-y-auto space-y-8 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2 text-left">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Customer Name</label>
                            <input 
                                value={formData.customerName}
                                onChange={e => setFormData({...formData, customerName: e.target.value})}
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-base font-bold text-slate-900 focus:bg-white focus:border-admin-primary/20 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2 text-left">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Customer Phone</label>
                            <input 
                                value={formData.customerPhone}
                                onChange={e => setFormData({...formData, customerPhone: e.target.value})}
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-base font-bold text-slate-900 focus:bg-white focus:border-admin-primary/20 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2 text-left">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Service Type</label>
                            <div className="relative">
                                <select 
                                    value={formData.orderType}
                                    onChange={e => setFormData({...formData, orderType: e.target.value})}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:border-admin-primary/20 outline-none transition-all appearance-none"
                                >
                                    <option value="Collection">Collection</option>
                                    <option value="Dine-In">Dine-In</option>
                                    <option value="Delivery">Delivery</option>
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        {formData.orderType === 'Dine-In' && (
                            <div className="space-y-2 text-left">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Table / Room #</label>
                                <input 
                                    value={formData.tableNumber}
                                    onChange={e => setFormData({...formData, tableNumber: e.target.value})}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-base font-bold text-slate-900 focus:bg-white focus:border-admin-primary/20 outline-none transition-all"
                                    placeholder="e.g. 5"
                                />
                            </div>
                        )}

                        <div className="space-y-2 text-left">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Order Status</label>
                            <div className="relative">
                                <select 
                                    value={formData.status}
                                    onChange={e => setFormData({...formData, status: e.target.value})}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:border-admin-primary/20 outline-none transition-all appearance-none"
                                >
                                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        <div className="space-y-2 text-left md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Notes</label>
                            <textarea 
                                rows={2}
                                value={formData.instructions}
                                onChange={e => setFormData({...formData, instructions: e.target.value})}
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-base font-medium text-slate-700 focus:bg-white focus:border-admin-primary/20 outline-none transition-all resize-none"
                            />
                        </div>
                    </div>


                </div>

                <div className="p-8 border-t border-slate-100 flex gap-4">
                    <button 
                        onClick={onClose}
                        className="flex-1 px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={async () => { 
                            const success = await onUpdate(order.id, formData); 
                            if (success !== false) onClose(); 
                        }}
                        className="flex-1 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
                    >
                        Save
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterType, setFilterType] = useState('All');
    const [dateFilter, setDateFilter] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToCancel, setItemToCancel] = useState(null);
    
    // Action Modal States
    const [viewOrder, setViewOrder] = useState(null);
    const [editOrder, setEditOrder] = useState(null);
    const [activeMenuId, setActiveMenuId] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await adminOrdersApi.getAll();
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrder = async (orderId, data) => {
        try {
            await adminOrdersApi.update(orderId, data);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...data } : o));
            const orderRef = orders.find(o => o.id === orderId);
            toast.success(`Order #${orderRef?.orderId || orderId} updated successfully`);
            fetchOrders();
            return true;
        } catch (error) {
            console.error('Update failed:', error);
            const msg = error.response?.data?.details || error.response?.data?.error || error.message;
            toast.error(`Failed to update order: ${msg}`);
            return false;
        }
    };

    const handleConfirmCancel = () => {
        if (!itemToCancel) return;
        updateOrder(itemToCancel.id, { status: 'Cancelled' });
    };

    const confirmCancel = (order) => {
        setItemToCancel(order);
        setIsDeleteModalOpen(true);
    };

    const handlePrintInvoice = (order) => {
        const printWindow = window.open('', '_blank');
        const itemsList = order.items.map(i => {
            const qty = i.qty || i.quantity || 1;
            const price = parseFloat(String(i.price || 0).replace(/[^0-9.]/g, '')) || 0;
            return `
                <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #eee;">${i.name}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${qty}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">£${price.toFixed(2)}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">£${(qty * price).toFixed(2)}</td>
                </tr>
            `;
        }).join('');

        printWindow.document.write(`
            <html>
                <head>
                    <title>Invoice #${order.orderId}</title>
                    <style>
                        body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; }
                        .container { max-width: 800px; margin: 0 auto; }
                        .header { text-align: center; margin-bottom: 50px; border-bottom: 4px solid #f1f5f9; padding-bottom: 30px; }
                        .header h1 { margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -0.05em; color: #0f172a; }
                        .header p { margin: 5px 0 0; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; font-size: 12px; }
                        .details-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; margin-bottom: 40px; }
                        .detail-item p { margin: 4px 0; font-size: 13px; }
                        .detail-item span { color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 10px; display: block; }
                        .detail-item strong { font-weight: 800; color: #0f172a; font-size: 15px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th { background: #f8fafc; text-align: left; padding: 12px; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b; tracking: 0.1em; }
                        .total-section { margin-top: 40px; border-top: 4px solid #f1f5f9; padding-top: 25px; text-align: right; }
                        .total-section p { margin: 0; color: #64748b; font-weight: 700; font-size: 14px; }
                        .total-section h2 { margin: 5px 0 0; font-size: 32px; font-weight: 900; color: #0f172a; }
                        .footer { margin-top: 60px; text-align: center; color: #94a3b8; font-size: 11px; border-top: 1px solid #f1f5f9; padding-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>TASTY BITES</h1>
                            <p>Official Order Invoice</p>
                        </div>
                        <div class="details-grid">
                            <div class="detail-item">
                                <span>Order Reference</span>
                                <strong>#${order.orderId}</strong>
                                <p>${new Date(order.date).toLocaleString([], { dateStyle: 'long', timeStyle: 'short' })}</p>
                            </div>
                            <div class="detail-item" style="text-align: right;">
                                <span>Customer Details</span>
                                <strong>${order.customerName}</strong>
                                <p>${order.customerPhone || 'N/A'}</p>
                            </div>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Item Description</th>
                                    <th style="text-align: center;">Qty</th>
                                    <th style="text-align: right;">Unit Price</th>
                                    <th style="text-align: right;">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsList}
                            </tbody>
                        </table>
                        <div class="total-section">
                            <p>Grand Total</p>
                            <h2>£${Number(String(order.total || 0).replace(/[^0-9.]/g, '')).toFixed(2)}</h2>
                        </div>
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} Tasty Bites Restaurant. All Rights Reserved.</p>
                            <p>Thank you for dining with us!</p>
                        </div>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 500);
    };

    const filteredOrders = orders.filter(o => {
        const matchesSearch = o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || String(o.orderId).includes(searchQuery);
        const matchesStatus = filterStatus === 'All' || o.status === filterStatus;
        const matchesType = filterType === 'All' || o.orderType === filterType;
        const matchesDate = !dateFilter || new Date(o.date).toLocaleDateString() === new Date(dateFilter).toLocaleDateString();
        return matchesSearch && matchesStatus && matchesType && matchesDate;
    });

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* Page Title */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Orders</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-widest">Manage orders</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={fetchOrders}
                        className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button 
                        onClick={() => {
                            const headers = ['Order ID', 'Date', 'Customer', 'Phone', 'Type', 'Table', 'Total', 'Status'];
                            const csvContent = [
                                headers.join(','),
                                ...filteredOrders.map(o => [
                                    `#${o.orderId}`,
                                    new Date(o.date).toLocaleDateString(),
                                    o.customerName,
                                    `="${o.customerPhone || ''}"`,
                                    o.orderType,
                                    o.tableNumber || '',
                                    o.total,
                                    o.status
                                ].join(','))
                            ].join('\n');
                            
                            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                            const link = document.createElement('a');
                            const url = URL.createObjectURL(blob);
                            link.setAttribute('href', url);
                            link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
                            link.style.visibility = 'hidden';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            toast.success('Orders exported successfully');
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                    >
                        <Download size={16} />
                        Export
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex flex-wrap lg:flex-nowrap items-end gap-6">
                    {/* Search Field */}
                    <div className="flex flex-col gap-2 flex-1 min-w-[280px]">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Search</label>
                        <div className="relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-14 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:border-slate-200 outline-none transition-all shadow-sm placeholder:text-slate-400 placeholder:font-bold h-[52px]"
                            />
                        </div>
                    </div>

                    <div className="h-10 w-px bg-slate-100 hidden lg:block mb-1.5" />

                    {/* Status Filter */}
                    <div className="flex flex-col gap-2 min-w-[160px]">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                        <div className="relative">
                            <select 
                                value={filterStatus} 
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full pl-5 pr-10 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold uppercase tracking-widest outline-none cursor-pointer appearance-none hover:bg-slate-100 transition-all h-[52px]"
                            >
                                <option value="All">All</option>
                                <option value="Order Received">Order Received</option>
                                <option value="Preparing">Preparing</option>
                                <option value="Ready">Ready</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    {/* Type Filter */}
                    <div className="flex flex-col gap-2 min-w-[160px]">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Type</label>
                        <div className="relative">
                            <select 
                                value={filterType} 
                                onChange={(e) => setFilterType(e.target.value)}
                                className="w-full pl-5 pr-10 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold uppercase tracking-widest outline-none cursor-pointer appearance-none hover:bg-slate-100 transition-all h-[52px]"
                            >
                                <option value="All">All</option>
                                <option value="Collection">Collection</option>
                                <option value="Dine-In">Dine-In</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    {/* Date Filter */}
                    <div className="flex flex-col gap-2 min-w-[180px]">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                        <div className="relative group">
                            <Flatpickr
                                value={dateFilter}
                                onChange={([date]) => setDateFilter(date ? date.toISOString() : '')}
                                options={{ dateFormat: 'Y-m-d', placeholder: 'Select Date' }}
                                className="w-full pl-5 pr-10 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold uppercase tracking-widest outline-none cursor-pointer hover:bg-slate-100 transition-all h-[52px]"
                                placeholder="SELECT DATE"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                <ChevronDown size={16} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders Table Container */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[600px]">
                {loading ? (
                    <div className="py-40 flex flex-col items-center">
                        <Loader2 className="animate-spin text-slate-300" size={48} />
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-6">Loading...</p>
                    </div>
                ) : filteredOrders.length > 0 ? (
                    <div className="overflow-visible">
                        <table className="w-full text-left border-collapse overflow-visible">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="overflow-visible">
                                {filteredOrders.map(order => (
                                    <tr 
                                        key={order.id} 
                                        className={`border-b border-slate-50 hover:bg-slate-50 transition-colors group relative ${activeMenuId === order.id ? 'z-50' : 'z-0'}`}
                                    >
                                        <td className="px-8 py-6">
                                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 font-black border border-slate-200 text-xs shadow-sm">
                                                #{order.orderId}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-black text-slate-900 leading-none">{order.customerName}</p>
                                            <p className="text-[11px] text-slate-400 font-bold mt-1.5">{new Date(order.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{order.orderType}</span>
                                                {order.tableNumber && <span className="text-[10px] font-bold text-admin-primary mt-1">Room/Table {order.tableNumber}</span>}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-black text-slate-900 tracking-tight">£{Number(String(order.total || 0).replace(/[^0-9.]/g, '')).toFixed(2)}</p>
                                            <p className="text-[10px] text-slate-400 font-bold mt-1">{order.items.length} Items</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => setViewOrder(order)}
                                                    className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:shadow-lg rounded-xl transition-all"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>

                                                <button 
                                                    onClick={() => handlePrintInvoice(order)}
                                                    className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-lg rounded-xl transition-all"
                                                    title="Print Invoice"
                                                >
                                                    <Printer size={18} />
                                                </button>

                                                <button 
                                                    onClick={() => setEditOrder(order)}
                                                    className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-orange-500 hover:border-orange-200 hover:shadow-lg rounded-xl transition-all"
                                                    title="Edit Order"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                
                                                <button 
                                                    onClick={() => confirmCancel(order)}
                                                    className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:shadow-lg rounded-xl transition-all"
                                                    title="Cancel Order"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-40 flex flex-col items-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-8 text-slate-200">
                            <ShoppingBag size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">None Found</h3>
                        <p className="text-sm text-slate-500 mt-2 max-w-sm text-center font-medium font-inter">No orders match.</p>
                    </div>
                )}
            </div>

            <DetailModal 
                order={viewOrder} 
                isOpen={!!viewOrder} 
                onClose={() => setViewOrder(null)} 
                onUpdateStatus={(id, status) => updateOrder(id, { status })}
            />

            <EditModal 
                order={editOrder} 
                isOpen={!!editOrder} 
                onClose={() => setEditOrder(null)} 
                onUpdate={updateOrder}
            />

            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setItemToCancel(null); }}
                onConfirm={handleConfirmCancel}
                title="Cancel Order"
                confirmText="Confirm Cancellation"
                variant="warning"
                message="Are you sure you want to cancel and archive this order? This action cannot be undone."
                itemName={itemToCancel ? `Order #${itemToCancel.orderId} - ${itemToCancel.customerName}` : ''}
            />
        </div>
    );
};

export default AdminOrdersPage;
