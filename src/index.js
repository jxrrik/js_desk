import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";

import { lightTheme, darkTheme } from "./styles/themes";
import { ThemeProvider } from "styled-components";

window.onload = () => {
  ReactDOM.render(
    <ThemeProvider theme={darkTheme}>
        <Router>
          <Routes>
            <Route path="/" element={<App />} />
          </Routes>
        </Router>
    </ThemeProvider>,
    document.getElementById("app")
  );
};
