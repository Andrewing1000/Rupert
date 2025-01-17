import { useEffect } from "react";

export function useKey(code, callback){// AKA scape patch //This function goes here instead of the main container
    //in order to prevent this from running upon the main panel mount
    //and only after a detail component has been added to the tree
    
    useEffect(
        function(){
            const listenerCallback = function(e){
                if(e.code === code) callback()
            }
            document.addEventListener('keydown', listenerCallback);
            return () => {document.removeEventListener('keydown', listenerCallback)}
        }, [callback, code])
}