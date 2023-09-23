import React, { useEffect, useState } from "react";
import "./product.css";
import Inventory from "./Inventory";
import { useNavigate } from "react-router-dom";

import { ClipLoader } from "react-spinners";

const Product = () => {
  const Navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedUserData, setEditedUserData] = useState(null);
  const [updateMessage, setUpdateMessage] = useState(null);

  useEffect(() => {
    if (updateMessage) {
      const timeoutId = setTimeout(() => {
        setUpdateMessage(null);
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [updateMessage]);

  const callProductPage = async () => {
    try {
      const res = await fetch("/product", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      setUserData(data);
      setEditedUserData(data);

      if (res.status !== 200) {
        throw new Error("Request error");
      }
    } catch (err) {
      console.log(err);
      Navigate("/login");
    }
  };

  useEffect(() => {
    callProductPage();
  }, []);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      email: e.target.email.value,
      number: e.target.number.value,
      gst: e.target.gst.value,
    };

    try {
      const res = await fetch("/update-data", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (res.status === 200) {
        setEditMode(false);
        callProductPage();
        setUpdateMessage("Details updated successfully.");
      } else {
        console.error("Failed to update data in the database");
        setUpdateMessage("Failed to update details. Please try again.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setUpdateMessage(" An error occurred. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <section className="product-box">
        <div className="product-container ">
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

          {userData ? (
            <form
              method="GET"
              className="product-form"
              onSubmit={handleFormSubmit}
            >
              <div className="name-address">
                <h4 className=" p-0 m-0">
                  <span>Welcome</span> {userData.bussinessName}
                </h4>
                <p className=""> {userData.address}</p>
              </div>
              
              <div className="">
                <div className="personal-info-1">
                  <input
                    type="email"
                    value={editMode ? editedUserData.email : userData.email}
                    className="form-control"
                    name="email"
                    disabled={!editMode}
                    onChange={handleInputChange}
                  />
                  <input
                    type="tel"
                    value={editMode ? editedUserData.number : userData.number}
                    className="form-control"
                    name="number"
                    disabled={!editMode}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="personal-info-2">
                  <input
                    type="text"
                    value={editMode ? editedUserData.gst : userData.gst}
                    className="form-control"
                    name="gst"
                    disabled={!editMode}
                    onChange={handleInputChange}
                  />
                  <div className="edit-save">
                    <button
                      type="button"
                      onClick={handleEditClick}
                      className="button edit-button btn btn-outline-primary"
                    >
                      Edit
                    </button>
                    <button
                      type="submit"
                      disabled={!editMode}
                      className={`button save-button btn btn-success ${
                        editMode ? "" : "disabled"
                      }`}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
              
              
            </form>
          ) : (
            <div className="loading-spinner">
              <ClipLoader color="#007bff" loading={true} size={30} />
            </div>
          )}
          <Inventory />
        </div>
      </section>
    </>
  );
};

export default Product;
