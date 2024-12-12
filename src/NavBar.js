import React, { useContext, useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Grid,
  Modal,
  Box,
  Tooltip,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import MuiTabs from "./Tabs";
import SignUp from "./SignUp";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import Logo from "./pics/logo.png";

const ButtonBackgroundColor = { "&:hover": { backgroundColor: "#5A6A7A" } };
const font = { fontFamily: "Philadelphia, sans-serif" };

const Navbar = ({ isLoggedIn, setIsLoggedIn, resetBookingForm }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useContext(AuthContext);
  const [hover, setHover] = useState(false);

  const handleMouseEnter = () => setHover(true);
  const handleMouseLeave = () => setHover(true);

  const [value, setValue] = useState("signup");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleLogOut = () => {
    logout();
    setIsLoggedIn(false);
    //resetBookingForm();
    navigate("/");
  };

  const isOnUserPage = location.pathname === "/user";
  const isOnHomePage = location.pathname === "/";
  const isOnEmployeePage = location.pathname === "/employee";

  const isWorker = currentUser?.role === "worker";
  return (
    <>
      <AppBar position="static" sx={{ background: "#2F4156" }}>
        <Toolbar>
          <img
            src={Logo}
            alt="Logo"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
            }}
          ></img>
          <IconButton></IconButton>
          <Typography></Typography>
          <Grid container spacing={2}>
            <Grid item xs>
              <Button
                fullWidth
                sx={ButtonBackgroundColor}
                color="inherit"
                onClick={() => navigate("/FAQs")}
              >
                FQAs
              </Button>
            </Grid>
            <Grid item xs>
              <Button
                fullWidth
                sx={ButtonBackgroundColor}
                color="inherit"
                onClick={() => navigate("/aboutus")}
              >
                About us
              </Button>
            </Grid>
            <Grid item xs>
              <Button
                fullWidth
                sx={ButtonBackgroundColor}
                color="inherit"
                onClick={() => navigate("/contactus")}
              >
                Contact us
              </Button>
            </Grid>
            <Grid item xs>
              <Button
                fullWidth
                sx={ButtonBackgroundColor}
                color="inherit"
                onClick={() => navigate("/timetable")}
              >
                Timetable
              </Button>
            </Grid>
            <Grid item xs>
              <Button
                fullWidth
                sx={ButtonBackgroundColor}
                color="inherit"
                onClick={() => navigate("/price")}
              >
                Pricing
              </Button>
            </Grid>
            <Grid item xs>
              <Tooltip
                placement="top"
                arrow
                title={
                  !currentUser
                    ? "You need to log in "
                    : isWorker
                    ? "You don't have access to booking system "
                    : ""
                }
                sx={{ zIndex: 1300 }}
                // sx={{
                //   cursor:
                //     !currentUser || isWorker || isOnEmployeePage
                //       ? "not-allowed"
                //       : "pointer",
                // }}
              >
                <Button
                  fullWidth
                  //sx={ButtonBackgroundColor}
                  sx={{
                    cursor:
                      !currentUser || isWorker || isOnEmployeePage
                        ? "not-allowed"
                        : "pointer",
                  }}
                  color="inherit"
                  //area-disabled={!currentUser || isWorker}
                  disabled={!currentUser || isWorker || isOnEmployeePage}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  // onClick={() => navigate("/booking")}
                  onClick={() => {
                    if (!currentUser) return;
                    if (!isWorker && currentUser) {
                      navigate("/booking");
                    }
                  }}
                >
                  Booking
                </Button>
              </Tooltip>
            </Grid>

            <Grid item xs>
              {isLoggedIn ? (
                isOnHomePage || isOnEmployeePage ? (
                  <Button
                    fullWidth
                    sx={ButtonBackgroundColor}
                    color="inherit"
                    onClick={handleLogOut}
                  >
                    Log out
                  </Button>
                ) : isOnUserPage ? (
                  <Button
                    fullWidth
                    sx={ButtonBackgroundColor}
                    color="inherit"
                    onClick={handleLogOut}
                  >
                    Log out
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    sx={ButtonBackgroundColor}
                    color="inherit"
                    onClick={() => navigate("/user")}
                  >
                    Profile
                  </Button>
                )
              ) : (
                <Button
                  fullWidth
                  sx={ButtonBackgroundColor}
                  color="inherit"
                  onClick={handleOpen}
                >
                  SignIn / SignUp
                </Button>
              )}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <Modal className="signUp_modal" open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid black",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon></CloseIcon>
          </IconButton>
          <MuiTabs
            value={value}
            handleChange={handleChange}
            setIsLoggedIn={setIsLoggedIn}
            onClose={handleClose}
          />
          {/* <SignUp setIsLoggedIn={setIsLoggedIn} onClose={handleClose} /> */}
        </Box>
      </Modal>
    </>
  );
};

export default Navbar;