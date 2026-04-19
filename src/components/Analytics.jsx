import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];

const Analytics = ({ applications }) => {
    const statusCounts = useMemo(() => {
        const counts = {};
        applications.forEach(app => {
            counts[app.status] = (counts[app.status] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [applications]);

    const companyCounts = useMemo(() => {
        const counts = {};
        applications.forEach(app => {
            counts[app.company] = (counts[app.company] || 0) + 1;
        });
        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    }, [applications]);

    const monthCounts = useMemo(() => {
        const counts = {};
        applications.forEach(app => {
            if (app.applicationDate) {
                const month = app.applicationDate.slice(0, 7); 
                counts[month] = (counts[month] || 0) + 1;
            }
        });
        return Object.entries(counts)
            .sort()
            .map(([name, value]) => ({ name, value }));
    }, [applications]);

    const totalApps = applications.length;
    const interviews = applications.filter(a => a.status?.toLowerCase() === 'interview').length;
    const offers = applications.filter(a => a.status?.toLowerCase() === 'offer').length;
    const rejected = applications.filter(a => a.status?.toLowerCase() === 'rejected').length;
    const responseRate = totalApps > 0 ? Math.round((interviews + offers) / totalApps * 100) : 0;

    if (totalApps === 0) {
        return <div style={{ padding: "2rem" }}>No applications yet to analyze.</div>;
    }

    return (
        <div style={{ padding: "1rem" }}>
            <h2>Analytics</h2>

            {/* Summary Cards */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
                {[
                    { label: "Total Applications", value: totalApps },
                    { label: "Interviews", value: interviews },
                    { label: "Offers", value: offers },
                    { label: "Rejected", value: rejected },
                    { label: "Response Rate", value: `${responseRate}%` },
                ].map(card => (
                    <div key={card.label} style={{
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        padding: "1rem 1.5rem",
                        minWidth: "140px",
                        textAlign: "center"
                    }}>
                        <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{card.value}</div>
                        <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>{card.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                {/* Status Pie Chart */}
                <div>
                    <h3>Applications by Status</h3>
                    <ResponsiveContainer width={300} height={250}>
                        <PieChart>
                            <Pie data={statusCounts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                {statusCounts.map((_, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Companies Bar Chart */}
                <div>
                    <h3>Top 5 Companies Applied To</h3>
                    <ResponsiveContainer width={350} height={250}>
                        <BarChart data={companyCounts}>
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#667eea" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Applications by month */}
                <div>
                    <h3>Applications Over Time (Monthly)</h3>
                    <ResponsiveContainer width={350} height={250}>
                        <BarChart data={monthCounts}>
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#764ba2" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;