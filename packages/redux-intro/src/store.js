import { combineReducers, createStore } from "redux";
import reducer, { deposit, requestLoan, withdraw } from "./features/account/accountSlice";
import customerReducer, { createCustomer, updateName } from "./features/customer/customerSlice";

import { thunk } from "redux-thunk";
import { applyMiddleware } from "redux";

import { composeWithDevTools } from "redux-devtools-extension";
import { configureStore } from "@reduxjs/toolkit";
//createStore --> configureStore (the 2d more automatic and modern)
const rootReducer = combineReducers({
  account: reducer,
  customer: customerReducer,
});
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));


// store.dispatch(deposit(500));
// store.dispatch(withdraw(100));
// store.dispatch(requestLoan(200, "mas cocaine"));

// store.dispatch(createCustomer("Pedro", "12343"));
// store.dispatch(updateName("Termiz"));
//store.dispatch(createCustomer("Pedro", "12343"));
// store.dispatch(updateName("Termiz"));

// console.log(store.getState());

export default store;

//The store will pass the action to all the 
//reducers that were combined and inputed to the
//createStore function


//REDUX TOOL KIT: RTK

//REDUX + REDUX-THUNK + REDUX-DEVTOOLS-EXTENSION

//Action creators are automatically built
//Converts mutating logic into non mutation logic using Immer library