import styled from "styled-components";

const SFromError = styled.span`
  color: tomato;
  font-weight: 600;
  font-size: 12px;
`;

function FromError({ message }: any) {
  return message ? <SFromError>{message}</SFromError> : null;
}

export default FromError;
