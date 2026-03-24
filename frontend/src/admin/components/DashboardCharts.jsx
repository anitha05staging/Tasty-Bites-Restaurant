import React from 'react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend
} from 'recharts';

const DashboardCharts = ({ orders = [] }) => {
    // Process data for Revenue Chart (Last 7 Days)
    const getRevenueData = () => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        return last7Days.map(date => {
            const dayOrders = orders.filter(o => {
                const orderDateStr = o.createdAt || o.date;
                if (!orderDateStr) return false;
                const d = typeof orderDateStr === 'string' ? orderDateStr : new Date(orderDateStr).toISOString();
                return d.startsWith(date);
            });
            
            const total = dayOrders.reduce((sum, o) => {
                const amount = typeof o.total === 'string' 
                    ? parseFloat(o.total.replace(/[^0-9.]/g, '')) 
                    : (parseFloat(o.total) || 0);
                return sum + amount;
            }, 0);
            
            const displayDate = new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
            return { name: displayDate, revenue: total };
        });
    };

    // Process data for Order Type Distribution
    const getOrderStats = () => {
        const stats = {
            'Dine-In': 0,
            'Takeaway': 0
        };
        
        orders.forEach(o => {
            const rawType = o.orderType || o.type || '';
            const type = rawType.trim();
            
            // Normalize mapping
            if (type === 'Dine-In' || type === 'Dine-in') {
                stats['Dine-In']++;
            } else if (type === 'Collection' || type === 'Takeaway' || type === 'Take-Away') {
                stats['Takeaway']++;
            }
        });
        
        return Object.keys(stats).map(name => ({ name, value: stats[name] }));
    };

    const revenueData = getRevenueData();
    const orderStats = getOrderStats();

    const COLORS = ['#0f172a', '#334155', '#64748b', '#94a3b8'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
            {/* Revenue Trend */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Revenue Overview</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Weekly performance trend</p>
                    </div>
                    <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                        +12.5% vs Last Week
                    </div>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} 
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }}
                                tickFormatter={(value) => `£${value}`}
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    borderRadius: '16px', 
                                    border: 'none', 
                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }} 
                            />
                            <Area 
                                type="monotone" 
                                dataKey="revenue" 
                                stroke="#0f172a" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorRevenue)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Order Distribution */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Order Channels</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Dine-in vs takeaway breakdown</p>
                </div>
                <div className="h-[300px] w-full flex flex-col md:flex-row items-center justify-center">
                    <div className="w-full h-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={orderStats}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {orderStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '16px', 
                                        border: 'none', 
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                    }}
                                />
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={36}
                                    formatter={(value) => <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardCharts;
