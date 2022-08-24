import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    accent?: string;
    fontColor?: string;
    bgColor?: string;
    borderColor?: string;
  }
}
