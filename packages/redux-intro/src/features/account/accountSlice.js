const initialState = {
  balance: 0,
  loan: 0,
  opened: false,
  loanPurpose: "",
  isLoading: false,
};


export default function reducer(state = initialState, action) {
  //Pure function
  switch (action.type) {
    case "account/open":
      return { ...state, opened: true };
    case "account/requestLoan":
      if (state.loan > 0) return state;
      return {
        ...state,
        balance: state.balance + action.payload.amount,
        loan: action.payload?.amount ?? 0,
        loanPurpose: action.payload?.purpose ?? "",
      };
    case "account/payLoan":
      if (state.loan === 0) return state;
      return { ...state, loan: 0, balance: state.balance - state.loan};
    case "account/deposit":
      return { ...state, balance: state.balance + action.payload, isLoading: false};
    case "account/withdraw":
      return { ...state, balance: state.balance - action.payload };
    case "customer/createCustomer":
      console.log("JOder que no funca");
      return state;
    case "account/loading":
      return {...state, isLoading: true}
    default:
      return state;
  }
}


function withdraw(amount) {
  return { type: "account/withdraw", payload: amount };
}
function deposit(amount, currency) {
  if(currency === "USD") return { type: "account/deposit", payload: amount };

  return async function(dispatch, getState) {
    dispatch({type: 'account/loading'})
    const res =  await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`)
    const data = await res.json()
    const converted = data.rates .USD;
    // dispatch({type: 'account/ready'})
    return dispatch({type: "account/deposit", payload: converted})
  } //redux figures it must execute the function instead
  //of updating a state 
}
function requestLoan(amount, purpose) {
  return {
    type: "account/requestLoan",
    payload: {
      amount: amount,
      purpose: purpose,
    },
  };
}
function payLoan() {
  return { type: "account/payLoan", loan: 0, loanPurpose: "" };
}

export {withdraw, deposit, requestLoan, payLoan}



//Use middleware for async data fetching
//So its doesnt distrube the pure nature of 
//state function and also doesnt abuse the use of
//use effect in components

//Middleware takes place between 
//the tranmision process from the dispatch 
//function to the store

//THunk is a library that offers such capabilitites
