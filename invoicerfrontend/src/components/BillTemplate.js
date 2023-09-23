import React, { useState } from "react";
import { useInputContext } from "../InputContext";
import { QrReader } from "react-qr-reader";
import { useNavigate } from "react-router-dom";

import "./BillTemplate.css";
// import BarcodeScanner from "../components/BarcodeScanner";

const BillTemplate = () => {
  const { state, dispatch } = useInputContext();
  const [selectProduct, setSelectProduct] = useState("");
  const [matchedProducts, setMatchedProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [discount, setDiscount] = useState("");
  const [discountType, setDiscountType] = useState("amount");
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
  const [imeiValues, setImeiValues] = useState({});
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedIMEI, setScannedIMEI] = useState("");
  const [qrScannerVisible, setQrScannerVisible] = useState(false);
  const [torchEnabled, setTorchEnabled] = useState(false); // State to control the flashlight
 

  // Function to handle QR code scan
  const handleScan = (data) => {
    if (data) {
      setScannedIMEI(data);
    }
  };

  // Function to handle QR code scanner errors
  const handleError = (error) => {
    console.error("QR Code Scanner Error:", error);
    // Handle errors here, such as displaying an error message to the user
  };

  // Function to start QR code scanning with flashlight
  const startScanning = () => {
    setIsScanning(true);
    setTorchEnabled(true); // Enable the flashlight
    setQrScannerVisible(true); // Show the QR scanner
  };

  // Function to stop QR code scanning and turn off flashlight
  const stopScanning = () => {
    setIsScanning(false);
    setTorchEnabled(false); // Disable the flashlight
    setQrScannerVisible(false); // Hide the QR scanner
  };
  const handleDiscountTypeChange = (e) => {
    const selectedType = e.target.value;
    setDiscountType(selectedType);

    // Dispatch the discount type to the context
    dispatch({
      type: "DISCOUNT",
      payload: { discountType: selectedType, discountValue: discount },
    });
  };

  // Define a function to check if all required fields are filled
  const areAllFieldsFilled = () => {
    return (
      state.customerName.trim() !== "" &&
      state.mobileNumber.trim() !== "" &&
      state.customerAddress.trim() !== "" &&
      state.paymentMode !== "NA"
    );
  };

  // // Handle "Continue" button click
  // const handleContinueClick = () => {
  //   if (areAllFieldsFilled()) {
  //     // All required fields are filled, proceed to navigate
  //     navigate("/invoice-pdf");
  //   } else {
  //     // Show an alert or error message indicating that all required fields must be filled
  //     alert("Please fill in all required fields before continuing.");
  //   }
  // };

  const handleDiscountChange = (e) => {
    const discountValue = e.target.value;
    setDiscount(discountValue);
    setIsDiscountApplied(false); // Reset the discount applied status

    // Dispatch the discount value to the context
    dispatch({
      type: "DISCOUNT",
      payload: { discountType, discountValue },
    });
  };

  // Step 4: Add a function to apply the discount
  const applyDiscount = () => {
    // Apply the discount based on the selected discount type
    let discountedPrice = parseFloat(state.totalPrice);

    if (discountType === "amount") {
      discountedPrice -= parseFloat(discount);
    } else if (discountType === "percent") {
      const discountPercentage = parseFloat(discount);
      if (
        !isNaN(discountPercentage) &&
        discountPercentage > 0 &&
        discountPercentage <= 100
      ) {
        const discountAmount = (discountPercentage / 100) * state.totalPrice;
        discountedPrice -= discountAmount;
      }
    }

    // Update the context state with the discounted price
    dispatch({
      type: "USER",
      payload: { totalPrice: discountedPrice.toFixed(2) }, // Assuming you have a totalPrice field in your context
    });

    setIsDiscountApplied(true); // Set the discount applied status
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch({
      type: "USER",
      payload: { [name]: value },
    });
  };

  const transferDataToInvoicePDF = () => {
    // Create an array to store selected product data including IMEI
    const selectedProductData = selectedProducts.map((product) => ({
      ...product,
      imei: imeiValues[product._id] || "",
    }));

    // Dispatch the current input data to the context, including selected products with IMEI
    dispatch({
      type: "USER",
      payload: {
        customerName: state.customerName,
        mobileNumber: state.mobileNumber,
        customerAddress: state.customerAddress,
        paymentMode: state.paymentMode,
        selectedProducts,
      },
    });
  };

  const handleSelectProductChange = (event) => {
    const inputText = event.target.value;
    setSelectProduct(inputText);

    if (inputText.trim() === "") {
      setMatchedProducts([]); // Clear matched products when input is empty
    } else {
      performSearch(inputText);
    }
  };

  const performSearch = async (query) => {
    try {
      const response = await fetch(`/products?query=${query}`);
      const data = await response.json();
      setMatchedProducts(data);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const handleSelectProduct = (product) => {
    if (!selectedProducts.some((p) => p._id === product._id)) {
      const updatedProduct = {
        ...product,
        imei: "", // Initialize IMEI as an empty string
      };

      setSelectedProducts([...selectedProducts, updatedProduct]);
      setSelectProduct(""); // Clear the search input
      setMatchedProducts([]); // Clear the matched products

      // Add the selected product (including IMEI) to the context state
      dispatch({
        type: "PRODUCT",
        payload: { selectedProducts: [...selectedProducts, updatedProduct] },
      });
    }
  };

  const handleImeiChange = (product, imei) => {
    // Update the IMEI values state
    setImeiValues((prevState) => ({
      ...prevState,
      [product._id]: imei,
    }));

    // Find the index of the product in the selectedProducts array
    const productIndex = selectedProducts.findIndex(
      (p) => p._id === product._id
    );

    // Create a copy of the selected products array with the updated IMEI
    const updatedSelectedProducts = [...selectedProducts];
    updatedSelectedProducts[productIndex] = {
      ...updatedSelectedProducts[productIndex],
      imei,
    };

    // Dispatch the updated selected products to the context
    dispatch({
      type: "PRODUCT",
      payload: {
        selectedProducts: updatedSelectedProducts,
      },
    });
  };

  const handleRemoveProduct = (product) => {
    const updatedSelectedProducts = selectedProducts.filter(
      (p) => p._id !== product._id
    );
    setSelectedProducts(updatedSelectedProducts);
  };
  return (
    <>
      <div className="  main-template rounded">
        <div className="top-template p-2 rounded-top">
          <h4>Customer Details</h4>
        </div>
        <div className=" cust-details mt-3 ">
          <input
            className="p-2 form-control"
            type="text"
            name="customerName"
            placeholder="Name"
            value={state.customerName}
            onChange={handleInputChange}
          />
          <input
            type="tel"
            className=" form-control p-2 m-1"
            placeholder="Mobile Number"
            name="mobileNumber"
            value={state.mobileNumber}
            onChange={handleInputChange}
          />
        </div>
        <div className="address mt-3">
          <textarea
            className="p-2 m-1 form-control"
            placeholder="Address e.g. Flat 902 Vijay Apartment, Hiraranandani Estate 400607"
            name="customerAddress"
            value={state.customerAddress}
            onChange={handleInputChange}
          />
        </div>
        <div className="prdct-details mt-3">
          <div className="d-flex prdct-details-cont">
            <input
              className="p-2 m-1 form-control"
              type="text"
              name="selectProduct"
              placeholder="Select Product"
              value={selectProduct}
              onChange={handleSelectProductChange}
            />
            <i
              className="fa-solid fa-magnifying-glass"
              onClick={performSearch}
            ></i>
          </div>
          <div className="matched-selected-prdct">
            {selectProduct && matchedProducts.length > 0 && (
              <div className="matched-products">
                {matchedProducts.map((product) => (
                  <div
                    key={product._id}
                    className="product-item"
                    onClick={() => handleSelectProduct(product)}
                  >
                    <div className="matched-product">
                      <div className="matched-pn-pd">
                        <h6>{product.productName} </h6>
                        <p>{product.productDescription}</p>
                      </div>
                      <div className="matched-pp">{product.price}</div>
                    </div>
                    <div className="hr"></div>
                  </div>
                ))}
              </div>
            )}
            <div className="selected-products">
              {selectedProducts.map((product) => (
                <div>
                  <div key={product._id} className="selected-product">
                    <div className="matched-product-info">
                      <h6>{product.productName}</h6>
                      <p>{product.productDescription}</p>
                    </div>
                    <div className="product-price">
                      <i
                        className="fa-solid fa-xmark"
                        onClick={() => handleRemoveProduct(product)}
                      ></i>
                      <p>₹{product.price}</p>
                    </div>
                  </div>
                  <div className="imei container">
                    <input
                      className=""
                      type="number"
                      name={`imei-${product._id}`}
                      value={imeiValues[product._id] || scannedIMEI || ""}
                      placeholder="Scan or type IMEI"
                      onChange={(e) =>
                        handleImeiChange(product, e.target.value)
                      }
                    />
                    <i
                      className="fa-solid fa-qrcode"
                      onClick={startScanning} // Start QR code scanning when clicking the icon
                    ></i>
                  </div>
                  {/* Render the QR code scanner when scanning is active */}
                  {isScanning && qrScannerVisible && (
          <div className="qr-scanner">
            <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              torchMode={torchEnabled ? "torch" : undefined} // Control the flashlight
              style={{ width: "100%" }}
            />
            <button onClick={stopScanning}>Stop Scanning</button>
          </div>
        )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="discount  container">
          {/* Step 3: Add radio buttons for discount type */}
          <div className="discount-type">
            <label className="mr-3">
              <input
                type="radio"
                name="discountType"
                value="amount"
                checked={discountType === "amount"}
                onChange={handleDiscountTypeChange}
              />{" "}
              Amount
            </label>
            <label>
              <input
                type="radio"
                name="discountType"
                value="percent"
                checked={discountType === "percent"}
                onChange={handleDiscountTypeChange}
              />{" "}
              Percent
            </label>
          </div>

          {/* Step 4: Add the discount input field */}
          <div className="discount-input">
            <input
              className="p-2 m-1 form-control"
              type="text"
              name="discount"
              placeholder={
                discountType === "amount"
                  ? "Discount Amount"
                  : "Discount Percent"
              }
              value={discount}
              onChange={handleDiscountChange}
            />

            {/* Step 4: Add the Apply Discount button */}
            <button
              className="apply-discount-button"
              onClick={applyDiscount}
              disabled={isDiscountApplied} // Disable the button if discount is applied
            >
              {isDiscountApplied ? "Applied" : "Apply"}
            </button>
          </div>
        </div>

        <div className="bottom-template mt-3 container">
          <select
            id="dropdown"
            className="p-2 m-1"
            name="paymentMode"
            value={state.paymentMode}
            onChange={handleInputChange}
          >
            <option value="NA" className="m-3">
              Payment Mode
            </option>
            <option value="Cash">Cash</option>
            <option value="Installment">Installment</option>
            <option value="Online">Online</option>
          </select>
          <button
            className=""
            onClick={() => {
              if (areAllFieldsFilled()) {
                navigate("/invoice-pdf");
              } else {
                alert("Please fill in all required fields before navigating.");
              }
            }}
          >
            Continue to print
          </button>
        </div>
      </div>
    </>
  );
};

export default BillTemplate;
