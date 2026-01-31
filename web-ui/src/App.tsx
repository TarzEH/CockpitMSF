import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import Sessions from './components/Sessions/Sessions';
import Modules from './components/Modules/Modules';
import Console from './components/Console/Console';
import Hosts from './components/Hosts/Hosts';
import Credentials from './components/Credentials/Credentials';
import Loot from './components/Loot/Loot';
import Jobs from './components/Jobs/Jobs';
import Login from './components/Auth/Login';
import { authService } from './api/auth';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  // Allow access without authentication (like CLI)
  // If auth is required, API calls will fail and show errors
  return <>{children}</>;
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="modules" element={<Modules />} />
            <Route path="console" element={<Console />} />
            <Route path="hosts" element={<Hosts />} />
            <Route path="credentials" element={<Credentials />} />
            <Route path="loot" element={<Loot />} />
            <Route path="jobs" element={<Jobs />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
