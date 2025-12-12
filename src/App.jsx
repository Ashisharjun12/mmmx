import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Chatbot from './components/Chatbot'

function App() {
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Gemini Chatbot edjjdksjyds</h1>
      <div className="card">
        <Chatbot />
      </div>
      <p className="read-the-docs">
        Powered by Google GenAInnmmd
      </p>
    </>
  )
}

export default App
