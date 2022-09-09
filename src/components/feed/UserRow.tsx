import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  useFollowUserMutation,
  useMeQuery,
  useUnfollowUserMutation,
} from "../../generated/graphql";
import Avatar from "../Avatar";
import { FatText } from "../shared";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
`;

const Column = styled(Link)`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const FollowBtn = styled.div`
  background-color: blue;
  justify-content: center;
  padding: 5px 10px;
  border-radius: 4px;
  color: white;
  font-weight: 600;
  cursor: pointer;
`;

export default function UserRow({ user }: any) {
  const { data: myData } = useMeQuery();
  const myName = myData?.me?.username;

  const updateUnfollowUser = (cache: any, result: any) => {
    const {
      data: {
        unfollowUser: { ok, error },
      },
    } = result;

    if (ok) {
      cache.modify({
        id: `User:${user.username}`,
        fields: {
          isFollowing(prev: any) {
            return false;
          },
          totalFollowers(prev: any) {
            return prev - 1;
          },
        },
      });
      cache.modify({
        id: `User:${myName}`,
        fields: {
          totalFollowing(prev: any) {
            return prev - 1;
          },
        },
      });
    } else {
      return;
    }
  };
  const updateFollowUser = (cache: any, result: any) => {
    const {
      data: {
        followUser: { ok },
      },
    } = result;

    if (ok) {
      cache.modify({
        id: `User:${user.username}`,
        fields: {
          isFollowing(prev: any) {
            return true;
          },
          totalFollowers(prev: any) {
            return prev + 1;
          },
        },
      });
      cache.modify({
        id: `User:${myName}`,
        fields: {
          totalFollowing(prev: any) {
            return prev + 1;
          },
        },
      });
    }
  };

  const [unfollowUser] = useUnfollowUserMutation({
    variables: {
      username: user.username + "",
    },
    update: updateUnfollowUser,
  });

  const [followUser] = useFollowUserMutation({
    variables: {
      username: user.username + "",
    },
    update: updateFollowUser,
  });

  return (
    <Wrapper>
      {/* <Column onClick={() => navigation.navigate("Profile", { username, id })}> */}
      <Column to={`/users/${user.username}`}>
        <Avatar url={user.avatar} />
        <FatText>{user.username}</FatText>
      </Column>
      {user.isMe ? null : user.isFollowing ? (
        <FollowBtn onClick={() => unfollowUser()}>Unfollow</FollowBtn>
      ) : (
        <FollowBtn onClick={() => followUser()}>Follow</FollowBtn>
      )}
    </Wrapper>
  );
}
