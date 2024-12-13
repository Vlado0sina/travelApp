import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Paper } from "@mui/material";
import DailyBardingList from "./DailyBoardingList";
import ReportsStatistic from "./ReportsStatistics";
import { db } from "./firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
const Employee = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const messagesData = querySnapshot.docs.map((doc) => doc.data());
      setMessages(messagesData);
    };
    fetchMessages();
  }, []);
  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={3}>
        {messages.map((message, index) => (
          <Grid item xs={12} key={index}>
            <Paper
              elevation={3}
              style={{
                padding: "20px",
                marginBottom: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              {" "}
              <Typography variant="h4" gutterBottom>
                Message from customer
              </Typography>
              <Typography variant="h6">Name: {message.name}</Typography>
              <Typography variant="body1" style={{ marginTop: "10px" }}>
                Message: {message.message}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Email: {message.email}
              </Typography>
            </Paper>
          </Grid>
        ))}
        <Grid item xs={12} md={6}>
          <DailyBardingList />
        </Grid>
        <Grid item xs={12} md={6}>
          <ReportsStatistic />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Employee;
