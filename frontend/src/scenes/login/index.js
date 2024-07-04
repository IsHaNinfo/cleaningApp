import { Button, TextField, Typography, Snackbar } from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo/logo.png";
import "./login.css";
import axios from "axios";
import MuiAlert from "@mui/material/Alert";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name == "email") {
      setEmailError("");
    }
    if (name == "password") {
      setPasswordError("");
    }
  };

  const login = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      setEmailError("Please enter an email address");
      return;
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formData.email)) {
        setEmailError("Please enter a valid email address");
        return;
      }
    }
    if (!formData.password) {
      setPasswordError("Please enter a password");
      return;
    } else {
      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordPattern.test(formData.password)) {
        setPasswordError(
          "Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number"
        );
        return;
      }
    }
    try {
      const res = await axios.post("https://jcgnapi.hasthiya.org/admin/login", {
        email: formData.email,
        password: formData.password,
      });
      
      if (res.data.result.status) {
        setAlertSeverity("success");
        setAlertMessage("Sign in Successful!");
        localStorage.setItem("token", res.data.result.token);
        localStorage.setItem("isAuthenticated", true);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setAlertSeverity("error");
      setAlertMessage(
        `Sign in failed! Invalid Username or password : ${err.message}`
      );
    } finally {
      setOpenSnackbar(true);
    }
  };

  return (
    <div className="container">
      <div className="login-container">
        <img src={logo}></img>
        <h2>Sign In</h2>
        <Typography component="p" variant="p">
          Please sign in to your accout
        </Typography>
        <form className="" onSubmit={login}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            onChange={handleChange}
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleChange}
            error={!!passwordError}
            helperText={passwordError}
          />
          <br />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className=""
          >
            Sign In
          </Button>
        </form>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          onClose={() => setOpenSnackbar(false)}
          severity={alertSeverity}
          elevation={6}
          variant="filled"
          style={{ color: "white" }}
        >
          {alertSeverity === "success" ? "Success" : "Error"}
          {": "}
          {alertMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

export default Login;
