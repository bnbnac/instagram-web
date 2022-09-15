import { gql, useApolloClient } from "@apollo/client";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useCreateRoomMutation } from "../../generated/graphql";
import SearchBar from "../SearchBar";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: space-between; */
  padding: 10px 20px;
  background-color: ${(props) => props.theme.bgColor};
  border: 1px solid ${(props) => props.theme.borderColor};
  color: ${(props) => props.theme.fontColor};
  width: 100%;
  height: 700px;
`;
const Btn = styled(Link)`
  /* display: flex; */
  background-color: ${(props) => props.theme.accent};
  color: ${(props) => props.theme.fontColor};
`;

gql`
  mutation createRoom($userId: Int!) {
    createRoom(userId: $userId) {
      ok
      id
      error
    }
  }
`;

export default function CreateRoom({ setIsOpenFalse }: any) {
  const [userId, setUserId] = useState(0);
  const navigate = useNavigate();
  const client = useApolloClient();

  const onCompleted = ({ createRoom }: any) => {
    //caching!!!!!!
    navigate(`/direct/${createRoom.id}`);
  };

  const [createRoomMutation] = useCreateRoomMutation({
    onCompleted,
  });

  const onClick = () => {
    if (userId < 1) {
      return;
    }
    setIsOpenFalse();
    createRoomMutation({
      variables: { userId },
    });
  };

  return (
    <Wrapper>
      <Btn onClick={onClick} to={`/direct/${userId}`}>
        Select user to talk
      </Btn>
      <SearchBar
        placeholder={"search user with Username"}
        fromWhere={"CreateRoom"}
        userId={userId}
        setUserId={(selectedId: any) => setUserId(selectedId)}
      />
    </Wrapper>
  );
}
