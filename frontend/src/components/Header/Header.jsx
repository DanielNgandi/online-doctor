import { useEffect, useRef, useState} from "react";
import { useAuth } from '../context/AuthContext';
import logo from "../../assets/images/logo.png";
import userImg from "../../assets/images/avatar-icon.png";
import { NavLink, Link } from "react-router-dom";
import { BiMenu } from "react-icons/bi";

const navLinks = [
  {
    path: "/home",
    display: "Home",
  },
  {
    path: "/doctors",
    display: "Find Doctor",
  },
  {
    path: "/services",
    display: "Services",
  },
  {
    path: "/contact",
    display: "Contact",
  },
];

// Dropdown Menu Component for User-specific links
const UserDropdownMenu = ({ user, getAppointmentPath, getProfilePath }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-textColor hover:text-primaryColor text-[16px] leading-7 font-[500] whitespace-nowrap px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <span>My Account</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-[1001] overflow-hidden">
          <div className="py-2">
            {user && (
              <>
                {/* Appointments */}
                <Link 
                  to={getAppointmentPath()}
                  className="block px-4 py-3 text-sm text-textColor hover:bg-primaryColor/5 hover:text-primaryColor transition-colors border-b border-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    My Appointments
                  </div>
                </Link>
                
                {/* Book Appointment - only for patients */}
                {user.role === 'patient' && (
                  <Link 
                    to="/book-appointment"
                    className="block px-4 py-3 text-sm text-textColor hover:bg-primaryColor/5 hover:text-primaryColor transition-colors border-b border-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Book Appointment
                    </div>
                  </Link>
                )}
                
                {/* Testimonials */}
                <Link 
                  to="/testimonials"
                  className="block px-4 py-3 text-sm text-textColor hover:bg-primaryColor/5 hover:text-primaryColor transition-colors border-b border-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    Testimonials
                  </div>
                </Link>
                
                {/* Profile */}
                <Link 
                  to={getProfilePath()}
                  className="block px-4 py-3 text-sm text-textColor hover:bg-primaryColor/5 hover:text-primaryColor transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

function Header() {
  const { user, logout } = useAuth();
  const headerRef = useRef(null);
  const menuRef = useRef(null);

  const getAppointmentPath = () => {
     if (user?.role === "patient") {
      return "/patient/my-appointments";
    } else if (user?.role === "doctor") {
      return "/doctor/my-appointments";
    } else if (user?.role === "admin") {
      return "/admin/appointments";
    }
    return "/appointments";
  };

   const getProfilePath = () => {
    if (user?.role === "patient") {
      return "/patient-profile";
    } else if (user?.role === "doctor") {
      return "/doctor-profile";
    } else if (user?.role === "admin") {
      return "/admin/profile"; 
    }
    return "/profile";
  };

  const handleStickyHeader = () => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add("sticky__header");
      } else {
        headerRef.current.classList.remove("sticky__header");
      }
    });
  };

  useEffect(() => {
    handleStickyHeader();
    return () => window.removeEventListener('scroll', handleStickyHeader);
  }, []);

  const toggleMenu = () => menuRef.current.classList.toggle('show__menu');

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <header className="header flex items-center bg-white shadow-sm" ref={headerRef} style={{ position: 'relative', zIndex: 1000 }}>
      <div className="container">
        <div className="flex items-center justify-between">
          {/* logo */}
          <div>
            <Link to="/home">
              <img src={logo} alt="Logo" className="h-10" />
            </Link>
          </div>

          {/* menu */}
          <div className="navigation flex-1 mx-2 lg:mx-4" ref={menuRef} onClick={toggleMenu}>
            <ul className="menu flex items-center gap-[1rem] lg:gap-[1.5rem] xl:gap-[2.7rem] flex-nowrap overflow-x-auto">
              {/* Always show these navigation links */}
              {navLinks.map((link, index) => (
                <li key={index} className="flex-shrink-0">
                  <NavLink
                    to={link.path}
                    className={(navClass) =>
                      navClass.isActive
                        ? "text-primaryColor text-[16px] leading-7 font-[600] whitespace-nowrap px-3 py-2 rounded-lg bg-primaryColor/10"
                        : "text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor whitespace-nowrap px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    }
                  >
                    {link.display}
                  </NavLink>
                </li>
              ))}
              
              {/* Show dropdown only when user is logged in */}
              {user ? (
                <li className="flex-shrink-0">
                  <UserDropdownMenu 
                    user={user}
                    getAppointmentPath={getAppointmentPath}
                    getProfilePath={getProfilePath}
                  />
                </li>
              ) : null}
            </ul>
          </div>

          {/* nav right */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {/* User Profile with avatar */}
                <Link 
                  to={getProfilePath()}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <figure className="w-[35px] h-[35px] rounded-full cursor-pointer bg-primaryColor flex items-center justify-center border-2 border-white shadow-md">
                    <span className="text-white font-semibold text-sm">
                      {user.username?.charAt(0).toUpperCase()}
                    </span>
                  </figure>
                  <span className="hidden md:block text-textColor text-[16px] font-[500]">
                    {user.username}
                  </span>
                </Link>

                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px] hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              // User is not logged in - show login button
              <div className="flex items-center gap-4">
                <div className="hidden md:block">
                  <Link to="/login">
                    <figure className="w-[35px] h-[35px] rounded-full cursor-pointer border-2 border-gray-300">
                      <img src={userImg} className="w-full rounded-full" alt="User" />
                    </figure>
                  </Link>
                </div>
                <Link to="/login">
                  <button className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px] hover:bg-primaryColor/90 transition-colors">
                    Login
                  </button>
                </Link>
              </div>
            )}
            
            {/* Mobile menu toggle */}
            <span className="md:hidden" onClick={toggleMenu}>
              <BiMenu className="w-6 h-6 cursor-pointer" />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;