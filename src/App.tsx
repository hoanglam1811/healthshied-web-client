import { useState } from 'react'
import './App.css'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from './components/ui/toaster';
import store from './store/store'
import router from './router'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Provider store={store}>
        <RouterProvider router={router} />
        <Toaster />
      </Provider>
    </>
  )
}

export default App
