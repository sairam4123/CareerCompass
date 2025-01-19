import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import Result from './pages/Result.tsx'
import { NavBar } from './components/NavBar.tsx'
import About from './pages/About.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/result/:userId" element={<><NavBar /><Result /></>} />
      <Route path="/about" element={<><NavBar /><About /></>} />
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
