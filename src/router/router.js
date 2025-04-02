import { Route, Routes, Navigate } from 'react-router-dom';
import Login from '../components/login/login';
import AdminDashboard from '../components/home/AdminDashboard';
import Welcome from '../components/home/Welcome';


function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminDashboard />}>
        <Route path="home" element={<Welcome />} />
      </Route>
      
      {/* {localStorage.getItem('authToken')?  
        <Route index element={<Navigate to="/admin/welcome" />}/>:
        <Route index element={<Navigate to="/login" />} /> 
      } */}
      <Route index element={<Navigate to="/login" />} /> 
      <Route path="*" element ={<Navigate to="/admin/home" />} />
      {/* <Route path="*" element={<h2>404 Not Found</h2>} /> */}
   
    </Routes>
  );
}


export default AppRouter;

