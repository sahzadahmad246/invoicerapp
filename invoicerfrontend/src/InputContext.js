import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
  customerName: '',
  mobileNumber: '',
  customerAddress: '',
  imei: '',
  paymentMode: '',
  selectedProducts: [],
  discountType: 'percent', // Include discountType in the initial state
  discountValue: '',       // Include discountValue in the initial state
};

const reducer = (state, action) => {
  if (action.type === 'USER') {
    return {
      ...state,
      ...action.payload,
    };
  } else if (action.type === 'PRODUCT') {
    return {
      ...state,
      selectedProducts: action.payload.selectedProducts,
    };
  } else if (action.type === 'DISCOUNT') { // Handle discount type and value
    return {
      ...state,
      discountType: action.payload.discountType,
      discountValue: action.payload.discountValue,
    };
  }
  return state;
};

const InputContext = createContext();

export const InputProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <InputContext.Provider value={{ state, dispatch }}>
      {children}
    </InputContext.Provider>
  );
};

export const useInputContext = () => {
  return useContext(InputContext);
};
