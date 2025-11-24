import React, { useState, useEffect } from 'react';
import api from '../api/api';

interface Driver {
  id: string;
  name: string;
  email: string;
  driverId: string;
}

const ManageDrivers: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    driverId: '',
    password: '',
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await api.get('/users/drivers');
      setDrivers(response.data);
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users/drivers', formData);
      alert('Driver created successfully');
      setFormData({ name: '', email: '', driverId: '', password: '' });
      setShowForm(false);
      fetchDrivers();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create driver');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Manage Drivers</h1>
      <button onClick={() => setShowForm(!showForm)} style={{ marginBottom: '20px', padding: '8px 15px' }}>
        {showForm ? 'Cancel' : 'Create New Driver'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc' }}>
          <h3>Create Driver</h3>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Driver ID:</label>
            <input
              type="text"
              value={formData.driverId}
              onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <button type="submit" style={{ padding: '10px 20px' }}>
            Create Driver
          </button>
        </form>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Driver ID</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{driver.name}</td>
              <td style={{ padding: '10px' }}>{driver.email}</td>
              <td style={{ padding: '10px' }}>{driver.driverId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageDrivers;
