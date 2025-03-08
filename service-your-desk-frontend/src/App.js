import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation/Navigation";
import Header from "./components/Header/Header";
import Services from "./components/Services/Services";
import ServiceProviders from "./components/ServiceProviders/ServiceProviders";
import ServiceProviderDetails from "./components/ServiceProviderDetails/ServiceProviderDetails";
import Footer from "./components/Footer/Footer";
import Bookings from "./components/Bookings/Bookings";
import Auth from "./components/Auth/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatbotComponent from "./components/Chatbot/Chatbot";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <div className="content">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute element={<><Header /><Services /></>} />} />
            <Route path="/services" element={<ProtectedRoute element={<Services />} />} />
            <Route path="/service/:serviceName" element={<ProtectedRoute element={<ServiceProviders />} />} />
            <Route path="/provider/:providerId" element={<ProtectedRoute element={<ServiceProviderDetails />} />} />
            <Route path="/bookings" element={<ProtectedRoute element={<Bookings />} />} />
          </Routes>
        </div>
        <Footer />
        <ChatbotComponent /> 
      </div>
    </Router>
  );
}

export default App;
