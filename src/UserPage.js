import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import {
  getUserBookings,
  deleteBooking,
  updateBooking,
} from "./BookingService";
import {
  CircularProgress,
  Box,
  Typography,
  Button,
  TextField,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Grid,
} from "@mui/material";

const UserPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditBooking] = useState(null);
  const [updatedBooking, setUpdatedBooking] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        const fetchedBookings = await getUserBookings(currentUser.uid);
        setBookings(fetchedBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentUser]);

  const handleDelete = async (id) => {
    try {
      await deleteBooking(id);
      setBookings(bookings.filter((booking) => booking.id !== id));
      setSnackbarMessage("Booking deleted successfully");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting booking", error);
    }
  };

  const handleEdit = (booking) => {
    setEditBooking(booking);
    setUpdatedBooking({ ...booking });
  };
  const handleUpdate = async () => {
    try {
      await updateBooking(editingBooking.id, updatedBooking);
      setBookings(
        bookings.map((booking) =>
          booking.id === editingBooking.id ? updatedBooking : booking
        )
      );
      setSnackbarMessage("Booking updated successfully");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating", error);
    } finally {
      setEditBooking(null);
    }
  };

  const handleCancleEdit = () => {
    setEditBooking(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedBooking((prev) => ({ ...prev, [name]: value }));
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      {bookings.length === 0 ? (
        <Typography>No bookings found</Typography>
      ) : (
        bookings.map((booking) => (
          <Box
            key={booking.id}
            mb={2}
            sx={{ display: "flex", justifyContent: "center", padding: 2 }}
          >
            {editingBooking?.id === booking.id ? (
              <Box>
                <TextField
                  label="Fist Name"
                  value={updatedBooking.firstName}
                  name="firstName"
                  onChange={handleInputChange}
                  fullWidth
                />
                <TextField
                  label="Last Name"
                  value={updatedBooking.lastName}
                  name="lastName"
                  onChange={handleInputChange}
                  fullWidth
                />
                <TextField
                  label="Phone"
                  value={updatedBooking.phone}
                  name="phone"
                  onChange={handleInputChange}
                  fullWidth
                />
                <TextField
                  label="Route"
                  value={updatedBooking.route}
                  name="route"
                  onChange={handleInputChange}
                  fullWidth
                />
                <TextField
                  label="Date"
                  value={updatedBooking.date}
                  name="date"
                  onChange={handleInputChange}
                  fullWidth
                />
                <TextField
                  label="Passengers"
                  value={updatedBooking.passengers}
                  name="passengers"
                  onChange={handleInputChange}
                  fullWidth
                />
                <Box mt={2}>
                  <Button color="primary" onClick={handleUpdate}>
                    Save Changes
                  </Button>
                  <Button color="secondary" onClick={handleCancleEdit}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  padding: 2,
                  borderRadius: 2,
                  boxShadow: 2,
                  backgroundColor: "f9f9f9",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ marginBottom: 2, fontWeight: "bold" }}
                >
                  Booking Details
                </Typography>
                <Box
                  sx={{
                    display: "grid",

                    gap: 2,
                    marginBottom: 3,
                  }}
                >
                  <Typography variant="body1">
                    First Name: {booking.firstName}
                  </Typography>
                  <Typography variant="body1">
                    Last Name: {booking.lastName}
                  </Typography>
                  <Typography variant="body1">
                    Phone: {booking.phone}
                  </Typography>
                  <Typography variant="body1">
                    Email: {booking.email}
                  </Typography>
                  <Typography variant="body1">
                    Route: {booking.route}
                  </Typography>
                  <Typography variant="body1">Date: {booking.date}</Typography>
                  <Typography variant="body1">
                    Passengers: {booking.passengers}
                  </Typography>
                </Box>
                <Box>
                  <Button color="primary" onClick={() => handleEdit(booking)}>
                    Edit Booking
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleDelete(booking.id)}
                  >
                    Cancel Booking
                  </Button>
                </Box>
              </Box>
            )}
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={handleSnackbarClose}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert
                onClose={handleSnackbarClose}
                severity="success"
                sx={{
                  width: "100%",
                  fontSize: "1rem",
                  padding: "16px",
                  mt: "70px",
                }}
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </Box>
        ))
      )}
    </Box>
  );
};

export default UserPage;
