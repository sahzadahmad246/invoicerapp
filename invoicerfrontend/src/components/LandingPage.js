import React from 'react';
import './LandingPage.css'; // Create a CSS file for styling
import Landing from '../images/landing.png';
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const onButtonClick = () => {
    navigate("/register");
  };
  
  return (
    <div className="landing-page container">
      <div className="landing-content container">
        <h1>Generate Invoices <br/> with Ease</h1>
        <p>
          Say goodbye to manual invoicing. Our platform helps you generate
          professional invoices in seconds, so you can focus on your business.
        </p>
        <button onClick={onButtonClick} className="register-btn" type="button">
          Get Started <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
      <div className='landing-image '><img src={Landing} alt='Image'/></div>
    </div>
  );
};

export default LandingPage;
