import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <nav style={{ width: '200px', background: '#f0f0f0', padding: '20px' }}>
        <h2>Admin Panel</h2>
        <div style={{ marginBottom: '20px' }}>
          <strong>{user?.name}</strong>
          <br />
          <small>{user?.email}</small>
        </div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/users">Manage Users</Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/drivers">Manage Drivers</Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/buses">Manage Buses</Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/routes">Manage Routes</Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/stops">Manage Stops</Link>
          </li>
        </ul>
        <button onClick={logout} style={{ marginTop: '20px', padding: '8px 15px' }}>
          Logout
        </button>
      </nav>
      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
