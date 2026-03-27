import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChefHat, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    ArrowRight, 
    Coffee, 
    UtensilsCrossed, 
    Timer,
    Flame,
    Hash,
    MoreVertical,
    Search,
    RefreshCw,
    Filter,
    Plus,
    X,
    Users,
    Trash2,
    Edit,
    Key,
    Shield,
    Mail,
    Phone,
    ExternalLink,
    ShoppingBag
} from 'lucide-react';
import { toast } from 'react-toastify';
import { adminOrdersApi, adminStaffApi } from '../services/adminApi';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const AdminChefPage = () => {
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [chefToDelete, setChefToDelete] = useState(null);
    const [chefs, setChefs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'staff'
    const [expandedOrders, setExpandedOrders] = useState([]);
    const [selectedOrderForDetail, setSelectedOrderForDetail] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    
    // Staff Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'chef',
        password: ''
    });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchOrders = async () => {
        try {
            const ordersData = await adminOrdersApi.getAll();
            setOrders(ordersData || []);
        } catch (error) {
            toast.error("Error fetching orders: " + error.message);
        }
    };

    const fetchStaff = async () => {
        try {
            const staffData = await adminStaffApi.getAll();
            setChefs(staffData.filter(h => h.role === 'chef') || []);
        } catch (error) {
            toast.error("Error fetching staff: " + error.message);
        }
    };

    const fetchAllData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchOrders(),
                fetchStaff()
            ]);
        } catch (error) {
            // Errors are already toasted by individual fetch functions
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateOrderStatus = async (id, status) => {
        try {
            await adminOrdersApi.updateStatus(id, status);
            toast.success(`Order ${String(id).slice(-6)} is now ${status}!`);
            fetchOrders(); // Only refetch orders
        } catch (error) {
            toast.error("Failed to update order: " + error.message);
        }
    };

    const handleOpenStaffModal = (member = null) => {
        if (member) {
            setEditingStaff(member);
            setFormData({
                name: member.name,
                email: member.email,
                phone: member.phone || '',
                role: 'chef'
            });
        } else {
            setEditingStaff(null);
            setFormData({
                name: '',
                email: '',
                phone: '',
                role: 'chef'
            });
        }
        setIsModalOpen(true);
    };

    const handleStaffSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingStaff) {
                const submissionData = { ...formData };
                await adminStaffApi.update(editingStaff.id, submissionData);
                toast.success(`Chef ${formData.name} updated!`);
            } else {
                const response = await adminStaffApi.create(formData);
                toast.success(`Chef ${formData.name} added! Access Code: ${response.staffCode || 'Auto-generated'}`);
            }
            setIsModalOpen(false);
            fetchStaff(); // Only refetch staff
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleStaffDelete = (chef) => {
        setChefToDelete(chef);
        setIsDeleteModalOpen(true);
    };

    const toggleExpand = (orderId) => {
        setExpandedOrders(prev => 
            prev.includes(orderId) 
                ? prev.filter(id => id !== orderId) 
                : [...prev, orderId]
        );
    };

    const handleViewDetail = (order) => {
        setSelectedOrderForDetail(order);
        setIsDetailModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!chefToDelete) return;
        try {
            await adminStaffApi.delete(chefToDelete.id);
            toast.success(`Chef ${chefToDelete.name} removed successfully`);
            fetchStaff();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsDeleteModalOpen(false);
            setChefToDelete(null);
        }
    };

    const OrderCard = ({ order }) => (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
        >
            <div className={`absolute top-0 right-0 w-2 h-full ${order.priority === 'High' ? 'bg-rose-400' : 'bg-slate-200'}`} />
            
            <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-admin-primary bg-admin-primary/5 px-2 py-0.5 rounded-md uppercase tracking-tighter">#{order.orderId || order.id}</span>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Hash size={12} /> {order.tableNumber || 'T-?'}</span>
                    </div>
                <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${
                    order.priority === 'High' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                }`}>
                    {order.priority === 'High' ? <Flame size={12} /> : <Clock size={12} />} {order.priority || 'Normal'}
                </div>
            </div>

            <div className="space-y-2 mb-6">
                {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0 group/item">
                        <span className="text-sm font-bold text-slate-700 tracking-tight">{item.name || 'Food Item'}</span>
                        <span className="text-xs font-black text-slate-400 px-2 py-0.5 bg-slate-50 rounded-full">x{item.quantity}</span>
                    </div>
                ))}
                {(!order.items || order.items.length === 0) && (
                    <p className="text-xs text-slate-400 italic">No items listed</p>
                )}
            </div>

            <div className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                    <Timer size={14} /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                {order.status === 'Order Received' ? (
                    <button 
                        onClick={() => handleUpdateOrderStatus(order.id, 'Preparing')}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg"
                    >
                        Start <Flame size={14} />
                    </button>
                ) : order.status === 'Preparing' ? (
                    <button 
                        onClick={() => handleUpdateOrderStatus(order.id, 'Ready')}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg"
                    >
                        Ready <CheckCircle2 size={14} />
                    </button>
                ) : (
                    <button 
                        onClick={() => handleUpdateOrderStatus(order.id, 'Delivered')}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                    >
                        Done <ArrowRight size={14} />
                    </button>
                )}
            </div>
        </motion.div>
    );

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-admin-primary"></div>
        </div>
    );

    return (
        <div className="space-y-10 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Kitchen</h1>
                    <p className="text-sm font-medium text-slate-500 mt-2 uppercase tracking-widest flex items-center gap-2">
                        <Flame size={14} className="text-admin-primary" /> Active Orders & Kitchen Staff
                    </p>
                </div>
                <div className="flex gap-2 p-1 bg-white rounded-2xl border border-slate-100">
                    <button 
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Orders
                    </button>
                    <button 
                        onClick={() => setActiveTab('staff')}
                        className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'staff' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Staff
                    </button>
                    <button onClick={fetchAllData} className="p-3 text-slate-400 hover:text-admin-primary transition-all">
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>

            {activeTab === 'orders' ? (
                /* Orders Table */
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mt-6">
                    <div className="w-full">
                        <table className="w-full text-left border-collapse min-w-full">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Order Details</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Items</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Status</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {orders.filter(o => o.status !== 'Delivered').map((order) => (
                                    <tr key={order.id} className="group hover:bg-slate-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-600 shadow-inner text-xs">
                                                        #{order.orderId || order.id}
                                                    </div>
                                                    <span className="text-[11px] font-black text-slate-700 flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 uppercase">
                                                        {order.tableNumber ? `Table ${order.tableNumber}` : 'Takeaway / Collection'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1 text-slate-500 font-bold text-[10px] uppercase tracking-widest bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                                                        <Timer size={10} /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    {order.priority === 'High' && (
                                                        <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-100">
                                                            <Flame size={10} /> Priority
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 max-w-[400px]">
                                            <div className="flex flex-col gap-2">
                                                <div className={`grid ${expandedOrders.includes(order.id) ? 'grid-cols-2' : 'grid-cols-1'} gap-x-6 gap-y-1.5 transition-all duration-300`}>
                                                    {(expandedOrders.includes(order.id) ? order.items : order.items?.slice(0, 3))?.map((item, idx) => (
                                                        <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                                                            <div className="flex flex-col min-w-0">
                                                                <span className="text-[11px] font-bold text-slate-700 truncate tracking-tight">{item.name || 'Item'}</span>
                                                                {expandedOrders.includes(order.id) && <span className="text-[9px] text-slate-400 uppercase font-medium">Standard Prep</span>}
                                                            </div>
                                                            <span className="text-[10px] font-black text-admin-primary px-2 py-0.5 bg-admin-primary/5 rounded-lg flex-shrink-0 ml-4">x{item.quantity || 1}</span>
                                                        </div>
                                                    ))}
                                                    {(!order.items || order.items.length === 0) && <span className="text-xs text-slate-400 italic">No items listed</span>}
                                                </div>

                                                {order.items?.length > 3 && (
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <button 
                                                            onClick={() => toggleExpand(order.id)}
                                                            className="text-[10px] font-black text-admin-primary uppercase tracking-widest hover:underline flex items-center gap-1"
                                                        >
                                                            {expandedOrders.includes(order.id) ? 'Show Less' : `+ ${order.items.length - 3} More Items`}
                                                        </button>
                                                        <button 
                                                            onClick={() => handleViewDetail(order)}
                                                            className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 flex items-center gap-1 ml-auto"
                                                        >
                                                            Full Detail <ExternalLink size={10} />
                                                        </button>
                                                    </div>
                                                )}
                                                
                                                {order.items?.length <= 3 && order.items?.length > 0 && (
                                                    <button 
                                                        onClick={() => handleViewDetail(order)}
                                                        className="text-[10px] font-black text-slate-200 uppercase tracking-widest hover:text-slate-400 flex items-center gap-1 mt-1"
                                                    >
                                                        View <ExternalLink size={10} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                                                order.status === 'Order Received' ? 'bg-white text-admin-primary border-admin-primary/20' : 
                                                order.status === 'Preparing' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            }`}>
                                                {order.status === 'Order Received' ? 'New' : order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {order.status === 'Order Received' ? (
                                                <button onClick={() => handleUpdateOrderStatus(order.id, 'Preparing')} className="inline-flex items-center justify-center gap-2 min-w-[120px] px-5 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg">Start <Flame size={14} /></button>
                                            ) : order.status === 'Preparing' ? (
                                                <button onClick={() => handleUpdateOrderStatus(order.id, 'Ready')} className="inline-flex items-center justify-center gap-2 min-w-[120px] px-5 py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg">Ready <CheckCircle2 size={14} /></button>
                                            ) : (
                                                <button onClick={() => handleUpdateOrderStatus(order.id, 'Delivered')} className="inline-flex items-center justify-center gap-2 min-w-[120px] px-5 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Done <ArrowRight size={14} /></button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {orders.filter(o => o.status !== 'Delivered').length === 0 && (
                            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
                                <Coffee size={48} className="text-slate-200 mb-2" />
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">No active kitchen orders</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* Chef Staff Management */
                <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Kitchen Team</h2>
                        <button 
                            onClick={() => handleOpenStaffModal()}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-admin-primary transition-all shadow-lg shadow-slate-200"
                        >
                            <Plus size={16} /> Add New Chef
                        </button>
                    </div>
                    {/* Kitchen Team Table */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mt-6">
                        <div className="w-full">
                            <table className="w-full text-left border-collapse min-w-full">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Chef Name</th>
                                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Role</th>
                                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Contact Details</th>
                                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right whitespace-nowrap">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {chefs.map(chef => (
                                        <tr key={chef.id} className="group hover:bg-slate-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-admin-primary/5 rounded-2xl flex items-center justify-center text-admin-primary shadow-sm">
                                                        <ChefHat size={20} />
                                                    </div>
                                                    <span className="text-sm font-black text-slate-900 tracking-tight">{chef.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl inline-flex border border-slate-100">
                                                    <Shield size={12} className="text-slate-400" /> Executive Chef
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                                                        <Mail size={12} className="text-slate-400"/> {chef.email}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                                                        <Phone size={12} className="text-slate-400"/> {chef.phone || 'N/A'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 transition-opacity">
                                                    <button onClick={() => handleOpenStaffModal(chef)} className="p-2.5 text-slate-400 hover:text-admin-primary hover:bg-admin-primary/5 rounded-xl transition-all" title="Edit Profile"><Edit size={16}/></button>
                                                    <button onClick={() => handleStaffDelete(chef)} className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all" title="Remove Chef"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {chefs.length === 0 && (
                                <div className="py-20 flex flex-col items-center">
                                    <ChefHat size={48} className="text-slate-200 mb-4" />
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">No Chefs Found</h3>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Staff Management Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[3rem] overflow-hidden shadow-2xl"
                        >
                            <div className="p-10">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{editingStaff ? 'Edit Chef' : 'Register Chef'}</h2>
                                    <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleStaffSubmit} className="space-y-6">
                                    <input required type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-admin-primary/20 outline-none transition-all" />
                                    <input required type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-admin-primary/20 outline-none transition-all" />
                                    <input type="tel" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-admin-primary/20 outline-none transition-all" />
                                    <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-admin-primary transition-all shadow-xl shadow-slate-200">
                                        {editingStaff ? 'Save' : 'Save'}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setChefToDelete(null); }}
                onConfirm={confirmDelete}
                title="Remove Chef"
                message="Are you sure you want to remove this chef from the team? This action will revoke their kitchen access."
                itemName={chefToDelete ? `${chefToDelete.name} (${chefToDelete.email})` : ''}
            />

            {/* Order Detail Modal (Option 4) */}
            <AnimatePresence>
                {isDetailModalOpen && selectedOrderForDetail && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDetailModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-2xl bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                            <div className="p-8 border-b border-slate-50 flex justify-between items-start bg-slate-50/30">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-3 py-1 bg-admin-primary/10 text-admin-primary rounded-full text-[10px] font-black uppercase tracking-widest">Order #${String(selectedOrderForDetail.orderId || selectedOrderForDetail.id).slice(-4)}</span>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedOrderForDetail.orderType === 'Dine-In' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>{selectedOrderForDetail.orderType}</span>
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Kitchen Ticket</h2>
                                </div>
                                <button onClick={() => setIsDetailModalOpen(false)} className="p-3 bg-white text-slate-400 hover:text-slate-900 rounded-2xl shadow-sm border border-slate-100 transition-all"><X size={20} /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                <div className="grid grid-cols-2 gap-8 mb-8 text-left">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</span>
                                        <p className="font-bold text-slate-900">{selectedOrderForDetail.customerName || 'Guest'}</p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Table / Spot</span>
                                        <p className="font-bold text-slate-900">{selectedOrderForDetail.tableNumber ? `Table ${selectedOrderForDetail.tableNumber}` : 'Takeaway'}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-slate-50 rounded-[2rem] p-6 space-y-3 border border-slate-100">
                                        {selectedOrderForDetail.items?.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm text-left">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-admin-primary/5 rounded-xl flex items-center justify-center text-admin-primary">
                                                        <span className="font-black text-xs">{idx + 1}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900 tracking-tight">{item.name}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Preparation Required</p>
                                                    </div>
                                                </div>
                                                <span className="text-xs font-black text-admin-primary bg-admin-primary/10 px-4 py-2 rounded-xl">x{item.quantity || 1}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex gap-4">
                                <button onClick={() => setIsDetailModalOpen(false)} className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:text-slate-900 transition-all">Close</button>
                                <button 
                                    onClick={() => {
                                        if (selectedOrderForDetail.status === 'Order Received') handleUpdateOrderStatus(selectedOrderForDetail.id, 'Preparing');
                                        else if (selectedOrderForDetail.status === 'Preparing') handleUpdateOrderStatus(selectedOrderForDetail.id, 'Ready');
                                        setIsDetailModalOpen(false);
                                    }}
                                    className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-admin-primary shadow-xl shadow-slate-200"
                                >
                                    Proceed Status
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminChefPage;
