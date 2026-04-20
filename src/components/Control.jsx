import React, { useState, useEffect } from 'react';
import URL from '../config.js';

const Control = () => {
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [search, setSearch] = useState("");
    const [view, setView] = useState("users"); 

    const adminEmail = JSON.parse(localStorage.getItem("user"))?.email;

    useEffect(() => {
        fetch(`${URL}/admin/users`)
            .then(res => res.json())
            .then(data => { if (data.success) setUsers(data.users); });

        fetch(`${URL}/admin/logs`)
            .then(res => res.json())
            .then(data => { if (data.success) setLogs(data.logs); });
    }, []);

    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
        const response = await fetch(`${URL}/admin/delete/${userId}`, {
            method: "POST"
        });
        const data = await response.json();
        if (data.success) {
            setUsers(prev => prev.filter(u => u.id !== userId));
        }
    };

    const handleMakeAdmin = async (userId) => {
        if (!window.confirm("Toggle admin status for this user?")) return;
        const response = await fetch(`${URL}/admin/make-admin/${userId}`, {
            method: "POST"
        });
        const data = await response.json();
        if (data.success) {
            setUsers(prev => prev.map(u =>
                u.id === userId ? { ...u, is_admin: data.is_admin } : u
            ));
        }
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(search.toLowerCase()) && u.email !== adminEmail
    );

    const filteredLogs = logs.filter(l =>
        l.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <h2>User Control Panel</h2>

            <div style={{ marginBottom: "1rem" }}>
                <button onClick={() => setView("users")} style={{ marginRight: "0.5rem" }}>
                    Users
                </button>
                <button onClick={() => setView("logs")}>
                    Login Logs
                </button>
            </div>

            <input
                type="text"
                placeholder="Search by email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ marginBottom: "1rem", padding: "0.5rem", width: "300px" }}
            />

            {view === "users" && (
                <table>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Admin</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.email}</td>
                                <td>{user.is_admin ? "Yes" : "No"}</td>
                                <td>
                                    <button onClick={() => handleMakeAdmin(user.id)} style={{ marginRight: "0.5rem" }}>
                                        {user.is_admin ? "Remove Admin" : "Make Admin"}
                                    </button>
                                    <button onClick={() => handleDelete(user.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                            <tr><td colSpan="3">No users found.</td></tr>
                        )}
                    </tbody>
                </table>
            )}

            {view === "logs" && (
                <table>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Login Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map((log, index) => (
                            <tr key={index}>
                                <td>{log.email}</td>
                                <td>{new Date(log.login_time + 'Z').toLocaleString()}</td>
                            </tr>
                        ))}
                        {filteredLogs.length === 0 && (
                            <tr><td colSpan="2">No logs found.</td></tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Control;