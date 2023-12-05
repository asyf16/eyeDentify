import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './output.css'
import { NavContextProvider } from './context/NavContext.jsx'
import {BrowserRouter} from "react-router-dom"


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <NavContextProvider>
         <App />
      </NavContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
