import React, { useEffect, useState } from "react";
import "./History.css";

const History = () => {
  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [openDropdowns, setOpenDropdowns] = useState([]); 

  const toggleDropdown = (index) => {
    
    const updatedOpenDropdowns = [...openDropdowns];
    
    updatedOpenDropdowns[index] = !updatedOpenDropdowns[index];
    setOpenDropdowns(updatedOpenDropdowns);
  };

  useEffect(() => {
    
    fetch("/get-invoice-data")
      .then((response) => response.json())
      .then((data) => {
       
        const initialOpenDropdowns = new Array(data.invoiceData.length).fill(
          false
        );
        setOpenDropdowns(initialOpenDropdowns);
        setInvoiceData(data.invoiceData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching invoice data:", error);
      });
  }, []);

  const filteredInvoices = invoiceData.filter((invoice) => {
    const searchTermLowerCase = searchTerm.toLowerCase();

    
    return (
      invoice.customerName.toLowerCase().includes(searchTermLowerCase) ||
      invoice.customerMobileNumber
        .toString()
        .toLowerCase()
        .includes(searchTermLowerCase) ||
      invoice.invoiceNumber
        .toString()
        .toLowerCase()
        .includes(searchTermLowerCase)
    );
  });

  return (
    <>
      <div className="search-container">{/* Search input */}</div>
      <div className="product-search">
        <input
          type="text"
          placeholder="Search invoices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <i class="fa-solid fa-magnifying-glass"></i>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          
          {filteredInvoices.map((invoice, index) => (
            <div key={invoice._id}>
              <div className="history dropdown-center">
                <div className="dropdown-top">
                  <div className="dropdown-left">
                    <div className="fw-bold">
                      {invoice.customerName}{"   "}
                      <span className="fs-6 px-2 fw-light number-in-history">
                        {invoice.customerMobileNumber}
                      </span>
                    </div>
                    <div className="fs-6 fw-light number-in-history">
                      <div>{invoice.dateAndTime}</div>
                    </div>
                  </div>
                  <div className="dropdown-right">
                    <div>{invoice.invoiceNumber}</div>
                    <button onClick={() => toggleDropdown(index)}>
                      <i className="fa-solid fa-caret-down"></i>
                    </button>
                  </div>
                </div>
                <div
                  className={`history-box ${
                    openDropdowns[index] ? "open" : ""
                  }`}
                >
                  <div className="d-flex justify-content-between p-2 dropdown-bottom">
                    <div>
                      {invoice.selectedProducts.map((product, index) => (
                        <li key={index}>
                          <div className="fw-ligher fs-">
                            {product.productName}
                          </div>
                          {product.imei && (
                            <div className="in-history">
                              {product.productDescription}  {product.imei}
                            </div>
                          )}
                        </li>
                      ))}
                    </div>
                    <div>
                      {invoice.selectedProducts.map((product, index) => (
                        <li key={index}>
                          <div className="in-history">₹{product.price}</div>
                        </li>
                      ))}
                    </div>
                  </div>
                  <div className="border-top p-2 d-flex justify-content-between">
                    <div className="in-history">Discount</div>
                    <div className="in-history">₹{invoice.discount}</div>
                  </div>
                  <div className="border-top p-2 d-flex justify-content-between">
                    <div className="in-history">Total after discount</div>
                    <div className="in-history">₹{invoice.total}</div>
                  </div>
                  <div className="border-top p-2 d-flex justify-content-between">
                    <div className="in-history">Payment Type</div>
                    <div className="in-history">{invoice.paymentType}</div>
                  </div>
                  <div className="border-top text-success p-2 d-flex justify-content-start">
                    <div className="note">
                      {" "}
                      <i class="fa-solid pe-1 text-dark fa-circle-info"></i>{" "}
                      Please note total amount includes 18% GST
                    </div>
                  </div>
                  <div className="border-top text-success p-2 d-flex justify-content-center">
                    <button className=" bg-success rounded  text-light copy-download">
                      Download Copy <i className="fa-solid fa-download"></i>{" "}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default History;
