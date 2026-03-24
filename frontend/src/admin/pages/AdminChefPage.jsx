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
    Phone
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
                role: 'chef',
                password: ''
            });
        } else {
            setEditingStaff(null);
            setFormData({
                name: '',
                email: '',
                phone: '',
                role: 'chef',
                password: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleStaffSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingStaff) {
                const submissionData = { ...formData };
                if (!submissionData.password) delete submissionData.password;
                await adminStaffApi.update(editingStaff.id, submissionData);
                toast.success(`Chef ${formData.name} updated!`);
            } else {
                if (!formData.password) return toast.error("Password is required");
                await adminStaffApi.create(formData);
                toast.success(`Chef ${formData.name} added!`);
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
                /* Kanban Board */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                    {/* New Orders Column */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-base font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                                <UtensilsCrossed className="text-admin-primary" size={20} /> New
                            </h3>
                            <span className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-xs font-black text-admin-primary shadow-sm">
                                {orders.filter(o => o.status === 'Order Received').length}
                            </span>
                        </div>
                        <div className="space-y-6 min-h-[400px] p-2 rounded-[3.5rem] bg-slate-50/50 border border-dashed border-slate-200 transition-all">
                            <AnimatePresence mode='popLayout'>
                                {orders.filter(o => o.status === 'Order Received').map(order => (
                                    <OrderCard key={order.id} order={order} />
                                ))}
                            </AnimatePresence>
                            {orders.filter(o => o.status === 'Order Received').length === 0 && (
                                <div className="h-60 flex flex-col items-center justify-center text-slate-400 gap-4">
                                    <Coffee size={40} className="opacity-20" />
                                    <p className="text-xs font-bold uppercase tracking-widest opacity-40 text-center">No new orders</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Preparing Column */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-base font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                                <Flame className="text-rose-500" size={20} /> Preparing
                            </h3>
                            <span className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-xs font-black text-rose-500 shadow-sm">
                                {orders.filter(o => o.status === 'Preparing').length}
                            </span>
                        </div>
                        <div className="space-y-6 min-h-[400px] p-2 rounded-[3.5rem] bg-rose-50/20 border border-dashed border-rose-200/50 transition-all">
                            <AnimatePresence mode='popLayout'>
                                {orders.filter(o => o.status === 'Preparing').map(order => (
                                    <OrderCard key={order.id} order={order} />
                                ))}
                            </AnimatePresence>
                            {orders.filter(o => o.status === 'Preparing').length === 0 && (
                                <div className="h-60 flex flex-col items-center justify-center text-slate-400 gap-4">
                                    <Flame size={40} className="opacity-10" />
                                    <p className="text-xs font-bold uppercase tracking-widest opacity-40 text-center">Nothing cooking</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Ready Column */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-base font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                                <CheckCircle2 className="text-emerald-500" size={20} /> Ready
                            </h3>
                            <span className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-xs font-black text-emerald-500 shadow-sm">
                                {orders.filter(o => o.status === 'Ready').length}
                            </span>
                        </div>
                        <div className="space-y-6 min-h-[400px] p-2 rounded-[3.5rem] bg-emerald-50/20 border border-dashed border-emerald-200/50 transition-all">
                            <AnimatePresence mode='popLayout'>
                                {orders.filter(o => o.status === 'Ready').map(order => (
                                    <OrderCard key={order.id} order={order} />
                                ))}
                            </AnimatePresence>
                            {orders.filter(o => o.status === 'Ready').length === 0 && (
                                <div className="h-60 flex flex-col items-center justify-center text-slate-400 gap-4">
                                    <AlertCircle size={40} className="opacity-10" />
                                    <p className="text-xs font-bold uppercase tracking-widest opacity-40 text-center">No orders ready</p>
                                </div>
                            )}
                        </div>
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {chefs.map(chef => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                key={chef.id}
                                className="bg-white rounded-[3.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-16 h-16 bg-admin-primary/5 rounded-[1.5rem] flex items-center justify-center text-admin-primary">
                                        <ChefHat size={32} />
                                    </div>
                                    <div className="flex gap-2 transition-all">
                                        <button onClick={() => handleOpenStaffModal(chef)} className="p-2 text-slate-400 hover:text-admin-primary transition-colors"><Edit size={16}/></button>
                                        <button onClick={() => handleStaffDelete(chef)} className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <h4 className="text-xl font-black text-slate-900 mb-1">{chef.name}</h4>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Shield size={12} /> Executive Chef
                                </p>
                                <div className="space-y-2 pt-4 border-t border-slate-50 text-slate-500 text-xs font-medium">
                                    <p className="flex items-center gap-2"><Mail size={14} className="text-slate-300"/> {chef.email}</p>
                                    <p className="flex items-center gap-2"><Phone size={14} className="text-slate-300"/> {chef.phone || 'N/A'}</p>
                                </div>
                            </motion.div>
                        ))}
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
                                    <div className="relative">
                                        <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                        <input required={!editingStaff} type="password" placeholder={editingStaff ? 'New Password (Optional)' : 'Password'} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-admin-primary/20 outline-none transition-all" />
                                    </div>
                                    <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-admin-primary transition-all shadow-xl shadow-slate-200">
                                        {editingStaff ? 'Save Changes' : 'Register Chef'}
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
        </div>
    );
};

export default AdminChefPage;
