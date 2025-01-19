import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import Result from './pages/Result.tsx'
import { NavBar } from './components/NavBar.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/result/:userId" element={<><NavBar /><Result /></>} />
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
