import { PropsWithChildren } from "react";
import styled from "styled-components";
import Header from "../Header";

const Content = styled.main`
  margin: 0 auto;
  margin-top: 45px;
  max-width: 930px;
  width: 100%;
`;

function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      <Content>{children}</Content>
    </>
  );
}

export default Layout;
