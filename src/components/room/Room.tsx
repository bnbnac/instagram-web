import { gql, useApolloClient } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  RoomUpdatesDocument,
  SeeRoomDocument,
  useSeeRoomQuery,
  useSendMessageMutation,
} from "../../generated/graphql";
import useUser from "../../hooks/useUser";

interface IRow {
  isMine: boolean;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column-reverse;
  flex: 1;
  height: 100%;
  align-items: flex-end;
`;

const MessageContainer = styled.div`
  /* display: flex; */
  /* flex-direction: column-reverse; */
  align-items: center;
  padding: 7px;
  overflow-y: scroll;
`;

const Avatar = styled.img`
  height: 22px;
  width: 22px;
  border-radius: 25px;
  margin: 5px;
`;
const Message = styled.div`
  display: inline-block;
  color: blue;
  background-color: rgba(255, 255, 255, 0.3);
  border: 0.1px solid blue;
  padding: 5px 10px;
  border-radius: 10px;
  font-size: 16px;
  flex-direction: row-reverse;
  align-items: center;
`;
const InputContainer = styled.div`
  width: 95%;
  margin-bottom: 50px;
  margin-top: 25px;
  flex-direction: row;
  align-items: center;
`;
const MessageInput = styled.input`
  width: 90%;
  padding: 10px 20px;
  border-radius: 1000px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: blue;
  margin-right: 10px;
`;

const Row = styled.div<IRow>`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.isMine ? "flex-end" : "flex")};
`;

gql`
  query seeRoom($id: Int!) {
    seeRoom(id: $id) {
      id
      messages {
        id
        payload
        user {
          username
          avatar
        }
        read
      }
    }
  }
`;
gql`
  mutation sendMessage($payload: String!, $roomId: Int, $userId: Int) {
    sendMessage(payload: $payload, roomId: $roomId, userId: $userId) {
      id
      ok
    }
  }
`;
gql`
  subscription roomUpdates($id: Int!) {
    roomUpdates(id: $id) {
      id
      payload
      user {
        id
        avatar
        username
      }
      read
    }
  }
`;

export default function Room({ roomId: id }: any) {
  const client = useApolloClient();
  const [subscribed, setSubscribed] = useState(false);
  const { data: myData } = useUser();
  const roomId = parseInt(id);

  const { register, handleSubmit, setValue, getValues, watch } = useForm();

  const { data, loading, subscribeToMore } = useSeeRoomQuery({
    variables: { id: roomId },
  });

  const updateSendMessage = (cache: any, result: any) => {
    const {
      data: {
        sendMessage: { ok, id },
      },
    } = result;
    const text = getValues("text");
    setValue("text", "");
    const messageObj = {
      id,
      payload: text,
      user: {
        __typename: "User",
        id: myData?.me?.id,
        username: myData?.me?.username,
        avatar: myData?.me?.avatar,
      },
      read: true,
      __typename: "Message",
    };
    const messageFragment = cache.writeFragment({
      fragment: gql`
        fragment NewMessage on Message {
          id
          payload
          user {
            id
            username
            avatar
          }
          read
        }
      `,
      data: messageObj,
    });
    cache.modify({
      id: `Room:${roomId}`,
      fields: {
        messages(prev: any) {
          const existingMessage = prev.find(
            (aMessage: any) => aMessage.__ref === messageFragment?.__ref
          );
          if (existingMessage) {
            return prev;
          }
          return [...prev, messageFragment];
        },
      },
    });
  };

  const [sendMessageMutation, { loading: sending }] = useSendMessageMutation({
    update: updateSendMessage,
  });

  const onValid = ({ text }: any) => {
    if (!sending) {
      sendMessageMutation({
        variables: { payload: text, roomId },
      });
    }
  };

  const updateQuery = (prev: any, option: any) => {
    const {
      subscriptionData: {
        data: { roomUpdates: text },
      },
    } = option;

    if (text.id) {
      const messageFragment = client.cache.writeFragment({
        fragment: gql`
          fragment NewMessage on Message {
            id
            payload
            user {
              id
              username
              avatar
            }
            read
          }
        `,
        data: text,
      });

      client.cache.modify({
        id: `Room:${roomId}`,
        fields: {
          messages(prev) {
            const existingMessage = prev.find(
              (aMessage: any) => aMessage.__ref === messageFragment?.__ref
            );
            if (existingMessage) {
              return prev;
            }
            return [...prev, messageFragment];
          },
        },
      });
    }
  };
  useEffect(() => {
    if (data?.seeRoom && !subscribed) {
      subscribeToMore({
        document: RoomUpdatesDocument,
        variables: {
          id: roomId,
        },
        updateQuery: updateQuery as any,
        onError: (err) => {
          console.log(err);
        },
      });
      setSubscribed(true);
    }
  }, [data, subscribed]);

  return (
    <Wrapper>
      {loading ? <>loading</> : null}
      <InputContainer>
        <form onSubmit={handleSubmit(onValid)}>
          <MessageInput
            placeholder="Write a message..."
            {...register("text", {
              required: "text is required",
              minLength: {
                value: 1,
                message: "username should be longer than 1 chars",
              },
            })}
            onChange={(e) => setValue("text", e.target.value)}
            value={watch("text")}
          />
        </form>
      </InputContainer>
      <MessageContainer>
        {data?.seeRoom?.messages?.map((message, i) => (
          <Row isMine={message?.user.username === myData?.me?.username} key={i}>
            <Link to={`/users/${message?.user?.username}`}>
              <Avatar src={message?.user.avatar + ""} />
            </Link>
            <Message>{message?.payload}</Message>
          </Row>
        ))}
      </MessageContainer>
    </Wrapper>
  );
}
