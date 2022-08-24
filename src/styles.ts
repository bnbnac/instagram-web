import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export const lightTheme = {
  accent: "#0095f6",
  borderColor: "rgb(219, 219, 219)",
  bgColor: "FAFAFA",
  fontColor: "rgb(38, 38, 38)",
};

export const darkTheme = {
  accent: "#0095f6",
  borderColor: "rgb(219, 219, 219)",
  bgColor: "#2c2c2c",
  fontColor: "white",
};

export const GlobalStyles = createGlobalStyle`
    ${reset}
    input {
      all:unset;
    }
    * {
      box-sizing:border-box;
    }
    body {
        background-color: ${(props) => props.theme.bgColor};
        font-size:14px;
        color:  ${(props) => props.theme.fontColor};
        font-family:'Open Sans', sans-serif;
    }
    a {
      text-decoration: none;
    }
`;
