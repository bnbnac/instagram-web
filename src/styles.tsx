import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export const lightTheme = {
  fontColor: "#133965",
  bgColor: "lightgray",
};

export const darkTheme = {
  fontColor: "lightgray",
  bgColor: "#133965",
};

export const GlobalStyles = createGlobalStyle`
    ${reset} // by styled-components, reset the default style from browser
    body {
        background-color:${(props) => props.theme.bgColor};
    }
`;
