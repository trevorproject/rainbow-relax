import { useState, useEffect, useRef, useCallback } from "react";

export const useQuickEscape = () => {
    const [counter, setCounter] = useState <number> 0;
    const resetTimeoutRef = useRef <number | null>(null);
    const isMobile = "ontouchstart" in window;

    const incrementCounter = useCallback(()=>{
        setCounter((prev) => prev +1);
        if (resetTimeoutRef.current){
            clearTimeout(resetTimeoutRef.current);
        }
        resetTimeoutRef.current=window.setTimeout(()=>{
            setCounter(0);
        }, isMobile ? 500:1000);
    },[isMobile]);
}
