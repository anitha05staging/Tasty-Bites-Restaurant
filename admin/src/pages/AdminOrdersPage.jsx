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
    Trash2
} from 'lucide-react';
import { adminOrdersApi } from '../services/adminApi';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { toast } from 'react-toastify';

const StatusBadge = ({ status }) => {
    const variants = {
        'Pending': 'bg-amber-50 text-amber-600 border-amber-100',
        'Confirmed': 'bg-blue-50 text-blue-600 border-blue-100',
        'In Progress': 'bg-indigo-50 text-indigo-600 border-indigo-100',
        'Ready': 'bg-purple-50 text-purple-600 border-purple-100',
        'Completed': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'Delivered': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'Cancelled': 'bg-rose-50 text-rose-600 border-rose-100'
    };

    return (
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${variants[status] || 'bg-slate-50 text-slate-600 border-slate-100'}`}>
            {status}
        </span>
    );
};

const DetailModal = ({ order, isOpen, onClose }) => {
    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            >
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                            Order Detail <span className="text-slate-300 font-light">#{order.orderId}</span>
                        </h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Transaction Summary & Customer Info</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200 text-slate-400 hover:text-slate-900">
                        <XCircle size={24} />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                                <ShoppingBag size={12} /> Purchased Items
                            </h4>
                            <div className="space-y-3">
                                {order.items.map((item, idx) => {
                                    const qty = item.qty || item.quantity || 1;
                                    const price = parseFloat(String(item.price || 0).replace(/[^0-9.]/g, '')) || 0;
                                    return (
                                        <div key={idx} className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 bg-slate-900 text-white text-[10px] flex items-center justify-center rounded-lg font-black">
                                                    {qty}
                                                </div>
                                                <span className="text-sm font-bold text-slate-800">{item.name}</span>
                                            </div>
                                            <span className="text-sm font-black text-slate-900">
                                                £{(price * qty).toFixed(2)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center">
                                <span className="text-sm font-bold text-slate-400">Total Amount</span>
                                <span className="text-3xl font-black text-slate-900 tracking-tight">£{Number(String(order.total || 0).replace(/[^0-9.]/g, '')).toFixed(2)}</span>
                            </div>
                        </div>

                        {order.instructions && (
                            <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100 border-dashed">
                                <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest flex items-center gap-2 mb-3">
                                    <AlertCircle size={14} /> Customer Instructions
                                </p>
                                <p className="text-sm text-slate-700 italic font-medium leading-relaxed">"{order.instructions}"</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                                <User size={12} /> Contact Information
                            </h4>
                            <div className="space-y-5">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all"><User className="text-slate-400" size={18} /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Customer Name</p>
                                        <p className="text-base font-black text-slate-800 mt-1.5">{order.customerName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all"><Phone className="text-slate-400" size={18} /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Phone Number</p>
                                        <p className="text-base font-black text-slate-800 mt-1.5">{order.customerPhone || 'Not Provided'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all"><Clock className="text-slate-400" size={18} /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Order Time</p>
                                        <p className="text-base font-black text-slate-800 mt-1.5">{new Date(order.date).toLocaleString([], { dateStyle: 'long', timeStyle: 'short' })}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all"><MapPin className="text-slate-400" size={18} /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Service Type</p>
                                        <p className="text-base font-black text-slate-800 mt-1.5">{order.orderType} {order.tableNumber ? `• Table ${order.tableNumber}` : ''}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Payment Method</h4>
                            <div className="bg-emerald-50 text-emerald-700 px-6 py-4 rounded-2xl border border-emerald-100 inline-flex items-center gap-3">
                                <CreditCard size={18} />
                                <span className="text-sm font-black uppercase tracking-widest">Paid Online</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                    <button onClick={onClose} className="px-8 py-3.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-900/20">
                        Close Detail
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const EditModal = ({ order, isOpen, onClose, onUpdateStatus }) => {
    const [status, setStatus] = useState(order?.status || 'Pending');
    
    if (!isOpen || !order) return null;

    const statuses = ['Pending', 'Confirmed', 'In Progress', 'Ready', 'Completed', 'Cancelled'];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl p-8"
            >
                <div className="mb-8">
                    <h2 className="text-2xl font-black text-slate-900">Edit Order <span className="text-slate-300 font-light">#{order.orderId}</span></h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Update order progress status</p>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Status</label>
                    <div className="grid grid-cols-2 gap-3">
                        {statuses.map(s => (
                            <button
                                key={s}
                                onClick={() => setStatus(s)}
                                className={`
                                    px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all
                                    ${status === s 
                                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/10' 
                                        : 'bg-slate-50 text-slate-400 border-transparent hover:border-slate-200 hover:text-slate-600'}
                                `}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-10 flex gap-4">
                    <button 
                        onClick={onClose}
                        className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => { onUpdateStatus(order.id, status); onClose(); }}
                        className="flex-1 px-6 py-4 bg-admin-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-admin-primary/90 transition-all shadow-lg shadow-admin-primary/20"
                    >
                        Save Changes
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

    const updateStatus = async (orderId, newStatus) => {
        try {
            await adminOrdersApi.updateStatus(orderId, newStatus);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            toast.success(`Order status updated to ${newStatus}`);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleConfirmCancel = () => {
        if (!itemToCancel) return;
        updateStatus(itemToCancel.id, 'Cancelled');
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
        const matchesSearch = o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || o.orderId.includes(searchQuery);
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
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Management</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-widest">Process and fulfill customer orders</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={fetchOrders}
                        className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                        <Download size={16} />
                        Export Data
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex flex-col xl:flex-row gap-6">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-admin-primary transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Enter Order ID or Customer Name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-base font-bold text-slate-900 focus:bg-white focus:border-slate-200 outline-none transition-all shadow-sm"
                        />
                    </div>
                    
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="h-10 w-px bg-slate-100 hidden xl:block mx-2" />
                        
                        <div className="flex flex-col gap-2 min-w-[180px]">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Order Status</label>
                            <div className="relative">
                                <select 
                                    value={filterStatus} 
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="w-full pl-5 pr-10 py-3.5 bg-slate-50 border border-transparent rounded-xl text-xs font-bold uppercase tracking-widest outline-none cursor-pointer appearance-none hover:bg-slate-100 transition-all"
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 min-w-[160px]">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Type</label>
                            <div className="relative">
                                <select 
                                    value={filterType} 
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="w-full pl-5 pr-10 py-3.5 bg-slate-50 border border-transparent rounded-xl text-xs font-bold uppercase tracking-widest outline-none cursor-pointer appearance-none hover:bg-slate-100 transition-all"
                                >
                                    <option value="All">All Types</option>
                                    <option value="Collection">Collection Only</option>
                                    <option value="Dine-In">Dine-In</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 min-w-[180px]">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Filter by Date</label>
                            <div className="relative group">
                                <Flatpickr
                                    value={dateFilter}
                                    onChange={([date]) => setDateFilter(date ? date.toISOString() : '')}
                                    options={{ dateFormat: 'Y-m-d', placeholder: 'Select Date' }}
                                    className="w-full pl-5 pr-10 py-3.5 bg-slate-50 border border-transparent rounded-xl text-xs font-bold uppercase tracking-widest outline-none cursor-pointer hover:bg-slate-100 transition-all"
                                    placeholder="SELECT DATE"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders Table Container */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="py-40 flex flex-col items-center">
                        <Loader2 className="animate-spin text-slate-300" size={48} />
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-6">Refreshing active orders...</p>
                    </div>
                ) : filteredOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Info</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Grand Total</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map(order => (
                                    <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors group">
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
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => setViewOrder(order)}
                                                    className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:shadow-lg rounded-xl transition-all"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => setEditOrder(order)}
                                                    className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-admin-primary hover:border-admin-primary/20 hover:shadow-lg rounded-xl transition-all"
                                                    title="Edit Status"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handlePrintInvoice(order)}
                                                    className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-lg rounded-xl transition-all"
                                                    title="Print Invoice"
                                                >
                                                    <Printer size={18} />
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
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">No matching orders</h3>
                        <p className="text-sm text-slate-500 mt-2 max-w-sm text-center font-medium font-inter">Try adjusting your filters or search query to find who you're looking for.</p>
                    </div>
                )}
            </div>

            <DetailModal 
                order={viewOrder} 
                isOpen={!!viewOrder} 
                onClose={() => setViewOrder(null)} 
            />

            <EditModal 
                order={editOrder} 
                isOpen={!!editOrder} 
                onClose={() => setEditOrder(null)} 
                onUpdateStatus={updateStatus}
            />

            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setItemToCancel(null); }}
                onConfirm={handleConfirmCancel}
                title="Cancel & Remove Order"
                message="Are you sure you want to cancel and archive this order? This action cannot be undone."
                itemName={itemToCancel ? `Order #${itemToCancel.orderId} - ${itemToCancel.customerName}` : ''}
            />
        </div>
    );
};

export default AdminOrdersPage;
