import React from "react";
import { Box } from "@mui/material";
import Timtable from "./pics/timetable.png";

const TimetablePage = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <img
        src={Timtable}
        alt="Timetable"
        style={{ width: "80%", height: "auto", objectFit: "contain" }}
      ></img>
    </Box>
  );
};
export default TimetablePage;
