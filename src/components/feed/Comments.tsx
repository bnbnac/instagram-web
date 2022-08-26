import styled from "styled-components";
import { FatText } from "../shared";
import { IPhoto } from "./Photo";

const CommentsContainer = styled.div`
  margin-top: 20px;
`;
const CommentArea = styled.div``;
const CommentCaption = styled.span`
  margin-left: 10px;
`;
const CommentCount = styled.span`
  opacity: 0.7;
  margin: 10px 0px;
  display: block;
  font-size: 10px;
  font-weight: 600;
`;

export interface IComments {
  user: {
    avatar?: string | null | undefined;
    username: string | null | undefined;
  };
  caption?: string | null | undefined;
  commentsNumber: number;
  comments: Array<{
    __typename?: "Comment";
    id: number;
    payload: string;
    isMine: boolean;
    createdAt: string;
    user: { __typename?: "User"; username: string; avatar?: string | null };
  } | null>;
}

function Comments({ user, caption, commentsNumber, comments }: IComments) {
  return (
    <CommentsContainer>
      <CommentArea>
        <FatText>{user.username}</FatText>
        <CommentCaption>{caption}</CommentCaption>
      </CommentArea>
      <CommentCount>
        {commentsNumber === 1 ? "1 comment" : `${commentsNumber} comments`}
      </CommentCount>
      {comments?.map(
        (comment) =>
          comment && (
            <CommentArea key={comment.id}>
              <FatText>{comment.user.username}</FatText>
              <CommentCaption>{comment.payload}</CommentCaption>
            </CommentArea>
          )
      )}
    </CommentsContainer>
  );
}

export default Comments;
