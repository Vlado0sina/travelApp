import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { Button, TextField, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
const validationSchemaSignIn = yup.object({
  email: yup.string().email("Invalid Email").required("Email is required"),
  password: yup.string().required("Password is required"),
});
const SignIn = ({ setIsLoggedIn, onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const generateTokenForUser = () => {
    return Math.random().toString(36).substring(2);
  };
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchemaSignIn,
    onSubmit: async (values, { resetForm }) => {
      values.email = values.email.toLowerCase();
      setLoading(true);

      try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        setIsLoggedIn(true);
        const userToken = generateTokenForUser();
        localStorage.setItem("userToken", userToken);
        //alert("Success");
        onClose();
        navigate("/user");
        resetForm();
      } catch (err) {
        if (err.code === "auth/user-not-found") {
          formik.setErrors({
            email: "User not found .Please check and try again.",
          });
        } else if (err.code === "auth/wrong-password") {
          formik.setErrors({ password: "Invalid password.Please try again." });
        } else if (err.code === "auth/invalid-email") {
          formik.setErrors({ email: "Invalid email.Please try again" });
        } else {
          alert(`Sign-in Fail: ${err.message}`);
        }
        console.error("Sign-in Error: ", err.message);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form className="signin" onSubmit={formik.handleSubmit}>
      <TextField
        type="email"
        id="email"
        name="email"
        className="email"
        label="Email"
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
        className="password"
        label="Password"
        margin="normal"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
      ></TextField>
      <Button type="submit" variant="outlined" disabled={loading}>
        {loading ? <CircularProgress size={24} /> : "Sign In"}
      </Button>
    </form>
  );
};
export default SignIn;
