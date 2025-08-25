import { RouterProvider } from 'react-router'
import { routes } from './router/routes'

function App() {


  return (
    <div className='flex min-h-full'>
      <RouterProvider router={routes}/>
    </div>
 
  )
}

export default App
