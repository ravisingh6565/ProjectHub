import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, RouterProvider, createBrowserRouter} from 'react-router-dom'
import Home from './Pages/Home/Home'
import SignUp from './Pages/SignUp/SignUp'
import LogIn from './Pages/LogIn/LogIn'
import CreateProject from './Pages/CreateProject/CreateProject'
import DashBoard from "./Pages/DashBoard/DashBoard";
import Contact from "./Pages/Contact/Contact";
import About from "./Pages/About/About";
import Profile from './Component/Profile'
import LandingPage from './Pages/LandingPage/LandingPage'
import ProjectDescription from './Pages/ProjectDesciption/ProjectDesciption'

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <LogIn />,
  },
  {
    path: "/add-project",
    element: <CreateProject />,
  },
  {
    path: "/dashboard",
    element: <DashBoard />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/projectDescription/:id",
    element: <ProjectDescription />,
  },
]);

function App() {
  const navigate = useNavigate();
  useEffect(()=>{
    if(!localStorage.getItem('token')){
      console.log('hello world')
      navigate('/');
      // navigate('/login');
    }else{
      // console.log('bye')
      // navigate('/');
    }
  },[])


  return (
    <>
     {/* <Routes>
      
      <Route path='/' element={<LandingPage/>}></Route>
      <Route path='/home' element={<Home/>}></Route>
      <Route path='/signup' element={<SignUp/>}></Route>
      <Route path='/login' element={<LogIn/>}></Route>
      <Route path='/add-project' element={<CreateProject/>}></Route>
      <Route path='/dashboard' element={<DashBoard/>}></Route>
      <Route path='/contact' element= {<Contact/>}></Route>
      <Route path='/about' element={<About/>}></Route>
      <Route path ='/profile' element={<Profile/>}></Route>
      <Route path='/projectDescription/:id' element={<ProjectDesciption/>}></Route>
     </Routes> */}
     <div className="App">
      <RouterProvider router={router}></RouterProvider>
    </div>
   
    </>
  )
}

export default App
