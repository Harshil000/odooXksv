import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { router } from './app/app.route.jsx'
import { ToastContainer } from 'react-toastify'
import './app/index.scss'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
    <ToastContainer position='top-right' autoClose={3000} theme='dark'/>
  </StrictMode>,
)
