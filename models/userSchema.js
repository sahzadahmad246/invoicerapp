const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  bussinessName: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  gst: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  messages: [
    {
      bussinessName: {
        type: String,
        required: true,
      },
      number: {
        type: Number,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
    },
  ],
  products: [
    {
      productName: {
        type: String,
        required: true,
      },
      productDescription: {
        type: String,
        required: true,
      },
      price: {
        type: String, // Or any appropriate type for price
        required: true,
      },
    },
  ],
  invoiceData: [
    {
      customerName: {
        type: String,
        required: true,
      },
      customerAddress: {
        type: String,
        required: true,
      },
      customerMobileNumber: {
        type: String,
        required: true,
      },
      invoiceNumber: {
        type: Number,
        required: true,
      },
      selectedProducts: [
        {
          productName: {
            type: String,
            required: true,
          },
          productDescription: {
            type: String,
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
          imei: {
            type: Number,
           
          },
        },
      ],
      paymentType: {
        type: String,
        required: true,
      },
      gstAmount: {
        type: Number,
        required: true,
      },
      subtotal: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
      dateAndTime: {
        type: String,
        
      },
    },
  ],
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// hashing the password
userSchema.pre("save", async function (next) {
  console.log("hi from inside");
  if (this.isModified("password")) {
    // Corrected typo here
    try {
      this.password = await bcrypt.hash(this.password, 12);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// generating token
userSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
    console.error("Error generating token:", err);
  }
};

userSchema.methods.addMessage = async function (
  bussinessName,
  email,
  number,
  message
) {
  try {
    this.messages = this.messages.concat({
      bussinessName,
      email,
      number,
      message,
    });
    await this.save();
    return this.messages;
  } catch (error) {
    console.log(error);
  }
};

userSchema.methods.addProduct = async function (
  productName,
  productDescription,
  price
) {
  try {
    this.products.push({
      productName,
      productDescription,
      price,
    });
    await this.save();
    return this.products; // Return the updated products array
  } catch (error) {
    console.log(error);
  }
};

userSchema.methods.addInvoiceData = async function (
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
  dateAndTime
) {
  try {
    this.invoiceData.push({
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
    });
    await this.save();
    return this.invoiceData; // Return the updated products array
  } catch (error) {
    console.log(error);
  }
};

const User = mongoose.model("User", userSchema); // Changed 'USER' to 'User'

module.exports = User;
