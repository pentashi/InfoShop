// import { createContext, useContext, useEffect, useState } from 'react';

// const DarkModeContext = createContext();

// export function DarkModeProvider({ children }) {
//     const [darkMode, setDarkMode] = useState(() => {
//         // Load saved preference from localStorage or default to system preference
//         const saved = localStorage.getItem('darkMode');
//         if (saved !== null) return saved === 'true';
//         return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
//     });

//     useEffect(() => {
//         const root = window.document.documentElement;
//         if (darkMode) {
//             root.classList.add('dark');
//         } else {
//             root.classList.remove('dark');
//         }
//         localStorage.setItem('darkMode', darkMode);
//     }, [darkMode]);

//     const toggleDarkMode = () => setDarkMode((prev) => !prev);

//     return (
//         <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
//             {children}
//         </DarkModeContext.Provider>
//     );
// }

// export function useDarkMode() {
//     return useContext(DarkModeContext);
// }
