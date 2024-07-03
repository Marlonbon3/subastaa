import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { auth } from "../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
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
      } else {
        setUser("");
        setAuthButtonText("Sign up");
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
  const handleAuth = async () => {
    if (user) {
      await signOut(auth);
      setUser("");
      setAuthButtonText("Sign up");
      window.location.reload();
    } else {
      openModal(ModalTypes.SIGN_UP);
    }
  };
  const handleLogin = () => {
    openModal(ModalTypes.LOGIN);
  };
  return (
    <nav className="navbar navbar-dark bg-danger">
      <div className="container-fluid">
        <div className="navbar-brand mb-0 h1 me-auto">
          <Link to={import.meta.env.BASE_URL} className="text-light">
            <img
              src={import.meta.env.BASE_URL + "jokerh.png"}
              alt="Logo"
              width=""
              height="50"
              className="d-inline-block align-text-top"
            />
          </Link>
        </div>
        <div className="row row-cols-auto">
          <div className="navbar-brand text-light">{user}</div>
          {admin && (
            <>
              <Link to={import.meta.env.BASE_URL + "admin"}
                  className="btn btn-dark me-2" style={{ backgroundColor: "white", color: "red" }}>
                {adminButtonText}
              </Link>
              <Link
                  to={import.meta.env.BASE_URL + "post"}
                  className="btn btn-dark me-2" style={{ backgroundColor: "white", color: "red" }}>
                  Post Item
              </Link>
            </>
          )}
          <button
              onClick={handleAuth}
              className="btn me-2"
              style={{ backgroundColor: "white", color: "red", transition: 'background-color 0.3s ease', border: '1px solid #ccc'}}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f8f9fa'} onMouseOut={(e) => e.target.style.backgroundColor = 'white'}>
              {authButtonText}
          </button>
          {!user && (
            <button onClick={handleLogin} className="btn me-2" style={{ backgroundColor: "white", color: "red", transition: 'background-color 0.3s ease', border: '1px solid #ccc'}}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f8f9fa'} onMouseOut={(e) => e.target.style.backgroundColor = 'white'}>
            Login
          </button>
          )}
        </div>
      </div>
      <LoginModal />
    </nav>
  );
};
Navbar.propTypes = {
  admin: PropTypes.bool,
};
export default Navbar;