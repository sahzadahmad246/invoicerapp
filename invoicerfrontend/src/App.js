import React, { createContext, useReducer } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Pricing from "./components/Pricing";
import Product from "./components/Product";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Home from "./components/Home";
import History from "./History";
import Register from "./components/Register";
import { InputProvider, useInputContext } from "./InputContext"; // Import InputProvider and useInputContext
import InvoicePDF from "./components/InvoicePDF";

// Define your initial state and reducer here
const initialState = {};
const reducer = (state, action) => {
  // Define your reducer logic here
  if (action.type === "USER") {
    return action.payload;
  }

  return state;
};

export const userContext = createContext();

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/product" element={<Product />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/history" element={<History />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/invoice-pdf" element={<InvoicePDF />} />
    </Routes>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <userContext.Provider value={{ state, dispatch }}>
      {/* Wrap the whole App content with InputProvider */}
      <InputProvider>
        <Nav />
        <Routing />
      </InputProvider>
    </userContext.Provider>
  );
}

export default App;
