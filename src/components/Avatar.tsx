import styled from "styled-components";

const SAvatar = styled.div<IAvatar>`
  width: ${(props) => (props.lg ? "30px" : "25px")};
  height: ${(props) => (props.lg ? "30px" : "25px")};
  border-radius: 100%;
  background-color: #2c2c2c;
  overflow: hidden;
`;

interface IAvatar {
  url?: string | null | undefined;
  lg?: any;
}

const Img = styled.img`
  width: 100%;
  height: 100%;
`;

function Avatar({ url, lg }: IAvatar) {
  return <SAvatar lg={lg}>{url === null ? null : <Img src={url} />}</SAvatar>;
}

export default Avatar;
