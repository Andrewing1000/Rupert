import React, {useState, useEffect} from 'react';

export default function Timer({dispatch, remainingSeconds}){
    useEffect(
        function(){
            const intervalId = setInterval(() => {  
                dispatch({type: "tick"})
            }, 1000)

            return function(){
                clearInterval(intervalId)
            }
        }
        , [])

    const time  = remainingSeconds
    const minutes = Math.floor(time/60).toString().padStart(2, '0')
    const seconds = (time%60).toString().padStart(2, '0') 
    return <div className='timer'>
        {minutes}:{seconds} 
    {/* Also can be used: Math.trunc 
    (time/60) | 0 bitwise or   
    */}
    </div> 
}