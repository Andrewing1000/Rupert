import { useState } from "react";
import { withdraw, deposit, requestLoan, payLoan } from "./accountSlice";
import { useSelector, useDispatch } from "react-redux";

function AccountOperations() {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanPurpose, setLoanPurpose] = useState("");
  const [currency, setCurrency] = useState("USD");
  //These states are only used to controll inputs
  //the app state is actually stored in the store

  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);
  const isLoading = useSelector((state) => state.account.isLoading)
  // console.log(account)

  function handleDeposit() {
    if (!depositAmount && !currency) return;
    dispatch(deposit(Number(depositAmount), currency));
    setDepositAmount("");
    setCurrency("USD")
  }
  
  function handleWithdrawal() {
    if (!withdrawalAmount) return;
    dispatch(withdraw(Number(withdrawalAmount)));
    setWithdrawalAmount("");
  }
  
  function handleRequestLoan() {
    if (!loanAmount || !loanPurpose) return;
    dispatch(requestLoan(Number(loanAmount), loanPurpose));
    setLoanAmount("");
    setLoanPurpose("");
  }

  function handlePayLoan() {
    dispatch(payLoan())
  }

  return (
    <div>
      <h2>Your account operations</h2>
      <div className="inputs">
        <div>
          <label>Deposit</label>
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(+e.target.value)}
          />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="USD">US Dollar</option>
            <option value="EUR">Euro</option>
            <option value="GBP">British Pound</option>
          </select>

          <button 
          onClick={handleDeposit}
          disabled={isLoading}>{
            isLoading?
            "Converting...":
            `Deposit ${depositAmount}`
          }</button>
        </div>

        <div>
          <label>Withdraw</label>
          <input
            type="number"
            value={withdrawalAmount}
            onChange={(e) => setWithdrawalAmount(+e.target.value)}
          />
          <button onClick={handleWithdrawal}>
            Withdraw {withdrawalAmount}
          </button>
        </div>

        <div>
          <label>Request loan</label>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(+e.target.value)}
            placeholder="Loan amount"
          />
          <input
            value={loanPurpose}
            onChange={(e) => setLoanPurpose(e.target.value)}
            placeholder="Loan purpose"
          />
          <button onClick={handleRequestLoan}>Request loan</button>
        </div>

        <div>
          <span>Pay back ${account.loan}</span>
          <button onClick={handlePayLoan}>Pay loan</button>
        </div>
      </div>
    </div>
  );
}

export default AccountOperations;
