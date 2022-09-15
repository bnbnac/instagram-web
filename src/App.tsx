import { ApolloProvider, useReactiveVar } from "@apollo/client";
import { HelmetProvider } from "react-helmet-async";
import Modal from "react-modal";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { client, darkModeVar, isLoggedInVar } from "./apollo";
import Layout from "./components/auth/Layout";
import routes from "./routes";
import Direct from "./screens/Direct";
import Edit from "./screens/Edit";
import Hashtag from "./screens/Hashtag";
import Home from "./screens/Home";
import Login from "./screens/Login";
import NotFound from "./screens/NotFound";
import Profile from "./screens/Profile";
import SignUp from "./screens/SignUp";
import { darkTheme, GlobalStyles, lightTheme } from "./styles";

Modal.setAppElement("#root");

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
                element={
                  isLoggedIn ? (
                    <Layout>
                      <Home />
                    </Layout>
                  ) : (
                    <Login />
                  )
                }
              />
              {isLoggedIn ? null : (
                <Route path={routes.SignUp} element={<SignUp />} />
              )}
              <Route
                path={routes.Profile}
                element={
                  <Layout>
                    <Profile />
                  </Layout>
                }
              />
              <Route
                path={routes.Hashtag}
                element={
                  <Layout>
                    <Hashtag />
                  </Layout>
                }
              />
              <Route
                path={routes.Direct}
                element={
                  <Layout>
                    <Direct />
                  </Layout>
                }
              />
              <Route
                path={routes.Edit}
                element={
                  <Layout>
                    <Edit />
                  </Layout>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ThemeProvider>
        </HelmetProvider>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
