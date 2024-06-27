import React from "react";
import { Provider } from "react-redux";
import configureStore from "./src/state/store/configureStore";
import Navigation from "./src/navigation/Navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18next from "i18next";
import { ThemeProvider } from "./src/context/ThemeContext";
import { useTranslation } from "react-i18next";

const store = configureStore();

const App = () => {
  const { t } = useTranslation();

  React.useEffect(() => {
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
      <ThemeProvider>
        <Navigation t={t} />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
