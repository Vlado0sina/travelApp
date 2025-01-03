import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Grid,
  Paper,
  Snackbar,
  Alert,
  Link,
} from "@mui/material";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "messages"), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        timestamp: new Date(),
      });
      setSnackbarMessage("Your message has been sent successfully!");
      setOpenSnackbar(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error adding document: ", error);
      setSnackbarMessage("Failed to send message. Please try again.");
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "40px" }}>
      <Paper elevation={3} style={{ padding: "40px" }}>
        <Typography variant="h4" gutterBottom align="center">
          Contact Us
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                type="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Message"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
          <Box mt={3} textAlign="center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ padding: "10px 20px" }}
            >
              Send Message
            </Button>
          </Box>
        </form>
        <Box mt={4} textAlign="center">
          <Typography variant="h6" gutterBottom>
            Or you can reach us directly :
          </Typography>
          <Typography variant="body1">
            <strong>Phone:</strong>
            {""}
            <Link href="tel:+123456789" color="inherit">
              +123456789
            </Link>
          </Typography>
          <Typography varaint="body1">
            <strong>Email:</strong>
            {""}
            <Link
              href="mailto:theonlyscotiaislandcruisesglencross@gmail.com"
              color="inherit"
            >
              theonlyscotiaislandcruisesglencross@gmail.com
            </Link>
          </Typography>
        </Box>
      </Paper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
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
    </Container>
  );
};
export default ContactUs;
