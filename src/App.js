import "./styles/App.css";

import React, { useState, useEffect } from "react";

import { AppContainer } from "./styles/styles";

import Header from "./components/header/index";




function App() {
  const [electron, setElectron] = useState(false);

  useEffect(() => {
    if (navigator.userAgent.toLocaleLowerCase().includes("electron")) {
      setElectron(true);
    }
  }, []);

  return (

      <AppContainer
        id="app"
        style={{ borderRadius: `${electron ? "5px" : "0px"}` }}
      >
        <div className="content-app">
          {electron && <Header />}

        </div>
      </AppContainer>

  );
}

export default App;
