import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, Image as ImageIcon, PlusCircle, Users, Menu, X, Baby } from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Dashboard from './components/Dashboard';
import PhotoList from './components/PhotoList';
import UploadPhoto from './components/PhotoForm'; // Renamed import conceptually
import './App.css';

const Sidebar = ({ isOpen, toggle }) => (
  <>
    {isOpen && <div className="sidebar-overlay" onClick={() => toggle(false)}></div>}

    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="brand">
        <div style={{ background: '#ffedd5', padding: 8, borderRadius: 8 }}>
          <Baby size={24} color="#f97316" />
        </div>
        <span>BabyPrompt</span>
      </div>

      <nav>
        <div className="nav-label">Main</div>
        <NavLink to="/" onClick={() => toggle(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <div className="nav-label" style={{ marginTop: 20 }}>Gallery</div>
        <NavLink to="/photos" end onClick={() => toggle(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <ImageIcon size={20} />
          <span>All Photos</span>
        </NavLink>
        <NavLink to="/photos/boy" onClick={() => toggle(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Users size={20} />
          <span>Boy</span>
        </NavLink>
        <NavLink to="/photos/girl" onClick={() => toggle(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Users size={20} />
          <span>Girl</span>
        </NavLink>

        <div className="nav-label" style={{ marginTop: 20 }}>Action</div>
        <NavLink to="/photos/add" onClick={() => toggle(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <PlusCircle size={20} />
          <span>Upload Photo</span>
        </NavLink>
      </nav>
    </aside>
  </>
);

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="layout-wrapper">
        <Sidebar isOpen={isSidebarOpen} toggle={setSidebarOpen} />

        <main className="main-content">
          {/* Mobile Header (Only visible on small screens due to CSS) */}
          <div className="mobile-header" style={{ display: 'none' }}>
            <div className="brand" style={{ marginBottom: 0 }}>BabyPrompt</div>
            <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <Menu size={24} color="#374151" />
            </button>
          </div>

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/photos" element={<PhotoList type="all" />} />
            <Route path="/photos/boy" element={<PhotoList type="boy" />} />
            <Route path="/photos/girl" element={<PhotoList type="girl" />} />
            <Route path="/photos/add" element={<UploadPhoto />} />
            <Route path="/photos/edit/:id" element={<UploadPhoto />} />
          </Routes>
        </main>

        <ToastContainer position="bottom-right" theme="light" />
      </div>
    </Router>
  );
}

export default App;
