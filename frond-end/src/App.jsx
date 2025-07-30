
import './App.css'
import useAuth from './hooks/useAuth';
import {getAuth } from './services/authApi'
import { useEffect } from "react";
import AdminLayout from './components/admin/AdminLayout';
import UserLayout from './components/user/UserLayout';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PackagesListPage from './pages/TourPackageList';
import TourPackageDetails from './pages/PackageDetails';
import ThankYouPage from './pages/ThankYou';
import AdminDashboard from './pages/AdminDashboard';
import CountriesManagement from './pages/CountriesManagementPage';
import CitiesManagement from './pages/CitiesManagement';
import TourPackagesManagement from './pages/PackagesManagement';
import PackageSchedulesManagement from './pages/SheduleManagement';
import EnquiriesManagement from './pages/EnquiresManagement';
import AdminAuthPage from './pages/AdminAuthPage';
import BannerManagement from './pages/BannerManagement';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

function App() {
    const { login } = useAuth();
     useEffect(() => {
  const fetchAdmin = async () => {
    const data = await getAuth(); 
    
console.log('admin auth',data)
    if (data) {
      login(data);
    }
  };

  fetchAdmin();
}, []);


  return (
    <>

      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<HomePage />} />
             <Route path="packages" element={<PackagesListPage />} />
             <Route path="package/:id" element={<TourPackageDetails />} />
             <Route path="thankyou" element={<ThankYouPage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="auth" element={<AdminAuthPage />} />
         
          <Route path='dashboard' element={<AdminDashboard/>} />
          
          <Route path="countries" element={< CountriesManagement/>} />
            <Route path="cities" element={< CitiesManagement/>} />
              <Route path="packages" element={< TourPackagesManagement/>} />
         <Route path="schedules" element={< PackageSchedulesManagement/>} />
         <Route path="enquiries" element={< EnquiriesManagement/>} />
           <Route path="banners" element={< BannerManagement/>} />
        </Route>
      </Routes>
    <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;