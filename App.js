import React from "react";
import { Provider } from "react-redux";
import configureStore from "./src/state/store/configureStore";
import Navigation from "./src/navigation/Navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18next from "i18next";
import { ThemeProvider } from "./src/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { loadUserFromStorage, subscribeToAuthChanges } from "./src/state/actions/authAction"; // Ajuste o caminho conforme a sua estrutura

const store = configureStore();

const App = () => {
  const { t } = useTranslation();

  React.useEffect(() => {
    // Carrega o idioma salvo do AsyncStorage
    const loadLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem("LANGUAGE");
        if (storedLanguage) {
          i18next.changeLanguage(storedLanguage);
          console.log("saved lang:", storedLanguage);
        }
      } catch (e) {
        console.log("Erro ao carregar idioma:", e);
      }
    };

    // Carrega o estado do utilizador do AsyncStorage para o Redux
    store.dispatch(loadUserFromStorage());

    // Subscreve as mudanças de estado de autenticação do Firebase.
    // Isso é crucial para manter o Redux atualizado com o Firebase Auth.
    const unsubscribeAuth = store.dispatch(subscribeToAuthChanges());

    loadLanguage();

    // Função de limpeza do useEffect.
    // Garante que a subscrição do Firebase Auth é encerrada quando o componente é desmontado.
    return () => {
      unsubscribeAuth();
    };
  }, []); // O array vazio assegura que este efeito é executado apenas uma vez, na montagem do componente.

  return (
      <Provider store={store}>
        <ThemeProvider>
          <Navigation t={t} />
        </ThemeProvider>
      </Provider>
  );
};

export default App;