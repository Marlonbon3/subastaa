import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PayPalScriptProvider
      options={{
        "client-id": "AYb8tKiAn1F-_XCDZoX7VxYTlRrTmWhdwiRkmlQ60QSNe5T9kBReZfxjmQ1oI_YyVOoyAmkeRUAtaR02",
      }}
      >
      <App/>
    </PayPalScriptProvider>
  </React.StrictMode>,
)
