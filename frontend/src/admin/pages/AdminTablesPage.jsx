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
    ArrowRight
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';

const AdminTablesPage = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    
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
            const data = await api.getStaff();
            setStaff(data.filter(s => s.role === 'waiter'));
        } catch (error) {
            console.error("Failed to load staff", error);
        }
    };

    const fetchTables = async () => {
        try {
            setLoading(true);
            const data = await api.getTables();
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
                status: 'Available'
            });
        }
        setIsModalOpen(true);
    };

    const handleAssignWaiter = async (waiterId) => {
        try {
            await api.updateTable(selectedTable.id, { 
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

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this table?")) return;
        try {
            await api.deleteTable(id);
            toast.success("Table deleted successfully");
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
        const matchesSearch = t.number.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
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
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Table Management</h1>
                    <p className="text-sm font-medium text-slate-500 mt-2 uppercase tracking-widest flex items-center gap-2">
                        <MapPin size={14} className="text-admin-primary" /> Dine-in Floor View & Assignment
                    </p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-admin-primary transition-all shadow-2xl shadow-slate-200 overflow-hidden"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" /> 
                    <span>Add New Table</span>
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
            </div>

            {/* Controls */}
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-white/50 backdrop-blur-md p-2 rounded-[2.5rem] border border-slate-100/50">
                <div className="flex gap-2 overflow-x-auto p-1 w-full lg:w-auto no-scrollbar">
                    {['All', 'Available', 'Occupied', 'Reserved'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 py-3 rounded-2xl text-xs font-black tracking-widest uppercase transition-all whitespace-nowrap ${
                                filter === f 
                                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                                    : 'bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div className="relative w-full lg:w-96 group px-2">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-admin-primary transition-colors" size={18} />
                    <input 
                        type="text"
                        placeholder="Search table number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-[1.5rem] text-sm font-bold focus:ring-2 focus:ring-admin-primary/20 outline-none transition-all placeholder:text-slate-300"
                    />
                </div>
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <AnimatePresence mode='popLayout'>
                    {filteredTables.map((table) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={table.id}
                            className="group bg-white rounded-[3rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all relative overflow-hidden"
                        >
                            {/* Card Status Indicator Line */}
                            <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                                table.status === 'Available' ? 'bg-emerald-400' : 
                                table.status === 'Occupied' ? 'bg-rose-400' : 'bg-amber-400'
                            }`} />

                            <div className="flex justify-between items-start mb-8">
                                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-500 ${
                                    table.status === 'Occupied' ? 'bg-rose-50 text-rose-500 shadow-rose-100' : 
                                    table.status === 'Reserved' ? 'bg-amber-50 text-amber-500 shadow-amber-100' : 'bg-emerald-50 text-emerald-500 shadow-emerald-100'
                                }`}>
                                    <Grid2X2 size={28} />
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button 
                                        onClick={() => handleOpenModal(table)}
                                        className="p-2.5 text-slate-400 hover:text-admin-primary hover:bg-admin-primary/5 rounded-xl transition-all"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(table.id)}
                                        className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Table {table.number}</h3>
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(table.status)}`}>
                                            {table.status}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-400 font-bold text-xs uppercase tracking-tighter">
                                        <div className="flex items-center gap-1.5">
                                            <Users size={14} className="text-slate-300" /> {table.capacity} Seats
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={14} className="text-slate-300" /> {table.location}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-50">
                                    {table.status === 'Occupied' ? (
                                        <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100/50 mb-4">
                                            <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Active Order</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-black text-rose-600">#{table.currentOrderId || 'ORD-NEW'}</span>
                                                <ArrowRight size={14} className="text-rose-400" />
                                            </div>
                                        </div>
                                    ) : table.status === 'Reserved' ? (
                                        <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50 mb-4">
                                            <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Upcoming Reservation</p>
                                            <div className="flex items-center gap-2 text-amber-600 font-black text-sm">
                                                <Clock size={16} /> 7:30 PM
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-4 text-center">
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Ready for guests</span>
                                        </div>
                                    )}

                                    <button 
                                        onClick={() => {
                                            if (table.status === 'Available') {
                                                setSelectedTable(table);
                                                setIsAssignModalOpen(true);
                                            }
                                        }}
                                        className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all overflow-hidden relative group/btn ${
                                            table.status === 'Available' 
                                                ? 'bg-slate-900 text-white hover:bg-black shadow-xl shadow-slate-200' 
                                                : 'bg-white border border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600'
                                        }`}
                                    >
                                        <span className="relative z-10">
                                            {table.status === 'Available' ? 'Assign Table' : 
                                             table.waiter ? `Served by ${table.waiter.name.split(' ')[0]}` : 'Manage Table'}
                                        </span>
                                        {table.status === 'Available' && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
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
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Assign Table {selectedTable?.number}</h2>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Select a waiter for this table</p>
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
                                        <p className="text-center text-slate-400 py-4 italic">No waiters available</p>
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
                                            {editingTable ? 'Edit Table' : 'Add New Table'}
                                        </h2>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Configure floor arrangement</p>
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
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Seating Capacity</label>
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
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Initial Status</label>
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
                                        {editingTable ? 'Save Changes' : 'Create Table'}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminTablesPage;
