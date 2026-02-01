import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { TemplateGallery } from './pages/TemplateGallery';
import { Builder } from './pages/Builder';
import { Preview } from './pages/Preview';
import { CustomizationManager } from './pages/CustomizationManager';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import SetupPassword from './pages/SetupPassword';
import UserManagement from './pages/UserManagement';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Layout />}>
        <Route index element={<Login />} />
      </Route>
      <Route path="/register" element={<Layout />}>
        <Route index element={<Register />} />
      </Route>
      <Route path="/setup-password" element={<SetupPassword />} />
      
      {/* Preview can be public for published pages */}
      <Route path="/preview/:pageId" element={<Preview />} />
      
      {/* Protected routes */}
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="templates"
          element={
            <ProtectedRoute>
              <TemplateGallery />
            </ProtectedRoute>
          }
        />
        <Route
          path="builder/:templateId"
          element={
            <ProtectedRoute>
              <Builder />
            </ProtectedRoute>
          }
        />
        <Route
          path="customizations"
          element={
            <ProtectedRoute>
              <CustomizationManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedRoute requiredRoles={['ADMIN', 'SUPER_ADMIN']}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
