const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
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
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
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
  
});

const InvoiceData = mongoose.model("Invoice", invoiceSchema);

module.exports = InvoiceData;
