import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

const lightTheme = {
  // Define your light theme properties
  background: '#ffffff',
  text: '#000000',
  // Add more properties as needed
};

const darkTheme = {
  // Define your dark theme properties
  background: '#000000',
  text: '#ffffff',
  // Add more properties as needed
};

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('THEME');
        if (storedTheme) {
          setTheme(storedTheme);
        }
      } catch (e) {
        console.log(e);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('THEME', newTheme);
    } catch (e) {
      console.log(e);
    }
  };

  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeProvider, ThemeContext };
