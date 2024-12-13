import React, { useState } from "react";
import { TextField, Button, Box, Typography, Grid } from "@mui/material";
import BookingForm from "./bookingForm";

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    name: "",
  });

  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const errors = {};
    const cardNumberRegex = /^[0-9]{16}$/;
    const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/; // MM/YY
    const cvcRegex = /^[0-9]{3,4}$/;

    if (!cardNumberRegex.test(formData.cardNumber)) {
      errors.cardNumber = "Please enter the correct card number (16 digits).";
    }
    if (!expiryRegex.test(formData.expiryDate)) {
      errors.expiryDate = "Please enter a valid expiration date (MM/YY).";
    }
    if (!cvcRegex.test(formData.cvc)) {
      errors.cvc = "Please enter the correct CVC (3-4 digits).";
    }
    if (!formData.name.trim()) {
      errors.name = "Card owner name is required.";
    }

    setErrors(errors);
    //changePaymentConfirmed(true);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      alert("Payment was successful");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "50px auto",
        padding: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "white",
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Payment
      </Typography>

      <form onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Cardholder name"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Card number"
              name="cardNumber"
              fullWidth
              value={formData.cardNumber}
              onChange={handleChange}
              error={!!errors.cardNumber}
              helperText={errors.cardNumber}
              inputProps={{ maxLength: 16 }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Expiry date (MM/YY)"
              name="expiryDate"
              fullWidth
              value={formData.expiryDate}
              onChange={handleChange}
              error={!!errors.expiryDate}
              helperText={errors.expiryDate}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="CVC"
              name="cvc"
              fullWidth
              value={formData.cvc}
              onChange={handleChange}
              error={!!errors.cvc}
              helperText={errors.cvc}
              inputProps={{ maxLength: 4 }}
            />
          </Grid>
        </Grid>

        <Box mt={3}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Pay
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default PaymentForm;
