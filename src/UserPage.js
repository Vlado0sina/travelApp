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
  MenuItem,
} from "@mui/material";
import * as yup from "yup";
import { useFormik } from "formik";

const validationSchema = yup.object({
  firstName: yup
    .string()
    .matches(/^[a-zA-Z]+$/, "Only latin letters are allowed")
    .required("First Name is required"),
  lastName: yup
    .string()
    .matches(/^[a-zA-Z]+$/, "Only latin letters are allowed")
    .required("Last Name is required"),
  phone: yup
    .string()
    .matches(
      /^(\+\d{1,3}[- ]?)?\d{10}$/,
      "Phone number must be valid and contain 10 digits"
    )
    .required("Phone Number is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  date: yup
    .date()
    .required("Date required")
    .min(new Date(), "Date can not be in the past"),
  passengers: yup
    .number()
    .required("Passengers are required")
    .min(1, "There must be at least 1 passenger")
    .max(30, "Maximum 30 passengers allowed"),
});
const UserPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditBooking] = useState(null);
  const [updatedBooking, setUpdatedBooking] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [errors, setErrors] = useState({});
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
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== id)
      );
      setSnackbarMessage("Booking deleted successfully");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting booking", error);
    }
  };
  const handleEdit = (booking) => {
    setEditBooking(booking);
    formik.setValues(booking);
  };
  const handleCancleEdit = () => {
    setEditBooking(null);
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: editingBooking || {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      date: "",
      passengers: 1,
      route: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log("Form is being submitted");
      if (!editingBooking?.id) {
        console.log("Editing booking is not defined ");
        return;
      }
      console.log("Submitting form values: ", values);
      try {
        await updateBooking(editingBooking.id, values);
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === editingBooking.id
              ? { ...booking, ...values }
              : booking
          )
        );

        setSnackbarMessage("Booking updated successfully");
        setSnackbarOpen(true);
        setEditBooking(null);
        formik.resetForm();
      } catch (error) {
        if (error.name === "ValidationError") {
          const validationErrors = {};
          error.inner.forEach((err) => {
            validationErrors[err.path] = err.message;
          });

          setErrors(validationErrors);
        } else {
          console.error("Error updating", error);
        }
      }
    },
  });

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
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Fist Name"
                      value={formik.values.firstName}
                      name="firstName"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.firstName &&
                        Boolean(formik.errors.firstName)
                      }
                      helperText={
                        formik.touched.firstName && formik.errors.firstName
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Last Name"
                      value={formik.values.lastName}
                      name="lastName"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.lastName &&
                        Boolean(formik.errors.lastName)
                      }
                      helperText={
                        formik.touched.lastName && formik.errors.lastName
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Phone"
                      value={formik.values.phone}
                      name="phone"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.phone && Boolean(formik.errors.phone)
                      }
                      helperText={formik.touched.phone && formik.errors.phone}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      name="route"
                      label="Route"
                      value={formik.values.route}
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.route && Boolean(formik.errors.route)
                      }
                      helperText={formik.touched.route && formik.errors.route}
                    >
                      <MenuItem value="Mallaig - Eigg">Mallaig - Eigg</MenuItem>
                      <MenuItem value="Mallaig - Rum">Mallaig - Rum</MenuItem>
                      <MenuItem value="Mallaig - Muck">Mallaig - Muck</MenuItem>
                      <MenuItem value="Mallaig - Muck">Eigg - Muck</MenuItem>
                      <MenuItem value="Mallaig - Muck">Eigg - Rum</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Date"
                      type="date"
                      value={formik.values.date}
                      name="date"
                      fullWidth
                      inputProps={{ shrink: true }}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.date && Boolean(formik.errors.date)}
                      helperText={formik.touched.date && formik.errors.date}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Passengers"
                      value={formik.values.passengers}
                      name="passengers"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.passengers &&
                        Boolean(formik.errors.passengers)
                      }
                      helperText={
                        formik.touched.passengers && formik.errors.passengers
                      }
                    />
                  </Grid>
                  <Box mt={2}>
                    <Button
                      type="submit"
                      color="primary"
                      disabled={formik.isSubmitting || !formik.isValid}
                    >
                      Save Changes
                    </Button>
                    <Button color="secondary" onClick={handleCancleEdit}>
                      Cancel
                    </Button>
                  </Box>
                </Grid>
              </form>
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
