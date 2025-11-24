import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ManageUsers from './pages/ManageUsers';
import ManageDrivers from './pages/ManageDrivers';
import ManageBuses from './pages/ManageBuses';
import ManageRoutes from './pages/ManageRoutes';
import ManageStops from './pages/ManageStops';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="drivers" element={<ManageDrivers />} />
            <Route path="buses" element={<ManageBuses />} />
            <Route path="routes" element={<ManageRoutes />} />
            <Route path="stops" element={<ManageStops />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
