import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Layout from './Layout'
import Home from './components/Home/Home'
import Registration from './components/Registration/Registration'
import Announcements from './components/Announcements/Announcements'
import AdminLogin from './components/Admin/Login'
import Dashboard from './components/Admin/Dashboard'
import ProtectedRoute from './components/Admin/ProtectedRoute'
import AdminRegister from './components/Admin/Register'
import DeveloperInfo from "./components/DeveloperInfo/DeveloperInfo";
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route path="" element={<Home />} />
        <Route path="registration" element={<Registration />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="developer-info" element={<DeveloperInfo />} />
      </Route>
      <Route path="/admin">
        <Route path="register" element={<AdminRegister />} />
        <Route path="login" element={<AdminLogin />} />
        <Route 
          path="dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Route>
    </>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
