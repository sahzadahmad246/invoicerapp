import React, { useState, useEffect } from "react";
import "./Inventory.css";

const Inventory = () => {
  const [price, setPrice] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [addedProducts, setAddedProducts] = useState([]);
  const [searchBox, setSearchBox] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updateMessage, setUpdateMessage] = useState(null);
  const [selectedProductForDelete, setSelectedProductForDelete] =
    useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    if (updateMessage) {
      const timeoutId = setTimeout(() => {
        setUpdateMessage(null);
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [updateMessage]);

  const handlePriceChange = (e) => {
    const input = e.target.value;

    // Remove non-numeric characters except dots (.) to allow decimals
    const numericInput = input.replace(/[^0-9.]/g, "");

    // Ensure there's only one dot (.) to allow decimals
    const decimalCount = numericInput.split(".").length - 1;
    const formattedInput =
      decimalCount > 1 ? numericInput.slice(0, -1) : numericInput;

    setPrice(formattedInput);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/add-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName,
          productDescription,
          price,
        }),
      });

      if (response.status === 201) {
        console.log("Product added successfully");
        const newProduct = {
          productName,
          productDescription,
          price,
        };
        setAddedProducts([...addedProducts, newProduct]); // Add new product to state
        // Clear the input fields after successful submission
        setProductName("");
        setProductDescription("");
        setPrice("");
        window.alert("Product added successfully!");
      } else {
        console.error("Error adding product");
        window.alert("Failed to add product. Please try again.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      window.alert("An error occurred while adding the product.");
    }
  };

  const fetchAddedProducts = async () => {
    try {
      const response = await fetch("/fetch-added-products", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.status === 200) {
        const data = await response.json();
        setAddedProducts(data.addedProducts);
      }
    } catch (error) {
      console.error("Error fetching added products:", error);
    }
  };

  useEffect(() => {
    fetchAddedProducts(); // Fetch added products when component mounts
  }, []);

  useEffect(() => {
    const filtered = addedProducts.filter(
      (product) =>
        product.productName.toLowerCase().includes(searchBox.toLowerCase()) ||
        product.productDescription
          .toLowerCase()
          .includes(searchBox.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchBox, addedProducts]);

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setProductName(product.productName);
    setProductDescription(product.productDescription);
    setPrice(product.price);
  };

  const handleUpdateClick = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/update-product/${selectedProduct._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName,
          productDescription,
          price,
        }),
      });

      if (response.status === 200) {
        // console.log("Product updated successfully");
        setUpdateMessage("Item updated successfully.");
        // Update the product details in the addedProducts state
        const updatedProducts = addedProducts.map((product) =>
          product._id === selectedProduct._id
            ? {
                ...product,
                productName,
                productDescription,
                price,
              }
            : product
        );
        setAddedProducts(updatedProducts);
        setSelectedProduct(null); // Clear selected product
      } else {
        console.error("Error updating product");
        setUpdateMessage("Failed to update item. Please try again.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setUpdateMessage("An error occurred. Please try again.");
    }
  };

  // deleting the product
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/delete-product/${productToDelete._id}`, {
        method: "DELETE",
      });

      if (response.status === 200) {
        console.log("Product deleted successfully");
        const updatedProducts = addedProducts.filter(
          (product) => product._id !== productToDelete._id
        );
        setAddedProducts(updatedProducts);
        setProductToDelete(null); // Clear the productToDelete state
        setDeleteModalVisible(false); // Close the modal
      } else {
        console.error("Error deleting product");
        // Handle error scenario here
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      // Handle error scenario here
    }
  };

  return (
    <>
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
      <form>
        <div className="add-product">
          <div className="add-product-box">
            <div className="product-top">
              <h5 className="">Enter Product details to add in Inventory</h5>
            </div>
            <div className="product-rows">
              <div className="product-row">
                <input
                  type="text"
                  name="productName"
                  placeholder="Product Name"
                  className="form-control"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
                <div className="price-input-container">
                  <span className="inr-symbol">₹</span>
                  <input
                    type="text"
                    name="Description"
                    placeholder="Set Price"
                    className="price-input"
                    onChange={handlePriceChange}
                    value={price}
                  />
                </div>
              </div>
              <div className="product-row">
                <input
                  type="text"
                  name="productDescription"
                  placeholder="Description"
                  className="form-control"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                />
                <input
                  type="submit"
                  value="Add Product"
                  className="add-btn btn btn-dark"
                  onClick={handleAddProduct}
                />
              </div>
            </div>
          </div>
          <hr />
          <div className="added-product">
            <div className="product-search">
              <input
                className=""
                type="text"
                name="searchBox"
                placeholder="Search Product"
                value={searchBox}
                onChange={(e) => setSearchBox(e.target.value)}
              />
              <button className="btn btn-success">Search</button>
              <i class="fa-solid fa-magnifying-glass"></i>
            </div>
            <div className="added-product-list">
              {filteredProducts.length === 0 ? (
                <p className="no-product-message text-center m-4 fs-4">
                  No products found.
                </p>
              ) : (
                filteredProducts.map((product, index) => (
                  <div key={index} className="product-card">
                    {selectedProduct && selectedProduct._id === product._id ? (
                      // Display edit form when selected product matches
                      <div className="update-boxes">
                        <div className="product-row">
                          <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            className="form-control update-box"
                          />
                          <input
                            type="text"
                            value={productDescription}
                            onChange={(e) =>
                              setProductDescription(e.target.value)
                            }
                            className="form-control update-box"
                          />
                        </div>
                        <div className="product-row">
                          <input
                            type="text"
                            value={price}
                            onChange={handlePriceChange}
                            className="form-control update-box"
                          />
                          <input
                            type="submit"
                            value="Update"
                            className="add-btn btn btn-dark update-box"
                            onClick={handleUpdateClick}
                          />
                        </div>
                      </div>
                    ) : (
                      // Display product info and dropdown when not editing
                      <>
                        <div className="product-info">
                          <h6 className="">{product.productName}</h6>
                          <p className="">{product.productDescription}</p>
                        </div>
                        <div className="edit-delete">
                          <p>₹{product.price}</p>
                          <div className="dropdown ">
                            <button
                              className=" btn  dropdown-toggle m-0 p-0"
                              data-bs-toggle="dropdown"
                            ></button>
                            <ul className="dropdown-menu ">
                              <li
                                className="dropdown-item"
                                onClick={() => handleEditClick(product)}
                              >
                                Edit
                              </li>
                              <li
                                className="dropdown-item"
                                onClick={() => handleDeleteClick(product)}
                              >
                                Delete
                              </li>
                            </ul>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
              {deleteModalVisible && (
                <div
                  className="modal fade show"
                  tabIndex="-1"
                  role="dialog"
                  style={{ display: "block" }}
                >
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Confirm Deletion</h5>
                        <button
                          type="button"
                          className="close"
                          onClick={() => setDeleteModalVisible(false)}
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        Are you sure you want to delete this product?
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setDeleteModalVisible(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={handleDeleteConfirm}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Inventory;
