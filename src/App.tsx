import { useState } from 'react'
import './App.css'
import { Provider } from 'react-redux'
import { Provider as ChakraProvider } from "@/components/ui/provider"
import { RouterProvider } from 'react-router-dom'
import { Toaster } from './components/ui/toaster';
import store from './store/store'
import router from './router'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Provider store={store}>
        <ChakraProvider>
          <RouterProvider router={router} />
          <Toaster />
        </ChakraProvider>
      </Provider>
    </>
  )
}

export default App
