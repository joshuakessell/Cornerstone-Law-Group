import { useState, useEffect, useCallback } from "react";

/**
 * Hook for managing boolean values in localStorage with cross-tab synchronization
 * @param key - localStorage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns Tuple of [value, setValue]
 */
export function useLocalStorageBoolean(
  key: string,
  defaultValue: boolean
): [boolean, (value: boolean | ((prev: boolean) => boolean)) => void] {
  // Initialize state safely (SSR guard)
  const [value, setValueState] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return defaultValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? item === "true" : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  // Update localStorage when value changes
  const setValue = useCallback(
    (newValue: boolean | ((prev: boolean) => boolean)) => {
      try {
        // Allow value to be a function so we can use it like setState
        const valueToStore =
          newValue instanceof Function ? newValue(value) : newValue;
        setValueState(valueToStore);
        
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, String(valueToStore));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, value]
  );

  // Listen for storage events to sync across tabs
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = e.newValue === "true";
          setValueState(newValue);
        } catch (error) {
          console.warn(`Error parsing storage event for key "${key}":`, error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key]);

  return [value, setValue];
}







