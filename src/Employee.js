import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import DailyBardingList from "./DailyBoardingList";
import ReportsStatistic from "./ReportsStatistics";

const Employee = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={3}>
        <Grid ite xs={12} md={6}>
          <DailyBardingList />
        </Grid>
        <Grid ite xs={12} md={6}>
          <ReportsStatistic />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Employee;
