import PropTypes from "prop-types";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AutoSignIn } from "./firebase/AutoSignIn";
import { ItemsProvider } from "./contexts/ItemsProvider";
import { ModalsProvider } from "./contexts/ModalsProvider";
import Navbar from "./components/Navbar";
import { SignUpModal } from "./components/Modal";
import HomePage from "./pages/Home";
import AdminPage from "./pages/Admin";
import Post from "./pages/Post"; // Importa el componente Post
import Footer from "./components/Footer"; // Importa el componente Footer
function App() {
  const demo = true;

  const { admin } = AutoSignIn();

  const Providers = ({ children }) => {
    return (
      <ItemsProvider demo={demo}>
        <ModalsProvider>{children}</ModalsProvider>
      </ItemsProvider>
    );
  };

  function ProtectedRoute({ children, condition }) {
    return condition ? children : <Navigate to={import.meta.env.BASE_URL} />;
  }

  return (
    <Providers>
      <Router>
        <Navbar admin={admin} />
        <SignUpModal />
        <Routes>
          <Route path={import.meta.env.BASE_URL} element={<HomePage />} />
          <Route
            exact
            path={import.meta.env.BASE_URL + "admin"}
            element={
              <ProtectedRoute condition={admin}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path={import.meta.env.BASE_URL + "post"} // Ruta para Post.jsx
            element={
              <ProtectedRoute condition={admin}>
                <Post />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      <Footer />
    </Providers>
  );
}

App.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
  condition: PropTypes.bool
}

export default App;
