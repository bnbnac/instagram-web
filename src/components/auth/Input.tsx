import styled from "styled-components";

interface IInput {
  hasError?: boolean;
}

const Input = styled.input<IInput>`
  width: 100%;
  border-radius: 3px;
  padding: 7px;
  background-color: ${(props) => props.theme.bgColor};
  border: 0.5px solid
    ${(props) => (props.hasError ? "tomato" : props.theme.borderColor)};
  margin-top: 5px;
  box-sizing: border-box;
  &::placeholder {
    font-size: 12px;
  }
  &:focus {
    border-color: ${(props) => props.theme.fontColor};
  }
`;

export default Input;
// also props are delivered
