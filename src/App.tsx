import { useState } from 'react'
import { HashRouter, Routes, Route } from "react-router-dom";

import './assets/css/main.css'

import Index from "./pages/index"

function App() {

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Index />} />
      </Routes>
  </HashRouter>
  )
}

export default App
