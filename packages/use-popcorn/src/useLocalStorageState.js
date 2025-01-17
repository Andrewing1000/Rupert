import {useState, useEffect} from 'react';

export function useLocalStorageState(initialState, key){
    const [state, setState] = useState(() => {
        const stringState = localStorage.getItem(key)
        console.log("PUTA", initialState)
        return JSON.parse(stringState ?? JSON.stringify(initialState))
    })

    useEffect(
        function(){
            localStorage.setItem(key, JSON.stringify(state))
        }, [state, key])
    return [state, setState]
}