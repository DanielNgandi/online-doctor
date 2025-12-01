import { useEffect, useRef} from "react";
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
    <header className="header flex items-center" ref={headerRef}>
      <div className="container">
        <div className="flex items-center justify-between">
          {/* logo */}
          <div>
            <Link to="/home">
              <img src={logo} alt="Logo" />
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
                        ? "text-primaryColor text-[16px] leading-7 font-[600]whitespace-nowrap"
                        : "text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor whitespace-nowrap"
                    }
                  >
                    {link.display}
                  </NavLink>
                </li>
              ))}
              
              {/* Show these only when user is logged in */}
              {user ? (
                <>
                  {/* View Appointments - for both patients and doctors */}
                  <li className="flex-shrink-0">
                    <NavLink
                      to={getAppointmentPath()}
                      className={(navClass) =>
                        navClass.isActive
                          ? "text-primaryColor text-[16px] leading-7 font-[600] whitespace-nowrap"
                          : "text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor whitespace-nowrap"
                      }
                    >
                      Appointments
                    </NavLink>
                  </li>
                  
                  {/* Book Appointment - only for patients */}
                  {user.role === 'patient' && (
                    <li className="flex-shrink-0">
                      <NavLink
                        to="/book-appointment"
                        className={(navClass) =>
                          navClass.isActive
                            ? "text-primaryColor text-[16px] leading-7 font-[600] whitespace-nowrap"
                            : "text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor whitespace-nowrap"
                        }
                      >
                        Book
                      </NavLink>
                    </li>
                  )}
                  <Link to="/testimonials" className="text-textColor hover:text-primary">
  Testimonials
</Link>
                  
                  {/* Profile links */}
                  <li className="flex-shrink-0">
                    <NavLink
                      to={getProfilePath()} 
                      className={(navClass) =>
                        navClass.isActive
                          ? "text-primaryColor text-[16px] leading-7 font-[600] whitespace-nowrap"
                          : "text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor whitespace-nowrap"
                      }
                    >
                      Profile
                    </NavLink>
                  </li>
                </>
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