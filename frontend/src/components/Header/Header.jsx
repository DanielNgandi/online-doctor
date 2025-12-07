import { useEffect, useRef} from "react";
import { useAuth } from '../context/AuthContext';
import logo from "../../assets/images/logo.png";
import userImg from "../../assets/images/avatar-icon.png";
import { NavLink, Link } from "react-router-dom";
//import "../../App.css";
import { BiMenu,BiCalendar, BiHomeAlt, BiUser,BiBriefcase, BiEnvelope,BiCalendarPlus,BiUserCircle,BiLogOut,BiLogIn,BiStar } from "react-icons/bi";

const navLinks = [
  {
    path: "/home",
    display: "Home",
    icon: <BiHomeAlt />
  },
  {
    path: "/doctors",
    display: "Doctor",
    icon: <BiUser />
  },
  {
    path: "/services",
    display: "Services",
    icon: <BiBriefcase />
  },
  {
    path: "/contact",
    display: "Contact",
    icon: <BiEnvelope />
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

  const formatUsername = (username) => {
    if (!username) return "User";
    const parts = username.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0];
    }
    return parts[0];
  };

  const getAvatarInitial = (username) => {
    if (!username) return "U";
    return username.charAt(0).toUpperCase();
  };

  return (
    <header className="header flex items-center py-3" ref={headerRef}>
      <div className="container">
        <div className="flex items-center justify-between">
          {/* logo - make it smaller */}
          <div className="w-28 lg:w-40 flex-shrink-0">
            <Link to="/home">
              <img src={logo} alt="Logo" className="w-full h-auto" />
            </Link>
          </div>

          {/* menu - reduced spacing */}
          <div className="navigation flex-1 mx-2 lg:mx-3" ref={menuRef} onClick={toggleMenu}>
            <ul className="menu flex items-center gap-1 lg:gap-2 xl:gap-3 flex-nowrap overflow-x-auto">
              {/* Always show these navigation links */}
              {navLinks.map((link, index) => (
                <li key={index} className="flex-shrink-0">
                  <NavLink
                    to={link.path}
                    className={(navClass) =>
                      navClass.isActive
                        ? "text-primaryColor text-xs lg:text-sm font-[600] whitespace-nowrap flex items-center gap-1 px-1.5 py-1 rounded"
                        : "text-textColor text-xs lg:text-sm font-[500] hover:text-primaryColor whitespace-nowrap flex items-center gap-1 px-1.5 py-1 rounded hover:bg-gray-50"
                    }
                  >
                    <span className="text-base lg:text-lg">{link.icon}</span>
                    <span>{link.display}</span>
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
                          ? "text-primaryColor text-xs lg:text-sm font-[600] whitespace-nowrap flex items-center gap-1 px-1.5 py-1 rounded"
                          : "text-textColor text-xs lg:text-sm font-[500] hover:text-primaryColor whitespace-nowrap flex items-center gap-1 px-1.5 py-1 rounded hover:bg-gray-50"
                      }
                    >
                      <BiCalendar className="text-base lg:text-lg" />
                      <span className="hidden xs:inline">Appointments</span>
                      <span className="xs:hidden">Apps</span>
                    </NavLink>
                  </li>

                  {/* Book Appointment - only for patients */}
                  {user.role === 'patient' && (
                    <li className="flex-shrink-0">
                      <NavLink
                        to="/book-appointment"
                        className={(navClass) =>
                          navClass.isActive
                            ? "text-primaryColor text-xs lg:text-sm font-[600] whitespace-nowrap flex items-center gap-1 px-1.5 py-1 rounded"
                            : "text-textColor text-xs lg:text-sm font-[500] hover:text-primaryColor whitespace-nowrap flex items-center gap-1 px-1.5 py-1 rounded hover:bg-gray-50"
                        }
                      >
                        <BiCalendarPlus className="text-base lg:text-lg" />
                        <span>Book</span>
                      </NavLink>
                    </li>
                  )}

                  {/* Testimonials */}
                  <li className="flex-shrink-0">
                    <Link
                      to="/testimonials"
                      className="text-textColor text-xs lg:text-sm font-[500] hover:text-primaryColor whitespace-nowrap flex items-center gap-1 px-1.5 py-1 rounded hover:bg-gray-50"
                    >
                      <BiStar className="text-base lg:text-lg" />
                      <span className="hidden xs:inline">Testimonials</span>
                      <span className="xs:hidden">Reviews</span>
                    </Link>
                  </li>

                  {/* Profile link */}
                  <li className="flex-shrink-0">
                    <NavLink
                      to={getProfilePath()}
                      className={(navClass) =>
                        navClass.isActive
                          ? "text-primaryColor text-xs lg:text-sm font-[600] whitespace-nowrap flex items-center gap-1 px-1.5 py-1 rounded"
                          : "text-textColor text-xs lg:text-sm font-[500] hover:text-primaryColor whitespace-nowrap flex items-center gap-1 px-1.5 py-1 rounded hover:bg-gray-50"
                      }
                    >
                      <BiUserCircle className="text-base lg:text-lg" />
                      <span>Profile</span>
                    </NavLink>
                  </li>
                </>
              ) : null}
            </ul>
          </div>

          {/* nav right - compact layout */}
          <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
            {user ? (
              <div className="flex items-center gap-2 lg:gap-3">
                {/* User Profile with avatar - hide username on small screens */}
                <Link
                  to={getProfilePath()}
                  className="flex items-center gap-1 lg:gap-2 hover:opacity-80 transition-opacity"
                >
                  <figure className="w-7 h-7 lg:w-8 lg:h-8 rounded-full cursor-pointer bg-primaryColor flex items-center justify-center border-2 border-white shadow-sm flex-shrink-0">
                    <span className="text-white font-semibold text-xs">
                      {getAvatarInitial(user.username)}
                    </span>
                  </figure>
                  <span className="hidden lg:block text-textColor text-sm font-[500] whitespace-nowrap truncate max-w-[80px]">
                    {formatUsername(user.username)}
                  </span>
                </Link>

                {/* Logout Button - smaller on mobile */}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 py-1 px-2 lg:py-1.5 lg:px-3 text-white text-xs lg:text-sm font-[600] h-8 lg:h-10 flex items-center justify-center rounded-full hover:bg-red-600 transition-colors gap-1"
                >
                  <BiLogOut className="text-sm lg:text-base" />
                  <span className="hidden xs:inline">Logout</span>
                </button>
              </div>
            ) : (
              // User is not logged in - show login button
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="hidden md:block">
                  <Link to="/login">
                    <figure className="w-7 h-7 lg:w-8 lg:h-8 rounded-full cursor-pointer border border-gray-300 flex items-center justify-center">
                      <BiUser className="text-sm lg:text-base text-gray-500" />
                    </figure>
                  </Link>
                </div>
                <Link to="/login">
                  <button className="bg-primaryColor py-1 px-2 lg:py-1.5 lg:px-3 text-white text-xs lg:text-sm font-[600] h-8 lg:h-10 flex items-center justify-center rounded-full hover:bg-primaryColor/90 transition-colors gap-1">
                    <BiLogIn className="text-sm lg:text-base" />
                    <span className="hidden xs:inline">Login</span>
                    <span className="xs:hidden">Login</span>
                  </button>
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <span className="md:hidden" onClick={toggleMenu}>
              <BiMenu className="w-5 h-5 cursor-pointer" />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;