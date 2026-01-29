import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={
            <div className="App">
              <h1>Welcome to Osmium Energy</h1>
              <p>You are logged in!</p>
              <button onClick={() => {
                localStorage.removeItem('token');
                window.location.reload();
              }}>Logout</button>
            </div>
          } />
        </Route>

        {/* Redirect unknown routes to home (which will redirect to login if not auth) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
