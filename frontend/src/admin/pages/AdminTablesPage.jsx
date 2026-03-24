import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Grid2X2, 
    Plus, 
    Users, 
    MoreVertical, 
    Edit, 
    Trash2, 
    CheckCircle2, 
    Clock, 
    AlertCircle,
    ShoppingBag,
    Search,
    Filter,
    X,
    MapPin,
    ArrowRight,
    ChevronRight
} from 'lucide-react';
import { toast } from 'react-toastify';
import { adminTablesApi, adminStaffApi } from '../services/adminApi';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const AdminTablesPage = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [locationFilter, setLocationFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [tableToDelete, setTableToDelete] = useState(null);
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);
    const [staff, setStaff] = useState([]);
    const [editingTable, setEditingTable] = useState(null);
    const [formData, setFormData] = useState({
        number: '',
        capacity: 2,
        location: 'Indoor',
        status: 'Available'
    });

    useEffect(() => {
        fetchTables();
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const data = await adminStaffApi.getAll();
            setStaff(data.filter(s => s.role === 'waiter'));
        } catch (error) {
            console.error("Failed to load staff", error);
        }
    };

    const fetchTables = async () => {
        try {
            setLoading(true);
            const data = await adminTablesApi.getAll();
            setTables(data);
        } catch (error) {
            toast.error("Failed to load tables: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (table = null) => {
        if (table) {
            setEditingTable(table);
            setFormData({
                number: table.number,
                capacity: table.capacity,
                location: table.location,
                status: table.status
            });
        } else {
            setEditingTable(null);
            setFormData({
                number: '',
                capacity: 2,
                location: 'Indoor',
                status: 'Free'
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTable) {
                await adminTablesApi.update(editingTable.id, formData);
                toast.success(`Table ${formData.number} updated successfully!`);
            } else {
                await adminTablesApi.create(formData);
                toast.success(`Table ${formData.number} created successfully!`);
            }
            setIsModalOpen(false);
            fetchTables();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleAssignWaiter = async (waiterId) => {
        try {
            await adminTablesApi.update(selectedTable.id, { 
                waiterId,
                status: 'Occupied' // Auto-occupy when assigned for now
            });
            toast.success(`Table ${selectedTable.number} assigned successfully!`);
            setIsAssignModalOpen(false);
            fetchTables();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = (table) => {
        setTableToDelete(table);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!tableToDelete) return;
        try {
            await adminTablesApi.delete(tableToDelete.id);
            toast.success(`Table ${tableToDelete.number} deleted successfully`);
            fetchTables();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Available': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Occupied': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'Reserved': return 'bg-amber-50 text-amber-600 border-amber-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    const filteredTables = tables.filter(t => {
        const matchesFilter = filter === 'All' || t.status === filter;
        const matchesLocation = locationFilter === 'All' || t.location === locationFilter;
        const matchesSearch = t.number.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesLocation && matchesSearch;
    });

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
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Tables</h1>
                    <p className="text-sm font-medium text-slate-500 mt-2 uppercase tracking-widest flex items-center gap-2">
                        <MapPin size={14} className="text-admin-primary" /> Manage tables and staff
                    </p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-admin-primary transition-all shadow-2xl shadow-slate-200 overflow-hidden"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" /> 
                    <span>Add Table</span>
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
            </div>

            {/* Controls */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white/50 backdrop-blur-md p-3 rounded-[2rem] border border-slate-100/50">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    <div className="relative w-full sm:w-48 group">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-admin-primary transition-colors" size={14} />
                        <select 
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full pl-10 pr-10 py-3.5 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer appearance-none hover:bg-slate-50 transition-all shadow-sm h-[48px]"
                        >
                            {['All', 'Available', 'Occupied', 'Reserved'].map(f => (
                                <option key={f} value={f}>{f}</option>
                            ))}
                        </select>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none rotate-90" size={14} />
                    </div>

                    <div className="relative w-full sm:w-48 group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-admin-primary transition-colors" size={14} />
                        <select 
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                            className="w-full pl-10 pr-10 py-3.5 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer appearance-none hover:bg-slate-50 transition-all shadow-sm h-[48px]"
                        >
                            {['All', 'Indoor', 'Outdoor', 'Balcony'].map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none rotate-90" size={14} />
                    </div>
                </div>
                <div className="relative w-full lg:w-80 group px-2">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-admin-primary transition-colors" size={18} />
                    <input 
                        type="text"
                        placeholder="Search number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-admin-primary/20 outline-none transition-all placeholder:text-slate-300 h-[48px]"
                    />
                </div>
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <AnimatePresence mode='popLayout'>
                    {filteredTables.map((table) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={table.id}
                            className="group bg-white rounded-[3.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all relative overflow-hidden"
                        >
                            {/* Card Decorative Elements */}
                            <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity ${
                                table.status === 'Available' ? 'bg-emerald-500' : 
                                table.status === 'Occupied' ? 'bg-rose-500' : 'bg-amber-500'
                            }`} />

                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner transform group-hover:rotate-12 transition-transform duration-500 ${
                                    table.status === 'Occupied' ? 'bg-rose-50 text-rose-500' : 
                                    table.status === 'Reserved' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'
                                }`}>
                                    <Grid2X2 size={28} />
                                </div>
                                <div className="flex gap-1 transition-opacity duration-300">
                                    <button 
                                        onClick={() => handleOpenModal(table)}
                                        className="p-3 text-slate-400 hover:text-admin-primary hover:bg-admin-primary/5 rounded-xl transition-all"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(table)}
                                        className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{table.number}</h3>
                                        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${getStatusColor(table.status)}`}>
                                            {table.status}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                        <span className="flex items-center gap-1"><Users size={12}/> {table.capacity}</span>
                                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                        <span className="flex items-center gap-1"><MapPin size={12}/> {table.location}</span>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-50">
                                    {table.status === 'Occupied' ? (
                                        <div className="p-5 bg-rose-50/50 rounded-3xl border border-rose-100/30 mb-5 group/order cursor-pointer hover:bg-rose-50 transition-colors">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em]">Active Order</p>
                                                <ArrowRight size={12} className="text-rose-300 group-hover/order:translate-x-1 transition-transform" />
                                            </div>
                                            <span className="text-sm font-black text-rose-600">Occupied</span>
                                        </div>
                                    ) : table.status === 'Reserved' ? (
                                        <div className="p-5 bg-amber-50/50 rounded-3xl border border-amber-100/30 mb-5">
                                            <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-1">Reservation</p>
                                            <div className="flex items-center gap-2 text-amber-600 font-black text-sm">
                                                <Clock size={14} /> 7:30 PM
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-6 text-center group-hover:scale-105 transition-transform duration-500">
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Clean</span>
                                        </div>
                                    )}

                                    <button 
                                        onClick={() => {
                                            if (table.status === 'Available') {
                                                setSelectedTable(table);
                                                setIsAssignModalOpen(true);
                                            }
                                        }}
                                        className={`w-full py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden shadow-sm group/btn ${
                                            table.status === 'Available' 
                                                ? 'bg-slate-900 text-white hover:bg-black hover:shadow-xl hover:shadow-slate-200' 
                                                : 'bg-slate-50 text-slate-400 border border-slate-100'
                                        }`}
                                    >
                                        <span className="relative z-10">
                                            {table.status === 'Available' ? 'Assign' : 
                                             table.waiter ? `${table.waiter.name.split(' ')[0]}` : 'Manage'}
                                        </span>
                                        {table.status === 'Available' && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredTables.length === 0 && (
                <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                    <Grid2X2 size={48} className="mx-auto text-slate-200 mb-4" />
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">No tables found</h3>
                </div>
            )}

            {/* Assignment Modal */}
            <AnimatePresence>
                {isAssignModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAssignModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-[3rem] overflow-hidden shadow-2xl"
                        >
                            <div className="p-10">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Assign Table</h2>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Select staff</p>
                                    </div>
                                    <button onClick={() => setIsAssignModalOpen(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {staff.map(waiter => (
                                        <button
                                            key={waiter.id}
                                            onClick={() => handleAssignWaiter(waiter.id)}
                                            className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-admin-primary hover:bg-admin-primary/5 transition-all text-left group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold group-hover:bg-admin-primary group-hover:text-white transition-colors">
                                                    {waiter.name[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900">{waiter.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{waiter.email}</p>
                                                </div>
                                            </div>
                                            <ChevronRight size={18} className="text-slate-300 group-hover:text-admin-primary transform group-hover:translate-x-1 transition-all" />
                                        </button>
                                    ))}
                                    {staff.length === 0 && (
                                        <p className="text-center text-slate-400 py-4 italic">None available</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[3rem] overflow-hidden shadow-2xl"
                        >
                            <div className="p-10">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                            {editingTable ? 'Edit Table' : 'New Table'}
                                        </h2>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Setup</p>
                                    </div>
                                    <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Table Number</label>
                                            <input 
                                                required
                                                type="text"
                                                value={formData.number}
                                                onChange={(e) => setFormData({...formData, number: e.target.value})}
                                                placeholder="e.g. 10"
                                                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-admin-primary/20 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Seats</label>
                                            <input 
                                                required
                                                type="number"
                                                min="1"
                                                value={formData.capacity}
                                                onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                                                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-admin-primary/20 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['Indoor', 'Outdoor', 'Balcony'].map(loc => (
                                                <button
                                                    key={loc}
                                                    type="button"
                                                    onClick={() => setFormData({...formData, location: loc})}
                                                    className={`py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                        formData.location === loc 
                                                            ? 'bg-slate-900 text-white shadow-lg' 
                                                            : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    {loc}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                                        <select 
                                            value={formData.status}
                                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-admin-primary/20 outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="Available">Available</option>
                                            <option value="Occupied">Occupied</option>
                                            <option value="Reserved">Reserved</option>
                                        </select>
                                    </div>

                                    <button 
                                        type="submit"
                                        className="w-full py-5 bg-slate-900 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-admin-primary transition-all shadow-xl shadow-slate-200 mt-4"
                                    >
                                        {editingTable ? 'Save' : 'Create'}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setTableToDelete(null); }}
                onConfirm={confirmDelete}
                title="Delete Table"
                message="Are you sure you want to delete this table? This will remove it from all layouts."
                itemName={tableToDelete ? `Table ${tableToDelete.number} (${tableToDelete.location})` : ''}
            />
        </div>
    );
};

export default AdminTablesPage;
