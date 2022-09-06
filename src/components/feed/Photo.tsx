import { gql } from "@apollo/client";
import {
  faBookmark,
  faComment,
  faHeart,
  faPaperPlane,
} from "@fortawesome/free-regular-svg-icons";
import { faHeart as SolidHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useToggleLikeMutation } from "../../generated/graphql";
import Avatar from "../Avatar";
import { FatText } from "../shared";
import Comments from "./Comments";

const PhotoContainer = styled.div`
  background-color: white;
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
`;

gql`
  mutation toggleLike($id: Int!) {
    toggleLike(id: $id) {
      ok
      error
    }
  }
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
        <Likes onClick={() => {}}>
          {likes === 1 ? "1 like" : `${likes} likes`}
        </Likes>
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
