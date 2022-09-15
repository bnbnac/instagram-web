import { gql, useApolloClient } from "@apollo/client";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/auth/Button";
import PageTitle from "../components/PageTitle";
import { FatText } from "../components/shared";
import { PHOTO_FRAGMENT } from "../fragment";
import {
  useFollowUserMutation,
  useSeeProfileQuery,
  useUnfollowUserMutation,
} from "../generated/graphql";
import useUser from "../hooks/useUser";

export const Header = styled.div`
  display: flex;
`;
export const Avatar = styled.img`
  margin-left: 50px;
  height: 160px;
  width: 160px;
  border-radius: 50%;
  margin-right: 150px;
  background-color: #2c2c2c;
`;
export const Column = styled.div``;
export const Username = styled.h3`
  font-size: 28px;
  font-weight: 400;
`;
export const Row = styled.div`
  margin-bottom: 20px;
  font-size: 16px;
  display: flex;
`;
export const List = styled.ul`
  display: flex;
`;
export const Item = styled.li`
  margin-right: 20px;
`;
export const Value = styled(FatText)`
  font-size: 18px;
`;
export const Name = styled(FatText)`
  font-size: 20px;
`;

export const Grid = styled.div`
  display: grid;
  grid-auto-rows: 290px;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 50px;
`;

export const Photo = styled.div<{ bg: any }>`
  background-image: url(${(props) => props.bg});
  background-size: cover;
  position: relative;
`;

export const Icons = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  opacity: 0;
  &:hover {
    opacity: 1;
  }
`;

export const Icon = styled.span`
  font-size: 18px;
  display: flex;
  align-items: center;
  margin: 0px 5px;
  svg {
    font-size: 14px;
    margin-right: 5px;
  }
`;

export const ProfileBtn = styled(Button).attrs({
  as: "span",
})`
  margin-left: 10px;
  margin-top: 0px;
  cursor: pointer;
`;

gql`
  mutation unfollowUser($username: String!) {
    unfollowUser(username: $username) {
      ok
    }
  }
`;

gql`
  mutation followUser($username: String!) {
    followUser(username: $username) {
      ok
    }
  }
`;

const SEE_PROFILE_QUERY = gql`
  query seeProfile($username: String!, $page: Int!) {
    seeProfile(username: $username) {
      id
      firstName
      lastName
      username
      bio
      avatar
      photos(page: $page) {
        ...PhotoFragment
      }
      totalFollowing
      totalFollowers
      isMe
      isFollowing
    }
  }
  ${PHOTO_FRAGMENT}
`;

function Profile() {
  const { username } = useParams();
  const { data: userData } = useUser();
  const client = useApolloClient();
  const navigate = useNavigate();

  const { data, loading } = useSeeProfileQuery({
    variables: {
      username: username + "",
      page: 1,
    },
  });

  const unfollowUserUpdate = (cache: any, result: any) => {
    const {
      data: {
        unfollowUser: { ok },
      },
    } = result;
    if (!ok) {
      return;
    }
    cache.modify({
      id: `User:${username}`,
      fields: {
        isFollowing(prev: any) {
          return false;
        },
        totalFollowers(prev: any) {
          return prev - 1;
        },
      },
    });
    const myName = userData?.me?.username;
    cache.modify({
      id: `User:${myName}`,
      fields: {
        totalFollowing(prev: any) {
          return prev - 1;
        },
      },
    });
  };
  const [unfollowUser] = useUnfollowUserMutation({
    variables: {
      username: username + "",
    },
    update: unfollowUserUpdate,
  });

  const followUserCompleted = (data: any) => {
    const {
      followUser: { ok },
    } = data;
    if (!ok) {
      return;
    }
    const { cache } = client;
    cache.modify({
      id: `User:${username}`,
      fields: {
        isFollowing(prev: any) {
          return true;
        },
        totalFollowers(prev: any) {
          return prev + 1;
        },
      },
    });
    const myName = userData?.me?.username;
    cache.modify({
      id: `User:${myName}`,
      fields: {
        totalFollowing(prev: any) {
          return prev + 1;
        },
      },
    });
  };
  const [followUser] = useFollowUserMutation({
    variables: {
      username: username + "",
    },
    onCompleted: followUserCompleted,
  });

  const onClick = () => {
    navigate(`/edit`);
  };

  const getButton = (seeProfile: any) => {
    const { isMe, isFollowing } = seeProfile;
    if (isMe) {
      return <ProfileBtn onClick={onClick}>Edit Profile</ProfileBtn>;
    }
    if (isFollowing) {
      return <ProfileBtn onClick={() => unfollowUser()}>Unfollow</ProfileBtn>;
    } else {
      return <ProfileBtn onClick={() => followUser()}>follow</ProfileBtn>;
    }
  };
  return (
    <div>
      <PageTitle
        title={
          loading ? "Loading..." : `${data?.seeProfile?.username}'s Profile`
        }
      />
      <Header>
        <Avatar src={data?.seeProfile?.avatar || ""} />
        <Column>
          <Row>
            <Username>{data?.seeProfile?.username}</Username>
            {data?.seeProfile ? getButton(data.seeProfile || undefined) : null}
            {/* {data?.seeProfile?.isMe
              ? "Edit Prifile"
              : data?.seeProfile?.isFollowing
              ? "Unfollow"
              : "follow"} */}
            {/* duplicating like this conditionals are not good code. Use function like getButton */}
          </Row>
          <Row>
            <List>
              <Item>
                <span>
                  <Value>{data?.seeProfile?.totalFollowers}</Value> followers
                </span>
              </Item>
              <Item>
                <span>
                  <Value>{data?.seeProfile?.totalFollowing}</Value> following
                </span>
              </Item>
            </List>
          </Row>
          <Row>
            <Name>
              {data?.seeProfile?.firstName}
              {"  "}
              {data?.seeProfile?.lastName}
            </Name>
          </Row>
          <Row>{data?.seeProfile?.bio}</Row>
        </Column>
      </Header>
      <Grid>
        {data?.seeProfile?.photos?.map((photo) => (
          <Photo key={photo?.id} bg={photo?.file}>
            <Icons>
              <Icon>
                <FontAwesomeIcon icon={faHeart} />
                {photo?.likes}
              </Icon>
              <Icon>
                <FontAwesomeIcon icon={faComment} />
                {photo?.commentsNumber}
              </Icon>
            </Icons>
          </Photo>
        ))}
      </Grid>
    </div>
  );
}

export default Profile;
