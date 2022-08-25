import { Link } from "react-router-dom";
import styled from "styled-components";
import { BaseBox } from "../shared";

interface IBottomBox {
  cta: string;
  link: string;
  linktext: string;
}

const SBottomBox = styled(BaseBox)`
  padding: 20px 0px;
  text-align: center;
  a {
    font-weight: 600;
    margin-left: 5px;
    color: ${(props) => props.theme.accent};
  }
`;

function BottomBox({ cta, link, linktext }: IBottomBox) {
  return (
    <SBottomBox>
      <span>{cta}</span>
      <Link to={link}>{linktext}</Link>
    </SBottomBox>
  );
}

export default BottomBox;
