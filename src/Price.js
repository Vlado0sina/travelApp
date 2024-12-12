import React from "react";
import { Box } from "@mui/material";
import Prices from "./pics/price.jpg";

const PricePage = () => {
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
        src={Prices}
        alt="Prices"
        style={{ width: "80%", height: "100vh", objectFit: "contain" }}
      ></img>
    </Box>
  );
};
export default PricePage;
