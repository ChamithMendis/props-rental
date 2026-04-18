import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import BrowsePage from "./pages/BrowsePage";
import ItemDetailPage from "./pages/ItemDetailPage";
import AdminPage from "./pages/AdminPage";
import AdminLogin from "./pages/AdminLogin";
import { useProps } from "./hooks/useProps";

export default function App() {
  const propsState = useProps();
  const [isAdminAuth, setIsAdminAuth] = useState(
    () => sessionStorage.getItem("admin_auth") === "true"
  );

  const handleAdminLogin = () => {
    sessionStorage.setItem("admin_auth", "true");
    setIsAdminAuth(true);
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setIsAdminAuth(false);
  };

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage props={propsState.props} />} />
          <Route path="/browse" element={<BrowsePage propsState={propsState} />} />
          <Route path="/item/:id" element={<ItemDetailPage propsState={propsState} />} />
          <Route
            path="/admin"
            element={
              isAdminAuth ? (
                <AdminPage propsState={propsState} onLogout={handleAdminLogout} />
              ) : (
                <AdminLogin onLogin={handleAdminLogin} />
              )
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
