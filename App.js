import React from "react";
import { Provider } from "react-redux";
import configureStore from "./src/state/store/configureStore";
import Navigation from "./src/navigation/Navigation";

const store = configureStore();

const App = () => {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
};

export default App;
