import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './App.css';
import HabitEngine from './Pages/Habits/Habits';
import NotesPage from './Pages/Notes/Notes';
import TacticalPlanner from './Pages/Planner/Planner';
import KeyVault from './Pages/Vault/Vault';
import Dashboard from './Dashoboard';
import DayFlow from './Pages/DayFlow/DayFlow';
import Expenses from './Pages/Expenses/Expenses';
import AuthPage from './Pages/Auth/AuthPage'; // Your new Login/Signup component

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('focusToken'));

  // Sync state if localStorage changes (optional but good for multi-tab)
  useEffect(() => {
    const token = localStorage.getItem('focusToken');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <Routes>
        {/* --- PUBLIC ROUTE --- */}
        <Route
          path="/login"
          element={!isAuthenticated ? <AuthPage onLogin={() => setIsAuthenticated(true)} /> : <Navigate to="/" />}
        />

        {/* --- PROTECTED ROUTES --- */}
        {/* If not authenticated, every path below will bounce the user to /login */}
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/dayflow" element={isAuthenticated ? <DayFlow /> : <Navigate to="/login" />} />
        <Route path="/keyVault" element={isAuthenticated ? <KeyVault /> : <Navigate to="/login" />} />
        <Route path="/expenses" element={isAuthenticated ? <Expenses /> : <Navigate to="/login" />} />
        <Route path="/planner" element={isAuthenticated ? <TacticalPlanner /> : <Navigate to="/login" />} />
        <Route path="/notes" element={isAuthenticated ? <NotesPage /> : <Navigate to="/login" />} />
        <Route path="/habits" element={isAuthenticated ? <HabitEngine /> : <Navigate to="/login" />} />

        {/* Fallback for any undefined routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;