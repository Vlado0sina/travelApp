import { Tab, Box } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const MuiTabs = ({ value, handleChange, setIsLoggedIn, onClose }) => {
  return (
    <Box>
      <TabContext value={value}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TabList onChange={handleChange}>
            <Tab label="Sign Up" value="signup"></Tab>
            <Tab label="Sign In" value="signin"></Tab>
          </TabList>
        </Box>
        <TabPanel value="signup">
          {/* <SignUp></SignUp> */}
          <SignUp setIsLoggedIn={setIsLoggedIn} onClose={onClose} />
        </TabPanel>
        <TabPanel value="signin">
          {/* <SignIn></SignIn> */}
          <SignIn setIsLoggedIn={setIsLoggedIn} onClose={onClose} />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default MuiTabs;
