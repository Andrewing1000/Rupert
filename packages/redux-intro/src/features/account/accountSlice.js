import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 0,
  loan: 0,
  opened: false,
  loanPurpose: "",
  isLoading: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState: initialState,
  reducers: {
    loading(state, action){
      state.isLoading = true;
    },
    deposit: {
      prepare(amount, currency) {
        if(currency === "USD") return {payload: amount}
        async function convert(dispatch, getState) {
          dispatch({type: 'account/loading'})
          const res = await 
          fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`)
          const data = await res.json()
          return dispatch({
            type: 'account/deposit',
            payload: data.rates.USD})
        }
        // convert()
        return {payload: 0}
      },
      reducer(state, action) {
        state.balance = state.balance + action.payload;
        state.isLoading = false
      },
    },
    withdraw(state, action) {
      if (state.balance - action.payload < 0) return;
      state.balance = state.balance - action.payload;
    },
    requestLoan: {
      prepare(amount, purpose) {
        return {
          payload: {
            amount,
            purpose,
          },
        };
      },
      reducer(state, action) {
        if (state.loan > 0) return;
        state.loan = action.payload.amount;
        state.loanPurpose = action.payload.purpose;
      },
    },
    payLoan(state, action) {
      state.balance -= state.loan;
      state.loanPurpose = "";
      state.loan = 0;
    },
  },
});

export const {withdraw, requestLoan, payLoan } = accountSlice.actions;
//this actions provide actions in the exact same format as its
//raw version: {type: <sliceName>/<action>, payload: {}}
export default accountSlice.reducer;

export function deposit(amount, currency) {
  if (currency === "USD") return { type: "account/deposit", payload: amount };

  return async function (dispatch, getState) {
    dispatch({ type: "account/loading" });
    const res = await fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`
    );
    const data = await res.json();
    const converted = data.rates.USD;
    // dispatch({type: 'account/ready'})
    return dispatch({ type: "account/deposit", payload: converted });
  }; //redux figures it must execute the function instead
  //of updating a state
}

// export default function reducer(state = initialState, action) {
//   //Pure function
//   switch (action.type) {
//     case "account/open":
//       return { ...state, opened: true };
//     case "account/requestLoan":
//       if (state.loan > 0) return state;
//       return {
//         ...state,
//         balance: state.balance + action.payload.amount,
//         loan: action.payload?.amount ?? 0,
//         loanPurpose: action.payload?.purpose ?? "",
//       };
//     case "account/payLoan":
//       if (state.loan === 0) return state;
//       return { ...state, loan: 0, balance: state.balance - state.loan };
//     case "account/deposit":
//       return {
//         ...state,
//         balance: state.balance + action.payload,
//         isLoading: false,
//       };
//     case "account/withdraw":
//       return { ...state, balance: state.balance - action.payload };
//     case "customer/createCustomer":
//       console.log("JOder que no funca");
//       return state;
//     case "account/loading":
//       return { ...state, isLoading: true };
//     default:
//       return state;
//   }
// }

// function withdraw(amount) {
//   return { type: "account/withdraw", payload: amount };
// }
// function deposit(amount, currency) {
//   if (currency === "USD") return { type: "account/deposit", payload: amount };

//   return async function (dispatch, getState) {
//     dispatch({ type: "account/loading" });
//     const res = await fetch(
//       `https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`
//     );
//     const data = await res.json();
//     const converted = data.rates.USD;
//     // dispatch({type: 'account/ready'})
//     return dispatch({ type: "account/deposit", payload: converted });
//   }; //redux figures it must execute the function instead
//   //of updating a state
// }
// function requestLoan(amount, purpose) {
//   return {
//     type: "account/requestLoan",
//     payload: {
//       amount: amount,
//       purpose: purpose,
//     },
//   };
// }
// function payLoan() {
//   return { type: "account/payLoan", loan: 0, loanPurpose: "" };
// }

// export { withdraw, deposit, requestLoan, payLoan };

//Use middleware for async data fetching
//So its doesnt distrube the pure nature of
//state function and also doesnt abuse the use of
//use effect in components

//Middleware takes place between
//the tranmision process from the dispatch
//function to the store

//THunk is a library that offers such capabilitites
