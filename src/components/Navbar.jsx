import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { ModalsContext } from "../contexts/ModalsProvider";
import { ModalTypes } from "../utils/modalTypes";
import { LoginModal } from "../components/Modal";

const Navbar = ({ admin }) => {
  const { openModal } = useContext(ModalsContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState("");
  const [authButtonText, setAuthButtonText] = useState("Sign up");
  const [adminButtonText, setAdminButtonText] = useState("Admin");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.displayName != null) {
        setUser(`Hi ${user.displayName}`);
        setAuthButtonText("Sign out");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAdmin = () => {
    if (location.pathname.includes("admin")) {
      navigate(import.meta.env.BASE_URL);
      setAdminButtonText("Admin");
    } else {
      navigate(import.meta.env.BASE_URL + "admin");
      setAdminButtonText("Home");
    }
  };

  const handleAuth = () => {
    if (user) {
      setUser("");
      setAuthButtonText("Sign up");
    } else {
      openModal(ModalTypes.SIGN_UP);
    }
  };

  const handleLogin = () => {
    openModal(ModalTypes.LOGIN);
  };

  return (
    <nav className="navbar navbar-dark bg-danger">  {/* Changed to bg-danger for red */}
      <div className="container-fluid">
        <div className="navbar-brand mb-0 h1 me-auto">
          <Link to={import.meta.env.BASE_URL} className="text-light">  {/* Text remains light for contrast */}
            <img
              src={import.meta.env.BASE_URL + "logorra2.png"}
              alt="Logo"
              width="30"
              height="24"
              className="d-inline-block align-text-top"
            />
          </Link>
        </div>
        <div className="row row-cols-auto">
          <div className="navbar-brand text-light">{user}</div>  {/* Text remains light for contrast */}
          {admin && (
            <>
              <Link to={import.meta.env.BASE_URL + "admin"} className="btn btn-dark me-2">  {/* Buttons remain dark */}
                {adminButtonText}
              </Link>
              <Link to={import.meta.env.BASE_URL + "post"} className="btn btn-dark me-2">
                Post Item
              </Link>
            </>
          )}
<button onClick={handleAuth} className="btn btn-dark me-2" style={{ transition: 'background-color 0.3s ease' }} onMouseOver={(e) => e.target.style.backgroundColor = '#5a5a5a'} onMouseOut={(e) => e.target.style.backgroundColor = ''}> 
  {authButtonText}
</button>
<button onClick={handleLogin} className="btn btn-dark me-2" style={{ transition: 'background-color 0.3s ease' }} onMouseOver={(e) => e.target.style.backgroundColor = '#5a5a5a'} onMouseOut={(e) => e.target.style.backgroundColor = ''}>
  Login
</button>
        </div>
      </div>
      <LoginModal />
    </nav>
  );
};


Navbar.propTypes = {
  admin: PropTypes.bool
};

export default Navbar;