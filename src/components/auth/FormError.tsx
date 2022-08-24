import styled from "styled-components";

const SFormError = styled.span`
  color: tomato;
  font-weight: 600;
  font-size: 12px;
`;

function FormError({ message }: any) {
  return message ? <SFormError>{message}</SFormError> : null;
}

export default FormError;
