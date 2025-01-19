import {React, useState, useEffect} from 'react'

const currencyList = [
    {
        'name': ""
    },
    {
        'name': "USD"
    },
    {
        'name': "CUSD"
    },
    {
        'name': 'EUR'
    }

]

const baseURL = "https://open.er-api.com/v6/latest/"

export default function App(){
    const [inputAmount, setInputAmount] =  useState(0);
    const [inputCurrency, setInputCurrency] = useState("");
    const [outputCurrency, setOutputCurrency] = useState("");
    const [outputAmount, setOutputAmount] = useState("");
    useEffect(
        function(){
            // setInputAmount(Number(inputAmount).toFixed(2)) //Changes are not inmedialy manifested(due to async update)
            // console.log(Number(inputAmount))
            //Number.NaN == Number.NaN returns false
            if(isNaN(inputAmount)){
                setOutputAmount("Ingese un entero valido")
                return
            }
            setOutputAmount("")
            if(!inputCurrency || !outputCurrency || typeof inputAmount === "number") return
            const abortController = new AbortController()
            async function fetchCurrencyRates(){
                try{
                    let res = await fetch(`${baseURL}${inputCurrency}`, abortController.signal)
                    let data = await res.json()
                    // console.log(data)
                    const rates = data.rates;
                    // console.log(rates)
                    // console.log(outputCurrency)
                    if(rates && rates[outputCurrency]){
                        console.log(typeof inputAmount)
                        setOutputAmount((inputAmount*rates[outputCurrency]).toFixed(2)); //Interger multiplication automatically cast strings
                    }
                }catch(Error){
                    console.log(Error)
                }
                
            }
            fetchCurrencyRates()
            return function() {abortController.abort()}
        }
        ,[inputCurrency, outputCurrency, inputAmount]
    )

    console.log(inputCurrency)
    return <div className="main-container">
        <div className="first-row">
            <input 
            type="number"
            placeholder='Enter the amount'
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}/>
            
            <DropDownCurrency 
            currencyList={currencyList}
            selectedCurrency={inputCurrency}
            onSelectCurrency={setInputCurrency}/>
            <DropDownCurrency
            currencyList={currencyList}
            selectedCurrency={outputCurrency}
            onSelectCurrency={setOutputCurrency}/>
        </div>

        <h1>{outputAmount}</h1>
    </div>
}

function DropDownCurrency({currencyList, selectedCurrency, onSelectCurrency}){
    return <select value={selectedCurrency}
    onChange={e=>onSelectCurrency(e.target.value)}>
    {/* disabled={true}> */}
        {
            currencyList.map((item, index) => {
                return <option value={item.name} key={index}>{item.name}</option>
            })
        }
    </select>
}

//React hooks
//useState x
//useEffect x
//useContext
//useReducer x
//useRef x
//useCallback
//useMemo
//useTransition
//useDeferredValue

//useLayoutEffect
//useDebugValue
//useImperativeHandle
//useId

//useSyncExternalStore
//useInsertionEffect

//1. Hooks con any be called at the top level of a
//function declaration

//2. Can only be called from React functions

//The asossiated liked list of hooks in the fiver tree
//cannot be updated nor rebuilt
//thus defined hooks must be static in their declaration

