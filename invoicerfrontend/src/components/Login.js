import React, { useContext, useState, useEffect } from "react";
import "./Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, useNavigate } from "react-router-dom";

import LoginImg from "../images/login.png";
import { userContext } from "../App";
// import { faEnvelope, faLock, faTimes } from "@fortawesome/free-solid-svg-icons";
import context from "react-bootstrap/esm/AccordionContext";
import Loader from "./Loader"; // Import the Loader component

const Login = () => {
  const { state, dispatch } = useContext(userContext);
  const Navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // State to track loading status
  const [updateMessage, setUpdateMessage] = useState(null);

  useEffect(() => {
    if (updateMessage) {
      const timeoutId = setTimeout(() => {
        setUpdateMessage(null);
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [updateMessage]);

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      setLoading(true); // Start showing loader
      const res = await fetch("/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.status === 400) {
        // window.alert("Login Failed: Invalid credentials");
        setUpdateMessage("Login Failed: Invalid credentials");
      } else if (res.status === 500) {
        // window.alert("Login Failed: Server error");
        setUpdateMessage("Login Failed: Server error");
      } else if (res.status === 201) {
        dispatch({ type: "USER", payload: true });
        // window.alert("Login Success");
        setUpdateMessage("Details updated successfully.");
        Navigate("/");
      }
    } catch (error) {
      // console.error("Error during login:", error);
      setUpdateMessage("Error during login");
    } finally {
      setLoading(false); // Hide loader whether login is successful or not
    }
  };

  return (
    <>
      <section className="login-box">
        <div className="login-container container">
          {updateMessage && (
            <div
              className={`update-message ${
                updateMessage.includes("failed") ? "error" : "success"
              }`}
              role="alert"
            >
              {updateMessage}
            </div>
          )}
          <div className="login-left">
            <div className="login-img container">
              {" "}
              <img src={LoginImg} alt="img" />{" "}
            </div>
          </div>
          <div className="login-right">
            <div className="login-close-btn">
            <i class="fa-solid fa-xmark"></i>
            </div>
            <h2 className="mb-1 fs-5 fw-bolder">Login to you account</h2>
            <form method="POST" className="login-form">
              <div className=" login-element">
                
                <i class=" pe-3 fa-solid fa-envelope"></i>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter email"
                  className="border-0"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className=" login-element">
              <i class=" pe-3 fa-solid fa-lock"></i>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter a password"
                  className="border-0"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="login-btn-container">
                <button
                  className="login-btn"
                  type="button"
                  onClick={loginUser}
                  disabled={loading}
                >
                  {loading ? <Loader /> : "Login"}{" "}
                  {/* Conditionally render text */}
                </button>
              </div>
              <p className="fs-9">
                <NavLink className="navbar-brand" to="/register">
                  {" "}
                  New to Invoicer? Create an account
                </NavLink>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
