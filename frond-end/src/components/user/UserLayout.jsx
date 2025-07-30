import { Outlet } from 'react-router-dom';
import UserNavbar from './UserNavbar';
import Footer from '../common/Footer';

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <UserNavbar />
     <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-4 z-10 mt-16">
  <Outlet />
</main>
      <Footer />
    </div>
  );
};

export default UserLayout;