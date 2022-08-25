import styled from "styled-components";

const SFormError = styled.span`
  color: tomato;
  font-weight: 600;
  font-size: 12px;
`;

interface IFormError {
  error: string | undefined;
}
/* if use 'massage' instead of 'error', then it is not work...... */
/* compare with PageTitle, but i don't know why */

function FormError({ error }: IFormError) {
  return error ? <SFormError>{error}</SFormError> : null;
}

export default FormError;
