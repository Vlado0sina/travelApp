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
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import CloseIcon from "@mui/icons-material/Close";
import MuiTabs from "./Tabs";
import SignUp from "./SignUp";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import Logo from "./pics/logo.png";

const ButtonBackgroundColor = { "&:hover": { backgroundColor: "#5A6A7A" } };
// const font = { fontFamily: "Philadelphia, sans-serif" };

const Navbar = ({ isLoggedIn, setIsLoggedIn, resetBookingForm }) => {
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useContext(AuthContext);
  const [hover, setHover] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.type === "Tab" || event.type === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };
  // const handleMouseEnter = () => setHover(true);
  // const handleMouseLeave = () => setHover(true);

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
  const handleTooltipOpen = () => {
    setTooltipOpen(true);
  };
  const handleTooltipClose = () => {
    setTooltipOpen(false);
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
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
            sx={{
              display: { xs: "block", sm: "none" },
            }}
          >
            <MenuIcon />
          </IconButton>

          <Grid
            container
            spacing={2}
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
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
                open={tooltipOpen}
                onClose={handleTooltipClose}
                onOpen={handleTooltipOpen}
                placement="top"
                title={
                  !currentUser
                    ? "You need to log in "
                    : isWorker && isOnEmployeePage
                    ? "You don't have access to booking system "
                    : ""
                }
                arrow
              >
                <Button
                  fullWidth
                  sx={{
                    cursor:
                      !currentUser || isWorker || isOnEmployeePage
                        ? "not-allowed"
                        : "pointer",
                  }}
                  color="inherit"
                  area-disabled={!currentUser || isWorker || isOnEmployeePage}
                  onClick={() => {
                    if (!currentUser || isWorker || isOnEmployeePage) return;
                    if (!isWorker || currentUser) {
                      //&&
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

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <IconButton onClick={toggleDrawer(false)} sx={{ marginLeft: "auto" }}>
            <CloseIcon />
          </IconButton>
          <List>
            <ListItemButton button onClick={() => navigate("/FAQs")}>
              <ListItemText primary="FAQs"></ListItemText>
            </ListItemButton>
            <ListItemButton button onClick={() => navigate("/aboutus")}>
              <ListItemText primary="About us"></ListItemText>
            </ListItemButton>
            <ListItemButton button onClick={() => navigate("/contactus")}>
              <ListItemText primary="Contact us"></ListItemText>
            </ListItemButton>
            <ListItemButton button onClick={() => navigate("/timetable")}>
              <ListItemText primary="Timetable"></ListItemText>
            </ListItemButton>
            <ListItemButton button onClick={() => navigate("/price")}>
              <ListItemText primary="Pricing"></ListItemText>
            </ListItemButton>
            <ListItemButton
              button
              onClick={() => {
                if (!isLoggedIn) {
                  alert(
                    "You need to be logged in to access the booking system"
                  );
                } else if (currentUser?.role === "worker" || isOnEmployeePage) {
                  alert("You don't have access to booking system as a worker");
                } else {
                  navigate("/booking");
                }
              }}
            >
              <ListItemText primary="Booking"></ListItemText>
            </ListItemButton>
            <ListItemButton
              button
              onClick={isLoggedIn ? handleLogOut : handleOpen}
            >
              <ListItemText
                primary={isLoggedIn ? "Log out" : "Sign in / Sign out"}
              ></ListItemText>
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

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
