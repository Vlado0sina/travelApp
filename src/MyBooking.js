import React, { useEffect, useState, useContext } from "react";
import { getUserBookings, deleteBooking } from "./BookingService";
import { AuthContext } from "./AuthContext";
import { Button, Typography, Box, Paper } from "@mui/material";

const MyBookings = () => {
  const { currentUser } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (currentUser) {
        const userBookings = await getUserBookings(currentUser.uid);
        setBookings(userBookings);
      }
    };
    fetchBookings();
  }, [currentUser]);

  const handleDelete = async (id) => {
    await deleteBooking(id);
    setBookings(bookings.filter((booking) => booking.id !== id));
  };

  return (
    <Box>
      <Typography variant="h4">My Bookings</Typography>
      {bookings.map((booking) => {
        <Paper key={booking.id} elevation={3}>
          <Typography>First Name: {booking.firstName}</Typography>
          <Typography>Last Name: {booking.lastName}</Typography>
          <Typography>Phone: {booking.phoneNumber}</Typography>
          <Typography>Email: {booking.email}</Typography>
          <Typography>Route: {booking.route}</Typography>
          <Typography>Date: {booking.date}</Typography>
          <Typography>Passengers: {booking.passengers}</Typography>
          <Button color="error" onClick={() => handleDelete(booking.id)}>
            Cancel Booking
          </Button>
        </Paper>;
      })}
    </Box>
  );
};
export default MyBookings;
