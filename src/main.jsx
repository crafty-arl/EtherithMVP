import React from 'react'
import ReactDOM from 'react-dom/client'
import { CrossmintProviders } from './providers/CrossmintProviders.jsx'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CrossmintProviders>
      <App />
    </CrossmintProviders>
  </React.StrictMode>,
)