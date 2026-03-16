import React from 'react'
import ReactDOM from 'react-dom/client'
import AdminApp from './AdminApp'
import { BrowserRouter } from 'react-router-dom'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/admin">
      <AdminApp />
    </BrowserRouter>
  </React.StrictMode>,
)
