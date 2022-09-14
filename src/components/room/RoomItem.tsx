import styled from "styled-components";
import useUser from "../../hooks/useUser";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  /* justify-content: space-between; */
  padding: 10px 20px;
  background-color: ${(props) => props.theme.bgColor};
  border: 1px solid ${(props) => props.theme.borderColor};
  color: ${(props) => props.theme.fontColor};
  width: 100%;
`;

const Avatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 100%;
  background-color: ${(props) => props.theme.bgColor};
  overflow: hidden;
`;

const Username = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin: 12px;
`;

const Status = styled.div`
  font-size: 14px;
  margin: 12px;
  color: grey;
`;

export default function RoomItem({ users, unreadTotal, id }: any) {
  const { data: myData } = useUser();
  const you = users.find((user: any) => user.username !== myData?.me?.username);
  return (
    <Wrapper>
      <Avatar src={you.avatar}></Avatar>
      <div>
        <Username>{you.username}</Username>
        <Status>last chat : query it</Status>
      </div>
    </Wrapper>
  );
}
