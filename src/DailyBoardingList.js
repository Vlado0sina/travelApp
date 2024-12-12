import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

const DailyBardingList = () => {
  const [boardingList, setBoardingList] = useState([]);
  useEffect(() => {
    const fetchBoardingList = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const q = query(collection(db, "bookings"), where("date", ">=", today));
        const querySnapshot = await getDocs(q);
        const passengers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        passengers.sort((a, b) => {
          if (a.date === today && b.today !== today) {
            return -1;
          }
          if (a.date !== today && b.today === today) {
            return 1;
          }
          return new Date(a.date) - new Date(b.date);
        });
        setBoardingList(passengers);
      } catch (error) {
        console.error("Error fetching boarding list", error);
      }
    };
    fetchBoardingList();
  }, []);
  return (
    <Paper sx={{ p: 2 }}>
      <h3>Boarding list</h3>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Route</TableCell>
              <TableCell>Number of passengers</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {boardingList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>No data available for today</TableCell>
              </TableRow>
            ) : (
              boardingList.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    backgroundColor:
                      row.date === new Date().toISOString().split("T")[0]
                        ? "rgba(255,99,71,0.3)"
                        : "inherit",
                  }}
                >
                  <TableCell>
                    {row.firstName} {row.lastName}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight:
                        row.date === new Date().toISOString().split("T")[0]
                          ? "bold"
                          : "nornal",
                    }}
                  >
                    {row.date}
                  </TableCell>
                  <TableCell>{row.route}</TableCell>
                  <TableCell>{row.passengers}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" onClick={() => window.print()}>
        Print
      </Button>
    </Paper>
  );
};

export default DailyBardingList;
