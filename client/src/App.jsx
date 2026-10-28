import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import About from './pages/About';
import Certificates from './pages/Certificates';
import Contact from './pages/Contact';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Projects from './pages/Projects';
import Skills from './pages/Skills';
import PublicLayout from './components/layout/PublicLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Loader from './components/common/Loader';

const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminAbout = lazy(() => import('./admin/About'));
const AdminCertificates = lazy(() => import('./admin/Certificates'));
const AdminContactInfo = lazy(() => import('./admin/ContactInfo'));
const Dashboard = lazy(() => import('./admin/Dashboard'));
const Login = lazy(() => import('./admin/Login'));
const Messages = lazy(() => import('./admin/Messages'));
const Profile = lazy(() => import('./admin/Profile'));
const AdminProjects = lazy(() => import('./admin/Projects'));
const Settings = lazy(() => import('./admin/Settings'));
const AdminSkills = lazy(() => import('./admin/Skills'));

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="skills" element={<Skills />} />
        <Route path="projects" element={<Projects />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<Loader fullScreen />}>
            <Login />
          </Suspense>
        }
      />
      <Route
        element={
          <Suspense fallback={<Loader fullScreen />}>
            <ProtectedRoute />
          </Suspense>
        }
      >
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="about" element={<AdminAbout />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="certificates" element={<AdminCertificates />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<Profile />} />
          <Route path="contact-info" element={<AdminContactInfo />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
