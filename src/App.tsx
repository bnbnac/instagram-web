import { ApolloProvider, useReactiveVar } from "@apollo/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { client, darkModeVar, isLoggedInVar } from "./apollo";
import routes from "./routes";
import Home from "./screens/Home";
import Login from "./screens/Login";
import NotFound from "./screens/NotFound";
import SignUp from "./screens/SignUp";
import { darkTheme, GlobalStyles, lightTheme } from "./styles";

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const darkMode = useReactiveVar(darkModeVar);
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <HelmetProvider>
          <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <GlobalStyles />
            <Routes>
              <Route
                path={routes.Home}
                element={isLoggedIn ? <Home /> : <Login />}
              />
              {isLoggedIn ? null : (
                <Route path={routes.SignUp} element={<SignUp />} />
              )}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ThemeProvider>
        </HelmetProvider>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
