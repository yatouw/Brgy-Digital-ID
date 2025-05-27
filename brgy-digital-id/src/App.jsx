import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-center space-x-4 mb-8">
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="h-16 w-16 hover:scale-110 transition-transform" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="h-16 w-16 hover:scale-110 transition-transform animate-spin" alt="React logo" />
          </a>
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Vite + React</h1>
        
        <div className="text-center mb-6">
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg transform hover:scale-105"
          >
            count is {count}
          </button>
          <p className="mt-4 text-gray-600">
            Edit <code className="bg-gray-100 px-2 py-1 rounded text-sm">src/App.jsx</code> and save to test HMR
          </p>
        </div>
        
        <p className="text-center text-sm text-gray-500">
          Click on the Vite and React logos to learn more
        </p>
        
        {/* Tailwind CSS Test Section */}
        <div className="mt-8 p-4 bg-green-100 border-l-4 border-green-500 rounded">
          <h2 className="text-lg font-semibold text-green-800 mb-2">🎉 Tailwind CSS 4 is Working!</h2>
          <p className="text-green-700 text-sm">
            This styled section confirms that Tailwind CSS is properly configured and working in your project.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
