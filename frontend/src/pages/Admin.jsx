import React, { useState, useEffect } from 'react';
import './Admin.css';

export default function Admin() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchUsers = async () => {
        try {
            setRefreshing(true);
            const response = await fetch('/api/admin/users');
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data || []);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to fetch users');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRefresh = () => {
        fetchUsers();
    };

    if (loading) {
        return (
            <div className="admin-container">
                <h1>Admin Dashboard</h1>
                <div>Loading user data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-container">
                <h1>Admin Dashboard</h1>
                <div style={{ background: '#fee', color: '#c33', borderRadius: '6px', padding: '15px' }}>
                    ⚠️ Error: {error}
                </div>
                <button className="refresh-btn" onClick={handleRefresh}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <h1>Admin Dashboard</h1>

            <button className="refresh-btn" onClick={handleRefresh} disabled={refreshing}>
                {refreshing ? 'Refreshing...' : '🔄 Refresh'}
            </button>

            {users.length === 0 ? (
                <div>No users to display</div>
            ) : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}