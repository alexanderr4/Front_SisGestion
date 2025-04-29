import { Route, Routes, Navigate } from 'react-router-dom';
import Login from '../components/login/login';
import AdminDashboard from '../components/home/AdminDashboard';
import ControlPanel from '../components/home/ControlPanel';
import Summary from '../components/home/componentsHome/summary/Summary';
import Cancellations from '../components/home/componentsHome/cancellations/Cancellations';
import Electives from '../components/home/componentsHome/electives/Electives';
import Reports from '../components/home/componentsHome/reports/Reports';
import FormNewCancellation from '../components/cancellations/newCancellation/NewCancellation';
import PendingRequests from '../components/cancellations/pendingRequests/PendingRequests';
import GenerateReport from '../components/reports/generateReport/GenerateReport';
import SubjectManagement from '../components/subjects/SubjecManagement';
import Settings from '../components/settings/Settings';

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminDashboard />}>
        <Route path="home" element={<ControlPanel />} >
          <Route path="summary" element={<Summary />} />
        </Route>
        <Route path="cancellations" element={<ControlPanel />}>
          <Route path="cancellationManagement" element={<Cancellations />} >
            <Route path='newCancellation' element={<FormNewCancellation />} />
            <Route path='pendingRequests' element={<PendingRequests />} />
          </Route>
        </Route>
        <Route path="electives" element={<ControlPanel />} >
          <Route path="electiveManagement" element={<Electives />} />
        </Route>
        <Route path="reports" element={<ControlPanel />} >
          <Route path="reportsAndStatistics" element={<Reports />} >
            <Route path="generateReport" element={<GenerateReport />} />  
          </Route>
        </Route>

        <Route path="subjectManagement" element={<SubjectManagement />} />
        <Route path="settings" element={<Settings />} />
      </Route>


      {localStorage.getItem('authToken')?  
        <Route index element={<Navigate to="admin/home/summary" />}/>:
        <Route index element={<Navigate to="/login" />} /> 
      } 
      {/* <Route index element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/admin/home" />} /> */}
      {/* <Route path="*" element={<h2>404 Not Found</h2>} /> */}

    </Routes>
  );
}


export default AppRouter;

