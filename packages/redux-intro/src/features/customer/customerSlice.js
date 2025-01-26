//In the best case almost all the redux logic comes here

import { createSlice } from "@reduxjs/toolkit";

const initialStateCustomer = {
  fullName: "",
  nationalID: "",
  createdAt: "",
};

const customerSlice = createSlice(
  {
    name: "customer",
    initialState: initialStateCustomer,
    reducers: {
      createCustomer: {
        prepare(fullName, nationalID){
          return {payload: {
            fullName,
            nationalID,
            createdAt: new Date().toISOString(),
          }}
        },
        reducer(state, action){
          state.fullName = action.payload.fullName
          state.nationalID = action.payload.nationalID
          state.createdAt = action.payload.createdAt
        }
      },
      updateName(state, action){
        state.fullName = action.payload.fullName
      }
    }
  }
)

export const {createCustomer, updateName} = customerSlice.actions

export default customerSlice.reducer

// export default function customerReducer(state = initialStateCustomer, action) {
//   switch (action.type) {
//     case "customer/createCustomer":
//       console.log("JOder que no funca");

//       return {
//         ...state,
//         fullName: action.payload.fullName,
//         nationalID: action.payload.nationalID,
//         createdAt: action.payload.createdAt,
//       };
//     case "customer/updateName":
//       return {
//         ...state,
//         fullName: action.payload.fullName,
//       };
//     default:
//       return state;
//   }
// }


// function createCustomer(fullName, nationalID) {
//   return {
//     type: "customer/createCustomer",
//     payload: {
//       fullName,
//       nationalID,
//       createdAt: new Date().toISOString(),
//     },
//   };
// }

// function updateName(fullName) {
//   return {
//     type: "customer/updateName",
//     payload: {
//       fullName,
//     },
//   };
// }

// export {createCustomer, updateName}