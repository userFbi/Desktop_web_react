import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import HabitEngine from './Pages/Habits/Habits';
import NotesPage from './Pages/Notes/Notes';
import TacticalPlanner from './Pages/Planner/Planner';
import KeyVault from './Pages/Vault/Vault';
import Dashboard from './Dashoboard';
import DayFlow from './Pages/DayFlow/DayFlow';
import Expenses from './Pages/Expenses/Expenses';

function App() {
  return (
    <>
      <Router> {/* This MUST be the parent of any component using <Link> */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dayflow" element={<DayFlow />} />
          <Route path="/keyVault" element={<KeyVault />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/planner" element={<TacticalPlanner />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/habits" element={<HabitEngine />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
