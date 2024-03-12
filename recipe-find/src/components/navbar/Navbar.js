import React, { useState, useEffect, useCallback } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import { SiPetsathome } from 'react-icons/si';
import { useSelector, useDispatch } from 'react-redux';
import EventBus from "../../utils/EventBus";
import { logout } from "../../slices/Auth";
import "./Navbar.css";
// import StepperModal from "./StepperModal";

function Navbar() {
  const [click, setClick] = useState(false);
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, [currentUser,logOut]);

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <nav className="navbar-custom">
          <div className="navbar-container container-custom">
            <Link to="/" className="navbar-logo" onClick={() => {
              closeMobileMenu();
              setModalOpen(false);
            }}>
              <SiPetsathome className="navbar-icon" />
              Fluffy Vet
            </Link>
            <div className="menu-icon" onClick={handleClick}>
              {click ? <FaTimes /> : <FaBars />}
            </div>
            <ul className={click ? "nav-menu active mb-0" : "nav-menu mb-0"}>

              {/* ANYONE CAN SEE */}
              <>
                <li className="nav-item">
                  <NavLink
                      to="/"
                      className={({ isActive }) =>
                          "nav-links" + (isActive ? " activated" : "")
                      }
                      onClick={() => {
                        closeMobileMenu();
                        setModalOpen(false);
                      }}
                  >
                    Home
                  </NavLink>
                </li>
                
              </>

              {/* LOGGED USERS */}
              {currentUser ? (
                <>

                  {/* ADMIN */}
                  {currentUser.roles.includes("ROLE_ADMIN") && (
                    <>
                        <li className="nav-item">
                            <NavLink
                                to="/admin/shifts"
                                className={({ isActive }) =>
                                    "nav-links" + (isActive ? " activated" : "")
                                }
                                onClick={() => {
                                    closeMobileMenu();
                                    setModalOpen(false);
                                }}
                            >
                                Shifts
                            </NavLink>
                        </li>
                        <li className="nav-item">
                        <NavLink
                        to="/admin/dashboard/procedures"
                        className={({ isActive }) =>
                          "nav-links" + (isActive ? " activated" : "")
                        }
                        onClick={() => {
                          closeMobileMenu();
                          setModalOpen(false);
                        }}
                      >
                          Admin Board
                      </NavLink>
                    </li>
                  </>
                  )}

                  

                  {/* CUSTOMER */}
                  <li className="nav-item">
                    <Link
                        to="/account"
                        className="nav-links"
                        onClick={() => {
                          closeMobileMenu();
                          setModalOpen(false);
                        }}
                    >
                      Account
                    </Link>
                  </li>
                  <li className="nav-item">
                    <a href="/login" className="nav-links"
                       onClick={() => {
                         logOut();
                         closeMobileMenu();
                         setModalOpen(false);
                       }}
                        // onClick={logOut}
                    >
                      Log out
                    </a>
                  </li>
                </>

              ) : (
                <>

                  {/* NOT LOGGED IN USERS */}
                  <li className="nav-item">
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        "nav-links" + (isActive ? " activated" : "")
                      }
                      onClick={() => {
                        closeMobileMenu();
                        setModalOpen(false);
                      }}
                    >
                      Login
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/register"
                      className={({ isActive }) =>
                        "nav-links" + (isActive ? " activated" : "")
                      }
                      onClick={() => {
                        closeMobileMenu();
                        setModalOpen(false);
                      }}
                    >
                      Sign Up
                    </NavLink>
                  </li>

                </>
              )}
            </ul>
          </div>
        </nav>
      </IconContext.Provider>
      {/* {modalOpen && <StepperModal setOpenModal={setModalOpen} />} */}
    </>
  );
}

export default Navbar;