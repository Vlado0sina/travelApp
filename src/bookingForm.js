import React, { createContext, useContext, useState, useEffect } from "react";
import { Formik, useFormik } from "formik";
import * as yup from "yup";
import {
  TextField,
  Button,
  MenuItem,
  Container,
  Typography,
  Paper,
  Box,
  Snackbar,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Tooltip,
} from "@mui/material";
import { AuthContext } from "./AuthContext";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FormatLineSpacing } from "@mui/icons-material";

const steps = ["Route information", "Payment", "Your ticket"];

const routePrices = {
  "Mallaig - Eigg": 18,
  "Mallaig - Rum": 24,
  "Mallaig - Muck": 19,
  "Eigg - Muck": 10,
  "Eigg - Rum": 16,
};

const BookingForm = ({ resetBookingForm }) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useContext(AuthContext);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [step, setStep] = useState(0);
  const [ticketData, setTicketData] = useState(null);
  const [ticketType, setTicketType] = useState("return");
  const [price, setPrice] = useState(0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const formik = useFormik({
    initialValues: {
      route: "",
      date: "",
      passengers: 1,
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
      email: currentUser?.email || "",
      phone: currentUser?.phoneNumber || "",
      date: "",
      childCount: 0,
      hasChild: "no",
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      route: yup.string().required("Choose route please"),
      date: yup
        .date()
        .min(today, "You cannot select a past date")
        .required("Enter travel date"),
      passengers: yup
        .number()
        .min(1)
        .max(30, "No more than 30 passengers")
        .required("Enter the number of passengers"),
      childCount: yup
        .number()
        .min(0, "The number of children cannot be less than 0")
        .nullable(),
      ...Array.from({ length: 10 }).reduce(
        (acc, _, index) => ({
          ...acc,
          [`childAge_${index}`]: yup
            .number()
            .min(0, "Age cannot be negative")
            .max(16, "The child's age cannot be older than 16")
            .nullable(),
        }),
        {}
      ),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (step === 0) {
        setStep(1);
      }
    },
  });

  useEffect(() => {
    const routePrice = routePrices[formik.values.route] || 0;

    const adultTicketPrice =
      ticketType === "single" ? routePrice * 0.7 : routePrice;
    const adultTotalPrice = adultTicketPrice * formik.values.passengers;

    let childTotalPrice = 0;
    const childCount = Number(formik.values.childCount) || 0;

    for (let i = 0; i < childCount; i++) {
      const childAge = Number(formik.values[`childAge_${i}`]) || 0;

      if (childAge <= 2) {
        childTotalPrice += 0;
      } else if (childAge >= 3 && childAge <= 10) {
        childTotalPrice += 7;
      } else if (childAge >= 11 && childAge <= 16) {
        childTotalPrice += 10;
      }
    }

    //const ticketPrice = ticketType === "single" ? routePrice * 0.7 : routePrice;
    const totalPrice = adultTotalPrice + childTotalPrice;
    setPrice(parseFloat(totalPrice.toFixed(2)));
  }, [
    formik.values.route,
    ticketType,
    formik.values.passengers,
    formik.values.childCount,
    ...Object.values(formik.values),
  ]);
  const handleTicketTypeChange = (event) => {
    setTicketType(event.target.value);
  };

  const handlePaymentOption = async (option) => {
    if ((option = "payOnSite")) {
      handleBooking();
    } else if (option === "payOnline") {
    }
  };
  const handleBooking = async () => {
    try {
      const bookingData = {
        route: formik.values.route,
        date: formik.values.date,
        passengers: formik.values.passengers,
        userId: currentUser?.uid,
        firstName: formik.values.firstName,
        lastName: formik.values.lastName,
        email: formik.values.email,
        phone: formik.values.phone,
        status: "active",
        ticketType,
        price,
      };
      const bookingRef = collection(db, "bookings");
      await addDoc(bookingRef, bookingData);
      setTicketData(bookingData);
      setStep(2);
      //setOpenSnackBar(true);
      //resetForm();
    } catch (error) {
      console.error("Error adding booking: ", error);
    }
  };

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  };
  const handlePrint = () => {
    window.print();
  };

  //   if (!currentUser) {
  //     return (
  //       <Box textAlign="center" mt={5}>
  //         <Typography variant="h5" mb={2}>
  //           Please sign in to book a ticket
  //         </Typography>
  //       </Box>
  //     );
  //   }
  return (
    <Container maxWidth="sm" style={{ marginTop: "30px" }}>
      <Paper elevation={3} style={{ padding: "20px" }}>
        <Stepper activeStep={step} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {step === 0 && (
          <form onSubmit={formik.handleSubmit}>
            <Box mb={3}>
              <TextField
                fullWidth
                name="firstName"
                type="text"
                label="First Name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={
                  formik.touched.firstName && Boolean(formik.errors.firstName)
                }
                helperText={formik.touched.firstName && formik.errors.firstName}
                variant="outlined"
                size="small"
                disabled
              />
            </Box>

            <Box mb={3}>
              <TextField
                fullWidth
                name="lastName"
                type="text"
                label="Last Name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={
                  formik.touched.lastName && Boolean(formik.errors.lastName)
                }
                helperText={formik.touched.lastName && formik.errors.lastName}
                variant="outlined"
                size="small"
                disabled
              />
            </Box>
            <Box mb={3}>
              <TextField
                fullWidth
                name="email"
                type="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                variant="outlined"
                size="small"
                disabled
              />
            </Box>
            <Box mb={3}>
              <TextField
                fullWidth
                name="phone"
                type="text"
                label="Phone number"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
                variant="outlined"
                size="small"
                disabled
              />
            </Box>
            <Box mb={3}>
              <TextField
                fullWidth
                select
                name="route"
                label="Route"
                value={formik.values.route}
                onChange={formik.handleChange}
                error={formik.touched.route && Boolean(formik.errors.route)}
                helperText={formik.touched.route && formik.errors.route}
                variant="outlined"
                size="small"
              >
                <MenuItem value="Mallaig - Eigg">Mallaig - Eigg</MenuItem>
                <MenuItem value="Mallaig - Rum">Mallaig - Rum</MenuItem>
                <MenuItem value="Mallaig - Muck">Mallaig - Muck</MenuItem>
                <MenuItem value="Mallaig - Muck">Eigg - Muck</MenuItem>
                <MenuItem value="Mallaig - Muck">Eigg - Rum</MenuItem>
              </TextField>
            </Box>
            <Box mb={3}>
              <TextField
                fullWidth
                select
                name="ticketType"
                label="Ticket Type"
                value={ticketType}
                onChange={handleTicketTypeChange}
                variant="outlined"
                size="small"
              >
                <MenuItem value="return">Return</MenuItem>
                <MenuItem value="single">Single</MenuItem>
              </TextField>
            </Box>

            <Box mb={3}>
              <TextField
                fullWidth
                name="date"
                type="date"
                label="Date of travel"
                value={formik.values.date}
                onChange={formik.handleChange}
                error={formik.touched.date && Boolean(formik.errors.date)}
                helperText={formik.touched.date && formik.errors.date}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                size="small"
              />
            </Box>
            <>
              <Box mb={3}>
                <TextField
                  fullWidth
                  select
                  name="hasChild"
                  label="Do you have a child?"
                  value={formik.values.hasChild || "no"}
                  onChange={formik.handleChange}
                  variant="outlined"
                  size="small"
                >
                  <MenuItem value="no">No</MenuItem>
                  <MenuItem value="yes">Yes</MenuItem>
                </TextField>
              </Box>
              {/* //{formik.values.hasChild === "yes" */}
              {formik?.values && (
                <>
                  <Box>
                    <TextField
                      fullWidth
                      name="childCount"
                      type="number"
                      label="Number of children"
                      value={formik.values.childCount}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.childCount &&
                        Boolean(formik.errors.childCount)
                      }
                      helperText={
                        formik.touched.childCount && formik.errors.childCount
                      }
                      variant="outlined"
                      size="small"
                    />
                  </Box>

                  {[...Array(Number(formik.values.childCount) || 0)].map(
                    (_, index) => (
                      <Box mb={3} key={index}>
                        <TextField
                          fullWidth
                          name={`childAge_${index}`}
                          type="number"
                          label={`Age of the child #${index + 1}`}
                          values={formik.values[`childAge_${index}`] || ""}
                          onChange={formik.handleChange}
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                    )
                  )}
                </>
              )}
            </>
            <Box mb={3}>
              <TextField
                fullWidth
                name="passengers"
                type="number"
                label="Number of adults"
                value={formik.values.passengers}
                onChange={formik.handleChange}
                error={
                  formik.touched.passengers && Boolean(formik.errors.passengers)
                }
                helperText={
                  formik.touched.passengers && formik.errors.passengers
                }
                variant="outlined"
                size="small"
              />
            </Box>
            <Box mb={3}>
              <Typography>
                Adult: {formik.values.passengers} x £
                {(routePrices[formik.values.route] ?? 0) *
                  (ticketType === "single" ? 0.7 : 1).toFixed(2)}
                = £
                {(routePrices[formik.values.route] ?? 0) *
                  (ticketType === "single" ? 0.7 : 1).toFixed(2)}
              </Typography>
              {formik.values.hasChild === "yes" && (
                <>
                  {[...Array(Number(formik.values.childCount) || 0)].map(
                    (_, index) => {
                      const childAge =
                        Number(formik.values[`childAge_${index}`]) || 0;
                      let childPrice = 0;

                      if (childAge <= 2) {
                        childPrice = 0;
                      } else if (childAge >= 3 && childAge <= 10) {
                        childPrice = 7;
                      } else if (childAge >= 11 && childAge <= 16) {
                        childPrice = 10;
                      }
                      return (
                        <Typography key={index}>
                          Child {index + 1}(Age: {childAge}): £
                          {childPrice.toFixed(2)}
                        </Typography>
                      );
                    }
                  )}
                </>
              )}
              <Typography variant="h6">
                Total price: £{formik?.values.passengers ? price : 0}
              </Typography>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              style={{ padding: "10 0px", fontSize: "16px" }}
            >
              Next
            </Button>
          </form>
        )}
        {step === 1 && (
          <Box>
            <Button
              onClick={() => handlePaymentOption("payOnSite")}
              variant="outlined"
              fullWidth
            >
              Pay On Site
            </Button>
            <Button
              onClick={() => handlePaymentOption("payOnline")}
              variant="outlined"
              fullWidth
            >
              Pay Online
            </Button>
          </Box>
        )}
        {step === 2 && (
          <Box>
            <Typography variant="h5" mb={2}>
              Your Ticket
            </Typography>
            <Paper
              elevation={1}
              style={{ padding: "20px", marginBottom: "20px" }}
            >
              <Typography>
                Name: {ticketData?.firstName} {ticketData?.lastName}
              </Typography>
              <Typography variant="h6">Route: {ticketData?.route}</Typography>
              <Typography>Date of travel: {ticketData?.date}</Typography>
              <Typography>
                Number of passengers: {ticketData?.passengers}
              </Typography>
              <Typography>Email: {ticketData?.email}</Typography>
            </Paper>
            <Button onClick={handlePrint} variant="contained">
              Print Ticket
            </Button>
          </Box>
        )}
      </Paper>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackBar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpenSnackBar(false)}
          severity="success"
          sx={{
            width: "100%",
            fontSize: "1rem",
            padding: "16px",
            mt: "70px",
          }}
        >
          Booking successful
        </Alert>
      </Snackbar>
    </Container>
    // </Box>
  );
};
export default BookingForm;
