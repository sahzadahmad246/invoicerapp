import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Contact.css"; // Create this CSS file for custom styling
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const Contact = () => {
  const Navigate = useNavigate();
  const [userData, setUserData] = useState({
    bussinessName: "",
    email: "",
    number: "",
    message: "",
  });

  const userContact = async () => {
    try {
      const res = await fetch("/getdata", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      console.log(data);
      setUserData({...userData, bussinessName: data.bussinessName,
        email:data.email,
        number:data.number})

      if (res.status !== 200) {
        const error = new Error("Request error");
        throw error;
      }
    } catch (err) {
      console.log(err);
      Navigate("/login");
    }
  };

  useEffect(() => {
    userContact();
  }, []);

  const handleInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setUserData({
      ...userData, [name]:value
    });
  };

//   sending data to backend

const handleContactSubmit =  async (e) =>{
    e.preventDefault();
    const {bussinessName, email, number, message} = userData; 

    const res = await fetch('/contact' , {
        method:"POST",
        headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bussinessName,
            number,
            email,
            message
          })
    })

    const data = res.json();

    if(!data){
        alert("message not sent")
    }else{
        alert("message sent")
        setUserData({...userData, message: ""})
    }
}

  return (
    <div className="contact-container ">
      {userData ? (
        <form className="contact-form " method="POST">
          <h2 className="mb-4">Get in Touch</h2>
          {userData && (
            <div className="row mb-5">
              <div className="col-md-4">
                <div className="form-group">
                  <input
                    type="text"
                    value={userData.bussinessName}
                    className="form-control"
                    name="bussinessName"
                    onChange={handleInputs}
                    placeholder="Business Name"
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <input
                    type="email"
                    value={userData.email}
                    className="form-control"
                    name="email"
                    onChange={handleInputs}
                    placeholder="Email"
                  />
                </div>
              </div>
              <div className="col-md-4 text-area">
                <div className="form-group">
                  <input
                    type="tel"
                    onChange={handleInputs}
                    value={userData.number}
                    className="form-control"
                    name="number"
                    placeholder="Number"
                  />
                </div>
              </div>
            </div>
          )}
          <div className="form-group">
            <textarea
              className="form-control mb-5"
              id="message"
              value={userData.message}
              onChange={handleInputs}
              name="message"
              rows="5"
              placeholder="Type your lovely message here..."
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary" onClick={handleContactSubmit}>
            Send Message
          </button>
        </form>
      ) : (
        <div className="loading-spinner">
          <ClipLoader color="#007bff" loading={true} size={30} />
        </div>
      )}
    </div>
  );
};

export default Contact;
