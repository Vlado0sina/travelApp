import { useFormik } from "formik";
import * as yup from "yup";

import {
  Button,
  LinearProgress,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import registerUser from "./register";

const validationSchema = yup.object({
  firstName: yup
    .string()
    .matches(/^[a-zA-Z]+$/, "Only latin letters are allowed")
    .required("First Name is required"),
  lastName: yup
    .string()
    .matches(/^[a-zA-Z]+$/, "Only latin letters are allowed")
    .required("Last Name is required"),
  phoneNumber: yup
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
  password: yup
    .string()
    .min(8)
    .matches(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,
      "Password must contain latin letters and at least one lowercase, uppercaseone letter and one special character and one digit"
    )
    .required("Password is required")
    .test(
      "password-strength",
      "Password is too weak",
      (value) => calculatePasswordStrenght(value) >= 20
    ),
});

function calculatePasswordStrenght(password) {
  if (!password) return 0;

  let strength = 0;

  //password length
  if (password.length >= 6) strength += 20;
  if (password.length >= 10) strength += 10;

  //check for characters
  if (/[A-Z]/.test(password)) strength += 20;
  if (/[a-z]/.test(password)) strength += 20;
  if (/[0-9]/.test(password)) strength += 20;
  if (/[\W_]/.test(password)) strength += 20;

  return Math.min(strength, 100);
}

const SignUp = ({ setIsLoggedIn, onClose }) => {
  const navigate = useNavigate();
  const generateTokenForUser = () => {
    return Math.random().toString(36).substring(2);
  };
  const formik = useFormik({
    initialValues: {
      clientType: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      console.log(JSON.stringify(values));
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await registerUser(values);
        setIsLoggedIn(true);
        const userToken = generateTokenForUser();
        localStorage.setItem("userToken", userToken);
        localStorage.setItem("userEmail", values.email);
        localStorage.setItem("clientType", values.clientType); //
        onClose();
        if (values.clientType === "worker") {
          navigate("/employee");
        } else {
          navigate("/user");
        }

        resetForm();
      } catch (err) {
        console.error("Error adding document: ", err);
        alert("Failed to submit form. Try again.");
      }
    },
  });

  const passwordStrength = calculatePasswordStrenght(formik.values.password);

  const getStrengthLabel = (strength) => {
    if (strength <= 20) return "Very weak";
    if (strength <= 40) return "Weak";
    if (strength <= 60) return "Moderate";
    if (strength <= 80) return "Strong";
    return "Very strong";
  };

  const [clientType, setClientType] = useState("");

  return (
    <form className="signup" onSubmit={formik.handleSubmit}>
      <FormControl>
        <FormLabel>Type of Client</FormLabel>
        <RadioGroup
          name="clientType"
          value={formik.values.clientType}
          onChange={(e) => {
            formik.setFieldValue("clientType", e.target.value);
            setClientType(e.target.value);
          }}
        >
          <FormControlLabel
            value="regular"
            control={<Radio />}
            label="Regular"
          ></FormControlLabel>
          <FormControlLabel
            value="worker"
            control={<Radio />}
            label="Worker"
          ></FormControlLabel>
          <FormControlLabel
            value="frequent"
            control={<Radio />}
            label="Frequent"
          ></FormControlLabel>
        </RadioGroup>
      </FormControl>
      <TextField
        type="text"
        id="firstName"
        name="firstName"
        label="First Name"
        margin="normal"
        value={formik.values.firstName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
        helperText={formik.touched.firstName && formik.errors.firstName}
      ></TextField>
      <TextField
        type="text"
        id="lastName"
        name="lastName"
        label="Last Name"
        margin="normal"
        value={formik.values.lastName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
        helperText={formik.touched.lastName && formik.errors.lastName}
      ></TextField>
      <TextField
        type="number"
        id="phoneNumber"
        name="phoneNumber"
        label="Phone Number"
        margin="normal"
        value={formik.values.phoneNumber}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
        helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
      ></TextField>
      <TextField
        type="email"
        id="email"
        name="email"
        label="Email Address"
        margin="normal"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
      ></TextField>
      <TextField
        type="password"
        id="password"
        name="password"
        label="Password"
        margin="normal"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
      ></TextField>
      {formik.values.password && (
        <div style={{ margin: "20px 0" }}>
          <Typography variant="body2" gutterBottom>
            Password Strength: {getStrengthLabel(passwordStrength)}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={passwordStrength}
            style={{
              height: 10,
              borderRadius: 5,
              backgroundColor: "#e0e0e0",
            }}
          ></LinearProgress>
        </div>
      )}
      <Button type="submit" variant="outlined">
        Sign Up
      </Button>
    </form>
  );
};
export default SignUp;
