import React, { useEffect, useState } from "react";
import Navigation from "./app/Navigation";
import initializeFirestore from "./app/config/FIrestore.init";

const App = () => {
  useEffect(() => {
    initializeFirestore();
  }, []);

  return (
    <Navigation />
  );
};


export default App;