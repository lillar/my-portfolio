import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Handle GitHub Pages redirect
const redirect = new URLSearchParams(window.location.search).get('redirect');
if (redirect) {
  window.history.replaceState(null, '', '/my-portfolio' + redirect);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
