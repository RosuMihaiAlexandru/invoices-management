import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Invoices } from './pages/Invoices';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/invoices" element={<ProtectedRoute />}>
          <Route path="/invoices" element={<Invoices />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
