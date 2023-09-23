const dataToSend = {
  customerName: state.customerName,
  customerAddress: state.customerAddress,
  customerMobileNumber: state.mobileNumber,
  invoiceNumber: invoiceNumber,
  selectedProducts: state.selectedProducts,
  paymentType: state.paymentMode,
  gstAmount: gstAmount,
  subtotal: totalAmountBeforeTax,
  discount: discountAmount,
  total: totalAmount,
  dateAndTime: formatDate(currentDateTime),
  
};