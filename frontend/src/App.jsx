import { Route, Routes } from "react-router-dom";
import Start from "./Pages/Start";
import UserLogin from "./Pages/UserLogin";
import UserSignup from "./Pages/UserSignup";
import CaptainLogin from "./Pages/CaptainLogin";
import CaptainSignup from "./Pages/CaptainSignup";
import Home from "./Pages/Home";
import UserProtectWrapper from "./Pages/UserProtectWrapper";
import UserLogout from "./Pages/UserLogout";
import CaptainHome from "./Pages/CaptainHome";
import CaptainProtectWrapper from "./Pages/CaptainProtectWrapper";
import CaptainLogout from "./Pages/CaptainLogout";
import Riding from "./Pages/Riding";
import CaptainRiding from "./Pages/CaptainRiding";
import "remixicon/fonts/remixicon.css";
import { SocketProvider } from "./context/SocketContext";



const App = () => {
  return (
    <SocketProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/captain-login" element={<CaptainLogin />} />
        <Route path="/captain-signup" element={<CaptainSignup />} />

        {/* User Protected Routes */}
        <Route
          path="/home"
          element={
            <UserProtectWrapper>
              <Home />
            </UserProtectWrapper>
          }
        />
        <Route
          path="/user/logout"
          element={
            <UserProtectWrapper>
              <UserLogout />
            </UserProtectWrapper>
          }
        />
        <Route
          path="/riding"
          element={
            <UserProtectWrapper>
              <Riding />
            </UserProtectWrapper>
          }
        />

        {/* Captain Protected Routes */}
        <Route
          path="/captain-home"
          element={
            <CaptainProtectWrapper>
                <CaptainHome />
            </CaptainProtectWrapper>
          }
        />
        <Route
          path="/captain/logout"
          element={
            <CaptainProtectWrapper>
              <CaptainLogout />
            </CaptainProtectWrapper>
          }
        />
        <Route
          path="/captain-riding"
          element={
            <CaptainProtectWrapper>
              <CaptainRiding />
            </CaptainProtectWrapper>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </SocketProvider>
  );
};

export default App;
