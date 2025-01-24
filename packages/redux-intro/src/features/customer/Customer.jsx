import { useSelector } from "react-redux";

function Customer() {
  const customer = useSelector(store=>store.customer) //same effect as useContext???
  //useSelector creates some optmimzations on this
  //useSelector subscribes this component to the store
  return <h2>👋 Welcome,{customer.fullName}</h2>;
}

export default Customer;
