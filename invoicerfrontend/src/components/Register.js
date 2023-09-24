import React, { useState, useEffect } from "react";
import "./Register.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, useNavigate} from "react-router-dom";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';




import Signup from "../images/signup.png";


const Register = () => {
  const Navigate = useNavigate();
  const [user, setUser] = useState({
    bussinessName: "", number: "", email: "", gst: "", password: "", address: ""
  });
  const [updateMessage, setUpdateMessage] = useState(null);

  useEffect(() => {
    if (updateMessage) {
      const timeoutId = setTimeout(() => {
        setUpdateMessage(null);
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [updateMessage]);

  let name, value;
  const handleInputs = (e) =>{
    name = e.target.name;
    value = e.target.value;

    setUser ({...user, [name]:value});
  };

  
  

  const PostData = async (e) => {
    e.preventDefault();
    const { bussinessName, number, email, gst, password, address } = user;
  
    try {
      const res = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bussinessName,
          number,
          email,
          gst,
          password,
          address,
        }),
      });
  
      const data = await res.json();
  
      if (res.status === 422) {
        if (data.error === "Please fill all the field") {
          // window.alert("Please fill all the required fields");
          setUpdateMessage("Please fill all the required fields");
        } else if (data.email === "email already exist") {
          // window.alert("Email already exists");
          setUpdateMessage("Email already exists, use a different email or Login");
        } else {
          // window.alert("Registration Failed");
          setUpdateMessage("Registration Failed");
        }
      } else if (res.status === 201) {
        // window.alert("Registration Success");
        setUpdateMessage("Registration Success");
        Navigate("/login");
      }
    } catch (error) {
      // console.error("Error during registration:", error);
      setUpdateMessage("Registration Failed");
    }
  };
  
  

  return (
    <>
      <section className=" resgister-box">
        <div className=" form-container container ">
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
          <div className="left-register">
            <h2 className="mb-1 fs-5 fw-bolder">Sign up</h2>
            <form method="POST">
              <div className=" form-element">
                
                <i class=" pe-3 fa-solid fa-building"></i>
                <input
                  type="text"
                  name="bussinessName"
                  id="bussinessName"
                  placeholder="Enter bussiness name"
                  className="border-0"
                  autoComplete="off"
                  value={user.name}
                  onChange={handleInputs}
                />
              </div>
              <div className=" form-element">
                
                <i class=" pe-3 fa-solid fa-mobile"></i>
                <input
                  type="number"
                  name="number"
                  id="number"
                  placeholder="Enter mobile number"
                  className="border-0"
                  autoComplete="off"
                  value={user.number}
                  onChange={handleInputs}
                />
              </div>
              <div className=" form-element">
                
                <i class=" pe-3 fa-solid fa-envelope"></i>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter email"
                  className="border-0"
                  autoComplete="off"
                  value={user.email}
                  onChange={handleInputs}
                />
              </div>
              <div className=" form-element">
                
                <i class=" pe-3 fa-solid fa-dollar-sign"></i>
                <input
                  type="text"
                  name="gst"
                  id="gst"
                  placeholder="Enter GSTIN"
                  className="border-0"
                  autoComplete="off"
                  value={user.gst}
                  onChange={handleInputs}
                />
              </div>
              <div className=" form-element">
          
                <i class=" pe-3 fa-solid fa-lock"></i>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Set a password"
                  className="border-0"
                  autoComplete="off"
                  value={user.password}
                  onChange={handleInputs}
                />
              </div>
              <div className=" form-element">
               
                <i class=" pe-3 fa-solid fa-home"></i>
                <input
                  type="text"
                  name="address"
                  id="address"
                  placeholder="Enter bussiness address"
                  className="border-0"
                  autoComplete="off"
                  value={user.address}
                  onChange={handleInputs}
                />
              </div>
              <input
                className="register-btn"
                type="submit"
                name="signup"
                value="Register"
                onClick={PostData}
              />
              <p className="already-registered">
              <NavLink className="navbar-brand" to="/login">
                I'm already registered
              </NavLink>
            </p>
            </form>
          </div>
          <div className="right-register">
            <div className="close-btn">
            <i class="fa-solid fa-xmark"></i>
            </div>
            <div className="signup-img container ms-5">
              {" "}
              <img src={Signup} alt="img" />{" "}
            </div>
            <p>
              <NavLink className="navbar-brand" to="/login">
                I'm already registered
              </NavLink>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
