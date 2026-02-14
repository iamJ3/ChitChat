import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
const [count, setcount] = useState(0);
const [minus, setminus] = useState(100);
  return (
    <>
      <div className="card">
        <button onClick={() => setcount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={() => setminus ((minus) => minus -1)}>
          count is {minus}
        </button>
      </div>
    </>
  )
}

export default App
