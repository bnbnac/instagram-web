import { gql, useQuery } from "@apollo/client";
import {
  faBookmark,
  faComment,
  faHeart,
  faPaperPlane,
} from "@fortawesome/free-regular-svg-icons";
import { faHeart as SolidHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useToggleLikeMutation } from "../../generated/graphql";
import Avatar from "../Avatar";
import { FatText } from "../shared";
import Comments from "./Comments";
import Modal from "react-modal";
import UserRow from "./UserRow";
import { USER_FRAGMENT } from "../../fragment";

const PhotoContainer = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  border: 1px solid ${(props) => props.theme.borderColor};
  margin-bottom: 20px;
  max-width: 615px;
`;
const PhotoHeader = styled.div`
  padding: 15px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(239, 239, 239);
`;

const Username = styled(FatText)`
  margin-left: 15px;
`;

const PhotoFile = styled.img`
  max-width: 100%;
  min-width: 100%;
`;

const PhotoData = styled.div`
  padding: 15px;
`;

const PhotoActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  div {
    display: flex;
    align-items: center;
  }
`;

const PhotoAction = styled.div`
  margin-right: 10px;
  cursor: pointer;
`;

const Likes = styled(FatText)`
  margin-top: 10px;
  display: block;
  cursor: pointer;
`;

gql`
  mutation toggleLike($id: Int!) {
    toggleLike(id: $id) {
      ok
      error
    }
  }
`;

const LIKES_QUERY = gql`
  query seePhotoLikes($id: Int!) {
    seePhotoLikes(id: $id) {
      ...UserFragment
    }
  }
  ${USER_FRAGMENT}
`;

// interface IComment {
//   id: number;
//   user: {
//     avatar?: string | null | undefined;
//     username: string | null | undefined;
//   };
//   payload: string;
//   isMine: boolean;
//   createdAt: string;
// }

interface IPhoto {
  id: number;
  file: string;
  isLiked: boolean;
  likes: number;
  caption?: string | null;
  commentsNumber: number;
  comments: Array<{
    __typename?: "Comment";
    id: number;
    payload: string;
    isMine: boolean;
    createdAt: string;
    user: { __typename?: "User"; username: string; avatar?: string | null };
  } | null>;
  user: {
    avatar?: string | null;
    username: string;
  };
}

function Photo({
  id,
  file,
  isLiked,
  likes,
  caption,
  commentsNumber,
  comments,
  user,
}: IPhoto) {
  const [isOpen, setIsOpen] = useState(false);

  const updateToggleLike = (cache: any, result: any) => {
    const {
      data: {
        toggleLike: { ok },
      },
    } = result;
    // Any changes you make to cached data with writeFragment are not pushed to your GraphQL server. If you reload your environment, these changes will disappear.
    // But
    // When a mutation's response is insufficient to update all modified fields in your cache (such as certain list fields), you can define an update function to apply manual changes to your cached data after a mutation.
    // These methods enable you to execute GraphQL operations on the cache as though you're interacting with a GraphQL server.
    if (ok) {
      const fragmentId = `Photo:${id}`;
      cache.modify({
        id: fragmentId,
        fields: {
          isLiked(previousValue: boolean) {
            return !previousValue;
          },
          likes(previousValue: number) {
            if (isLiked) {
              return previousValue - 1;
            }
            return previousValue + 1;
          },
        },
      });
    }
  };
  const [toggleLike] = useToggleLikeMutation({
    variables: {
      id,
    },
    update: updateToggleLike,
  });

  const { data: photiLikesData, loading } = useQuery(LIKES_QUERY, {
    variables: { id },
  });

  return (
    <PhotoContainer key={id}>
      <PhotoHeader>
        <Link to={`/users/${user.username}`}>
          <Avatar lg url={user.avatar} />
        </Link>
        <Link to={`/users/${user.username}`}>
          <Username>{user.username}</Username>
        </Link>
      </PhotoHeader>
      <PhotoFile src={file} />
      <PhotoData>
        <PhotoActions>
          <div>
            <PhotoAction onClick={() => toggleLike()}>
              <FontAwesomeIcon
                style={{ color: isLiked ? "tomato" : "inherit" }}
                size={"2x"}
                icon={isLiked ? SolidHeart : faHeart}
              />
            </PhotoAction>
            <PhotoAction>
              <FontAwesomeIcon size={"2x"} icon={faComment} />
            </PhotoAction>
            <PhotoAction>
              <FontAwesomeIcon size={"2x"} icon={faPaperPlane} />
            </PhotoAction>
          </div>
          <div>
            <FontAwesomeIcon size={"2x"} icon={faBookmark} />
          </div>
        </PhotoActions>
        <Likes
          onClick={() => {
            setIsOpen(true);
          }}
        >
          {likes === 1 ? "1 like" : `${likes} likes`}
        </Likes>
        <Modal
          style={{
            overlay: {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.55)",
            },
            content: {
              position: "absolute",
              width: "30rem",
              height: "30rem",
              left: "30rem",
              top: "20%",
              justifyContent: "center",
              alignItems: "center",
              // border: "1px solid #ccc",
              // background: "#fff",
              color: "black",
              overflow: "auto",
              WebkitOverflowScrolling: "touch",
              borderRadius: "4px",
              outline: "none",
              padding: "20px",
            },
          }}
          isOpen={isOpen}
          onRequestClose={() => setIsOpen(false)}
          contentLabel="Likes Modal"
        >
          {photiLikesData?.seePhotoLikes?.map((user: any, i: any) => (
            <UserRow key={i} user={user} />
          ))}
        </Modal>
        <Comments
          id={id}
          user={user}
          caption={caption}
          commentsNumber={commentsNumber}
          comments={comments}
        />
      </PhotoData>
    </PhotoContainer>
  );
}

export default Photo;
