import { createStore } from "redux";

const initialState ={
    balance: 0,
    loan: 0,
    opened: false,
}


function reducer(state, action){
    switch(action.type){
        case "accout/open":
            return {...state, opened: true}
        case "accout/requestLoan":
            if(state.loan>0) return state;
            return {...state, loan: action.payload}
        case "accout/payLoan":
            if(state.loan===0) return state;
            return {...state,
                loan: 0,
                balance: state.balance - action.payload
            }
        case "account/deposit":
            return {...state, balance: state.balance+action.payload}
        case "account/withdraw":
            return {...state, balance: state.balance-action.payload}
        default:
            return state;
    }
}

export const store = createStore(reducer);

store.dispatch({type: 'account/deposit', payload: 500});
console.log(store.getState())
console.log("Estoy chapaco")
