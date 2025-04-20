import { Route, Routes, Navigate } from 'react-router-dom';
import Login from '../components/login/login';
import AdminDashboard from '../components/home/AdminDashboard';
import Welcome from '../components/home/Welcome';
import Summary from '../components/home/componentsHome/summary/Summary';
import Cancellations from '../components/home/componentsHome/cancellations/Cancellations';
import Electives from '../components/home/componentsHome/electives/Electives';
import Reports from '../components/home/componentsHome/reports/Reports';
import FormNewCancellation from '../components/cancellations/newCancellation/NewCancellation';
import PendingRequests from '../components/cancellations/pendingRequests/PendingRequests';

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminDashboard />}>
        <Route path="home" element={<Welcome />} > 
          <Route path="summary" element={<Summary />} />
          <Route path="cancellations" element={<Cancellations />} />
          <Route path="electives" element={<Electives />} />
          <Route path="reports" element={<Reports />} />
        </Route>
        <Route path="cancellations" element={<Cancellations />}>
          <Route path='newCancellation' element={<FormNewCancellation />} />
          <Route path='pendingRequests' element={<PendingRequests />} />
        </Route>
        <Route path="electives" element={<Electives />} />
        <Route path="reports" element={<Reports />} />
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

