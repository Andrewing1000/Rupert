//In the best case almost all the redix logic comes here


const initialStateCustomer = {
  fullName: "",
  nationalID: "",
  createdAt: "",
};


export default function customerReducer(state = initialStateCustomer, action) {
  switch (action.type) {
    case "customer/createCustomer":
      console.log("JOder que no funca");

      return {
        ...state,
        fullName: action.payload.fullName,
        nationalID: action.payload.nationalID,
        createdAt: action.payload.createdAt,
      };
    case "customer/updateName":
      return {
        ...state,
        fullName: action.payload.fullName,
      };
    default:
      return state;
  }
}


function createCustomer(fullName, nationalID) {
  return {
    type: "customer/createCustomer",
    payload: {
      fullName,
      nationalID,
      createdAt: new Date().toISOString(),
    },
  };
}

function updateName(fullName) {
  return {
    type: "customer/updateName",
    payload: {
      fullName,
    },
  };
}

export {createCustomer, updateName}