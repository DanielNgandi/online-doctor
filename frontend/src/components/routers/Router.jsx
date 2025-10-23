import {Routes,Route} from 'react-router-dom'
//import { useAuth } from '../context/AuthContext';
import Home from '../pages/Home'
import Services from '../pages/Services'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import AdminAddDoctor from '../pages/Admin/AdminAddDoctor'
import Contact from '../pages/Contact'
import Doctors from '../pages/Doctors/Doctors'
import DoctorDetail from '../pages/Doctors/DoctorsDetail'
import PatientProfileSetup from '../pages/patients/PatientProfileSetup'
import DoctorProfile from '../pages/Doctors/DoctorProfile';
import BookAppointment from "../pages/appointment/appointment";
import DoctorAppointments from '../pages/Doctors/DoctorAppointments';
import PatientAppointments from '../pages/patients/PatientAppointments';
import AdminRoute from './AdminRoute'
function Router() {
  return <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/home' element={<Home/>}/>
    <Route path='/doctors' element={<Doctors/>}/>
    <Route path='/doctors/:id' element={<DoctorDetail/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/register' element={<Signup/>}/>
    <Route path='/services' element={<Services/>}/>
    <Route path='/contacts' element={<Contact/>}/>
    <Route path="/add-doctor"element={<AdminRoute><AdminAddDoctor /></AdminRoute> }/> 
    <Route path="/book-appointment" element={<BookAppointment />} />
    <Route path="/doctor-profile" element={<DoctorProfile />} />
    <Route path="/doctor/my-appointments" element={<DoctorAppointments />} />
    <Route path="/patient/my-appointments" element={<PatientAppointments />} /> 
    <Route path="/patient-profile" element={<PatientProfileSetup />} />
    </Routes>}
 

export default Router