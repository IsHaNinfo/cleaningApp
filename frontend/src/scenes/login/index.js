import { Button, TextField, Typography, Snackbar } from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo/logo.png";
import "./login.css";
import axios from "axios";
import MuiAlert from "@mui/material/Alert";
import background from "../../assets/background.jpg"
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000', // Black for primary color
    },
    text: {
      primary: '#000000', // Black text color
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            color: 'black', // Text color
          },
          '& .MuiInputLabel-root': {
            color: 'black', // Label color
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'black', // Border color
            },
            '&:hover fieldset': {
              borderColor: 'black', // Border color on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: 'black', // Border color when focused
            },
          },
        },
      },
    },
  },
});

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
      const res = await axios.post("http://localhost:4000/user/loginUser", {
        email: formData.email,
        password: formData.password,
      });
      
      if (res.data.success) {
        setAlertSeverity("success");
        setAlertMessage("Sign in Successful!");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("isAuthenticated", true);
        navigate("/news");
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
    <div className ="div-container">
      <div className ="row  d-flex align-items-center justify-content-center">
        <div className = "col-md-4 col-sm-12 mt-4">
        <div className="login-container">
        <div className ="d-flex align-items-center justify-content-center">
        <img src={logo}></img>
        </div>
        <h2>Sign In</h2>
        <Typography component="p" variant="p" className ="mt-4">
          Please sign in to your accout
        </Typography>
        <form className="" onSubmit={login}>
        <Typography component="p" variant="p" className ="mt-3">
          Email
        </Typography>
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
            className="mt-0"
          />
          <Typography component="p" variant="p" className ="mt-2">
          Password
        </Typography>
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
            className="mt-0"
          />
          <br />
          <div className ="d-flex align-items-center justify-content-center">
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className="mt-5 submit-button"
          >
            Sign In
          </Button>
          </div>
          
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
        <div className ="col-8 p-0">
        <img src={background} className ="b-img " ></img>
        </div>
      </div>
      
    </div>
  );
}

export default Login;
