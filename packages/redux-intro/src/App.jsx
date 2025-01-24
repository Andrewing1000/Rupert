import CreateCustomer from "./features/customer/CreateCustomer";
import Customer from "./features/customer/Customer";
import AccountOperations from "./features/account/AccountOperations";
import BalanceDisplay from "./features/account/BalanceDisplay";
import { useSelector } from "react-redux";

function App() {
  const customer = useSelector(state => state.customer)
  const account = useSelector(state => state.account)

  return (
    <div>
      <h1>🏦 The React-Redux Bank ⚛️</h1>
      {customer.fullName === ''? 
      <CreateCustomer />:
      <>
      <Customer />
      <AccountOperations />
      <BalanceDisplay />
      </>
      }
    </div>
  );
}

export default App;
