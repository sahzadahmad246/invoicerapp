const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const authenticate = require("../middleware/authenticate");

require("../db/conn");
// const User = require("../models/userSchema");
const User = require("../models/userSchema");

console.log(User);

router.get("/", (req, res) => {
  res.send("Hello from back end router.js");
});

// using promises
// router.post('/register', (req, res) =>{
//     const { bussinessName, yourName, mobileNumber, email, password, address} = req.body

//     User.findOne({ email : email})
//     .then((userExist) =>{
//         if(userExist){
//             return res.status(422).json({email: "email already exist"});
//         }

//         const user = new User({bussinessName, yourName, mobileNumber, email, password, address});

//         user.save().then(() =>{
//             res.status(201).json({ message : "user registered successfully"})
//         }).catch((err) => res.status(500).json ({ message: "registration failed"}));
//     }).catch(err => {console.log(err); });
// })

// using async await

router.post("/register", async (req, res) => {
  const { bussinessName, number, email, gst, password, address } = req.body;

  if (!bussinessName || !number || !email || !gst || !password || !address) {
    res.status(422).json({ error: "Please fill all the field" });
    console.log("Please fill all the field");
  }
  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ email: "email already exist" });
    } else {
      const user = new User({
        bussinessName,
        number,
        email,
        gst,
        password,
        address,
      });
      await user.save();
      res.status(201).json({ message: "user registered successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});

// login route

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "please fill the data" });
    }
    // console.log("Attempting to find user with email:", email);
    const userLogin = await User.findOne({ email: email });
    // console.log("User found:", userLogin);

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);
      // console.log("isMatch:", isMatch);

      const token = await userLogin.generateAuthToken();
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });
      // console.log(userLogin.password);
      if (!isMatch) {
        res.status(400).json({ error: "invalid credentials " });
      } else {
        res.status(201).json({ message: "user signedin successfully " });
      }
    } else {
      res.status(400).json({ error: "invalid credentials " });
    }
  } catch (err) {
    console.error("Error during sign-in:", err);
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// sending data for product page
router.get("/product", authenticate, (req, res) => {
  res.send(req.rootUser);
});

// sending data for contact page
router.get("/getdata", authenticate, (req, res) => {
  console.log("contact  page");
  res.send(req.rootUser);
});

// getting contact data
router.post("/contact", authenticate, async (req, res) => {
  try {
    const { bussinessName, email, number, message } = req.body;

    if (!bussinessName || !email || !number || !message) {
      console.log("error sending message");
      return res.json({ error: " please fill the required field" });
    }

    const userContact = await User.findOne({ _id: req.userID });

    if (userContact) {
      const usermessage = await userContact.addMessage(
        bussinessName,
        email,
        number,
        message
      );
      await userContact.save();

      res.status(201).json({ message: "message sent successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});

// Logout functionality
router.get("/logout", authenticate, (req, res) => {
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("User Logged out");
});

// ... (other code)

// Update user data route
router.put("/update-data", authenticate, async (req, res) => {
  try {
    const { email, number, gst } = req.body;

    // Find the user by their ID
    const user = await User.findById(req.userID);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user data
    user.email = email;
    user.number = number;
    user.gst = gst;

    // Save the updated user data
    await user.save();

    res.status(200).json({ message: "User data updated successfully" });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/add-product", authenticate, async (req, res) => {
  try {
    const { productName, productDescription, price } = req.body;

    if (!productName || !productDescription || !price) {
      return res.status(422).json({ error: "Please fill all the fields" });
    }

    // Find the user by their ID
    const user = await User.findById(req.userID);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Use the addProduct method to add the product
    await user.addProduct(productName, productDescription, price);

    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch added product data
router.get("/fetch-added-products", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userID);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Extract product data from user
    const addedProducts = user.products;

    res.status(200).json({ addedProducts });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update product data route

router.put("/update-product/:productId", authenticate, async (req, res) => {
  try {
    const productId = req.params.productId;
    const { productName, productDescription, price } = req.body;

    if (!productName || !productDescription || !price) {
      return res.status(422).json({ error: "Please fill all the fields" });
    }

    const user = await User.findById(req.userID);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the product by its ID in the user's products array
    const productIndex = user.products.findIndex(
      (product) => product._id.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update product details
    user.products[productIndex].productName = productName;
    user.products[productIndex].productDescription = productDescription;
    user.products[productIndex].price = price;

    await user.save();

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/delete-product/:productId", authenticate, async (req, res) => {
  try {
    const productId = req.params.productId;

    const user = await User.findById(req.userID);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the index of the product to be deleted in the products array
    const productIndex = user.products.findIndex(
      (product) => product._id.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Remove the product from the products array
    user.products.splice(productIndex, 1);

    // Save the updated user object
    await user.save();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/products", async (req, res) => {
  const query = req.query.query || "";

  try {
    const products = await User.find({
      "products.productName": { $regex: query, $options: "i" },
    });

    res.status(200).json(products.map((user) => user.products).flat());
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Server error" });
  }
});

//  route to get  data from the databasefor InvoicePdf
router.get("/get-data", async (req, res) => {
  try {
    const users = await User.find(); // Retrieve all users from the collection
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Create a route to handle data sent from the frontend
router.post("/send-data-to-backend", authenticate, async (req, res) => {
  try {
    // Access the data sent from the frontend
    const {
      customerName,
      customerAddress,
      customerMobileNumber,
      invoiceNumber,
      selectedProducts,
      paymentType,
      gstAmount,
      subtotal,
      discount,
      total,
      dateAndTime,
    } = req.body;
    console.log(selectedProducts);
    if (
      !customerName ||
      !customerAddress ||
      !customerMobileNumber ||
      !invoiceNumber ||
      !selectedProducts ||
      !paymentType ||
      !gstAmount ||
      !subtotal ||
      !discount ||
      !total ||
      !dateAndTime
    ) {
      return res.status(422).json({ error: "Please fill all the fields" });
    }

    // Find the user by their ID
    const user = await User.findById(req.userID);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Use the addProduct method to add the product
    await user.addInvoiceData(
      customerName,
      customerAddress,
      customerMobileNumber,
      invoiceNumber,
      selectedProducts,
      paymentType,
      gstAmount,
      subtotal,
      discount,
      total,
      dateAndTime,
    );

    res.status(200).json({ message: "Invoice saved successfully" });
  } catch (error) {
    // Handle errors and respond with an error message
    console.error("Error saving data:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// sending invoice data to history pagefrom data base

// Add this route to your router.js or invoice.js file (wherever your other routes are defined)
router.get("/get-invoice-data", authenticate, async (req, res) => {
  try {
    // Find the user by their ID
    const user = await User.findById(req.userID);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Retrieve the invoiceData from the user (assuming it's an array in your schema)
    const invoiceData = user.invoiceData;

    // Respond with the retrieved invoiceData
    res.status(200).json({ invoiceData });
  } catch (error) {
    // Handle errors and respond with an error message
    console.error("Error fetching invoice data:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Create a route to get the latest saved invoiceNumber
// Add this route to your router.js or invoice.js file
router.get("/get-latest-invoice-number", authenticate, async (req, res) => {
  try {
    // Find the user by their ID
    const user = await User.findById(req.userID);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Retrieve the invoiceData from the user (assuming it's an array in your schema)
    const invoiceData = user.invoiceData;

    // Sort the invoiceData array by invoiceNumber in descending order
    invoiceData.sort((a, b) => b.invoiceNumber - a.invoiceNumber);

    // Get the latest invoiceNumber
    const latestInvoiceNumber =
      invoiceData.length > 0 ? invoiceData[0].invoiceNumber : 10001;

    // Respond with the latest invoiceNumber
    res.status(200).json({ latestInvoiceNumber });
  } catch (error) {
    // Handle errors and respond with an error message
    console.error("Error fetching latest invoice number:", error);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
