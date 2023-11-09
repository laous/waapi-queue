import Footer from '../components/Footer';
import Header from '../components/Header';
import Queue from '../components/Queue';
import UserActions from '../components/UserActions';

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
