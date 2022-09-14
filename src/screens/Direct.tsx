import { gql } from "@apollo/client";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import PageTitle from "../components/PageTitle";
import Room from "../components/room/Room";
import RoomItem from "../components/room/RoomItem";
import { ROOM_FRAGMENT } from "../fragment";
import { useSeeRoomsQuery } from "../generated/graphql";
import useUser from "../hooks/useUser";

const Container = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  border: 1px solid ${(props) => props.theme.borderColor};
  height: 750px;
  display: flex;
`;

const RoomsContainer = styled.div`
  display: flex;
  flex-grow: 1;
  height: 100%;
`;
const ChatsContainer = styled.div`
  display: flex;
  flex-grow: 2;
`;
const Rooms = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
`;

const Row = styled(Link)`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 10px;
  width: 100%;
  &:hover {
    background-color: lightgrey;
  }
`;

const Chats = styled.div`
  margin: 10px;
  width: 100%;
  height: 95%;
  background-color: ${(props) => props.theme.bgColor};
  border: 1px solid ${(props) => props.theme.borderColor};
`;

gql`
  query seeRooms {
    seeRooms {
      ...RoomParts
    }
  }
  ${ROOM_FRAGMENT}
`;

export default function Direct() {
  const { data: myData } = useUser();
  const { roomId } = useParams();
  const { data, loading } = useSeeRoomsQuery();
  return (
    <Container>
      <PageTitle title={loading ? "Loading..." : "Direct"} />
      <RoomsContainer>
        <Rooms>
          {data?.seeRooms?.map(
            (room, i) =>
              room && (
                <Row key={i} to={`/direct/${room?.id + ""}`}>
                  <RoomItem {...room} />
                </Row>
              )
          )}
        </Rooms>
      </RoomsContainer>
      <ChatsContainer>
        <Chats>
          {roomId === "main" ? (
            <div>
              <h1>Make new ChatRoom</h1>
            </div>
          ) : (
            <Room roomId={roomId} />
          )}
        </Chats>
      </ChatsContainer>
    </Container>
  );
}
