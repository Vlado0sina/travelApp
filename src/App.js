import "./App.css";
import React, { useContext, useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./NavBar";
import UserPage from "./UserPage";
import BookingForm from "./bookingForm";
import { AuthProvider } from "./AuthContext";
import Employee from "./Employee";
import FaqPage from "./FAQs";
import { Box, IconButton, useMediaQuery } from "@mui/material";

import { ArrowForward, ArrowBack } from "@mui/icons-material";
import AboutUs from "./AboutUs";
import ContactUs from "./ContactUs";

import TimetablePage from "./Timetable";
import PricePage from "./Price";
import { useTheme } from "@emotion/react";

function App() {
  // const { currentUser } = useContext(AuthContext);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const navbarRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("userToken")
  );

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);
  useEffect(() => {
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.offsetHeight);
    }
  }, []);
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Navbar
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            ref={navbarRef}
          />
          <Routes>
            <Route
              path="/"
              element={<HomePage navbarHeight={navbarHeight} />}
            />
            <Route path="/user" element={<UserPage />} />
            <Route path="/booking" element={<BookingForm />} />
            <Route path="/employee" element={<Employee />} />
            <Route path="/FAQs" element={<FaqPage />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/timetable" element={<TimetablePage />} />
            <Route path="/price" element={<PricePage />} />
            <Route path="*" element={<h2>404: Page Not Found</h2>} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

const HomePage = ({ navbarHeight }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const images = [
    "https://www.tobermory.co.uk/wp-content/uploads/Seahorse-002-scaled.jpg",
    "https://www.portofaberdeen.co.uk/assets/images/transforms/_1024x576_crop_center-center_75_none/Image-1.jpg",
    "https://www.scenic.eu/-/media/project/scenic/scenic-tours/explore-images/greenland-and-iceland/iceland-top-banner/se_scenic-eclipse-reine-lofoten-islands-norway_desktop.jpg?h=585&iar=0&w=1400&rev=8afd7c5592c943f9b8eb8db0395dc3cd&hash=7F578F931A98F6CF7582B2083AD89F0A",
    "https://www.scenicusa.com/-/media/project/scenic/scenic-tours/explore-images/greenland-and-iceland/accordian/se_scenic_eclpse_exterior_iceland.jpg?h=575&iar=0&w=766&rev=fc6780b3cde446ab8c66c5ae59ce70cc&hash=A6A4A5B898474D522A65E4D27A0BEA23",
    "https://cruiseindustrynews.com/wp-content/uploads/2022/02/EXPLORA_I_Exterior_View_13.jpg.webp",
  ];
  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <Box
      sx={{
        width: "100%",
        // height: `calc(100vh - ${navbarHeight}px)`,
        height: `calc(100vh - 64px)`,
        margin: "0 auto",
        // position: "relative",
        overflow: "hidden",
      }}
    >
      <img
        src={images[activeIndex]}
        alt={`carousel-image${activeIndex}`}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      ></img>
      <IconButton
        onClick={prevSlide}
        sx={{
          position: "absolute",
          top: "50%",
          left: "10px",
          transform: "translateY(-50%)",
          zIndex: 1,
          color: "white",
          backgroundColor: "rgba(0,0,0,0.5)",
          //display: isMobile ? "none" : "block",
        }}
      >
        <ArrowBack />
      </IconButton>
      <IconButton
        onClick={nextSlide}
        sx={{
          position: "absolute",
          top: "50%",
          right: "10px",
          transform: "translateY(-50%)",
          zIndex: 1,
          color: "white",
          backgroundColor: "rgba(0,0,0,0.5)",
          //display: isMobile ? "none" : "block",
        }}
      >
        <ArrowForward />
      </IconButton>
    </Box>
  );
};
export default App;
