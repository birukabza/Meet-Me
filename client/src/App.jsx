import createRouter from './routes/Routes'
import { RouterProvider } from 'react-router-dom'


function App() {
  const router = createRouter();
  return (
    <div className='flex'>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
