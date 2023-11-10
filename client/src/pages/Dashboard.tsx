import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import Queue from '../components/dashboard/Queue';
import UserActions from '../components/dashboard/UserActions';

const Dashboard = () => {
  return (
    <>
      <Header />
      <div className="md:grid md:grid-cols-3 sm:grid-cols-1">
        <div className="md:col-span-2">
          <Queue />
        </div>
        <UserActions />
      </div>
      <Footer />
    </>
  );
};
export default Dashboard;
