import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const TOKEN = "token";
const DARK_MODE = "DARK_MODE";
export const isLoggedInVar = makeVar(Boolean(localStorage.getItem(TOKEN)));

export const logUserIn = (token: string) => {
  localStorage.setItem(TOKEN, token);
  isLoggedInVar(true);
};

export const logUserOut = () => {
  localStorage.removeItem(TOKEN);
  window.location.reload();
};

export const darkModeVar = makeVar(
  Boolean(localStorage.getItem(DARK_MODE) === "enable")
);

export const enableDarkMode = () => {
  localStorage.setItem(DARK_MODE, "enable");
  darkModeVar(true);
};
export const disableDarkMode = () => {
  localStorage.setItem(DARK_MODE, "disable");
  darkModeVar(false);
};

const httpLink = createHttpLink({ uri: "http://localhost:4000/graphql" });
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(TOKEN);
  return {
    headers: {
      ...headers,
      token,
    },
  };
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
  connectToDevTools: true,
});
