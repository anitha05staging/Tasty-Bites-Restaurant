import React, { useState, useEffect } from 'react';
import { 
    ShoppingBag, 
    Calendar, 
    Clock, 
    ArrowRight,
    Search,
    Plus,
    CheckCircle2,
    AlertCircle,
    Star,
    RefreshCw,
    Printer
} from 'lucide-react';
import { adminOrdersApi, adminReservationsApi } from '../services/adminApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const OperationWidget = ({ title, value, status, icon: Icon, colorClass }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10`}>
                <Icon className={colorClass.replace('bg-', 'text-')} size={24} />
            </div>
            {status && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-600 transition-colors">
                    {status}
                </span>
            )}
        </div>
        <div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{title}</p>
        </div>
    </div>
);

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [ordersData, bookingsData] = await Promise.all([
                adminOrdersApi.getAll(),
                adminReservationsApi.getAll()
            ]);
            setOrders(Array.isArray(ordersData) ? ordersData : []);
            setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        } catch (error) {
            console.error('Dashboard load failed:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const isSameDay = (date1, date2) => {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return d1.getFullYear() === d2.getFullYear() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getDate() === d2.getDate();
    };

    const today = new Date();
    const todayOrders = orders.filter(o => isSameDay(o.createdAt || o.date, today));
    const pendingOrders = orders.filter(o => ['Pending', 'Confirmed', 'In Progress', 'Ready', 'Placed'].includes(o.status));
    const todayBookings = bookings.filter(b => isSameDay(b.date, today));

    return (
        <div className="max-w-7xl mx-auto space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Overview</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-widest">Daily Operations Console</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={fetchData}
                        className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm group"
                        title="Refresh Data"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
                    </button>
                    <button 
                        onClick={() => navigate('/admin/menu')}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-900/20"
                    >
                        <Plus size={16} strokeWidth={3} />
                        New Menu Item
                    </button>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <OperationWidget 
                    title="Orders Today" 
                    value={todayOrders.length} 
                    status="Live"
                    icon={ShoppingBag} 
                    colorClass="bg-emerald-500"
                />
                <OperationWidget 
                    title="Pending Orders" 
                    value={pendingOrders.length} 
                    status="Action Required"
                    icon={AlertCircle} 
                    colorClass="bg-amber-500"
                />
                <OperationWidget 
                    title="Today's Bookings" 
                    value={todayBookings.length} 
                    status="Fully Booked"
                    icon={Calendar} 
                    colorClass="bg-blue-500"
                />
                <OperationWidget 
                    title="Customer Reviews" 
                    value="12" 
                    status="4.8 Avg"
                    icon={Star} 
                    colorClass="bg-purple-500"
                />
            </div>

            {/* Quick Overview Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Recent Orders Table */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>
                        <button 
                            onClick={() => navigate('/admin/orders')}
                            className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-widest hover:translate-x-1 transition-transform"
                        >
                            View All Orders <ArrowRight size={14} />
                        </button>
                    </div>
                    
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order ID</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {orders.slice(0, 6).map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-bold text-slate-900 leading-none">#{order.orderId}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-slate-900">{order.customerName}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{order.orderType}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-black text-slate-900 tracking-tight">£{Number(String(order.total || 0).replace(/[^0-9.]/g, '')).toFixed(2)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`
                                                    px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
                                                    ${order.status === 'Completed' || order.status === 'Delivered' 
                                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                                        : 'bg-amber-50 text-amber-600 border-amber-100'}
                                                `}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200">
                                                    <ArrowRight size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {orders.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-20 text-center text-slate-400 uppercase tracking-widest font-bold text-xs">
                                                No incoming orders yet
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Status Column */}
                <div className="space-y-10">
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-900">Today's Bookings</h2>
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                            {bookings.slice(0, 3).map((booking) => (
                                <div key={booking.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-50 hover:border-slate-200 transition-all group">
                                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-admin-primary/10 group-hover:text-admin-primary transition-colors">
                                        <Clock size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-900 leading-none">{booking.fullName}</p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{booking.time}</span>
                                            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{booking.guests} Guests</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {bookings.length === 0 && (
                                <div className="py-10 text-center text-slate-400 uppercase tracking-widest font-bold text-[10px]">
                                    No bookings today
                                </div>
                            )}
                            <button 
                                onClick={() => navigate('/admin/bookings')}
                                className="w-full py-4 bg-slate-900 text-white hover:bg-black rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all mt-2 shadow-lg shadow-slate-900/10"
                            >
                                Manage Reservations
                            </button>
                        </div>
                    </div>

            {/* Dashboard Footer (Optional/Empty now) */}
            <div className="pt-10 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Tasty Bites Admin System • v2.1.0</p>
            </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
