import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../api/services/auth.service';

const Header = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <header>
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap items-center justify-between max-w-screen-xl mx-auto">
          <Link to="/" className="flex items-center">
            <img
              src="https://www.waalaxy.com/wp-content/uploads/2021/09/Waalaxy-2.0-App-icon-minimalist.png"
              className="h-6 mr-3 sm:h-9"
              alt="Waalaxy Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Waapi Queue
            </span>
          </Link>
          <div className="flex items-center lg:order-2">
            <button
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
export default Header;
