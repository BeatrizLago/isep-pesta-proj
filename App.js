import React from "react";
import { useEffect } from "react";
import { Provider } from "react-redux";
import configureStore from "./src/state/store/configureStore";
import Navigation from "./src/navigation/Navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18next from "i18next";

const store = configureStore();

const App = () => {
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem("LANGUAGE");
        if (storedLanguage) {
          i18next.changeLanguage(storedLanguage);
          console.log("saved lang:", storedLanguage);
        }
      } catch (e) {
        console.log(e);
      }
    };
    loadLanguage();
  }, []);

  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
};

export default App;
