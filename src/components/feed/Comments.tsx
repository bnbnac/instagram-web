import styled from "styled-components";
import Comment, { IComment } from "./Comment";

const CommentsContainer = styled.div`
  margin-top: 20px;
`;

const CommentCount = styled.span`
  opacity: 0.7;
  margin: 10px 0px;
  display: block;
  font-size: 10px;
  font-weight: 600;
`;

export interface IComments extends IComment {
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
      <Comment user={user} payload={caption} />
      <CommentCount>
        {commentsNumber === 1 ? "1 comment" : `${commentsNumber} comments`}
      </CommentCount>
      {comments?.map(
        (comment) =>
          comment && (
            <Comment
              key={comment.id}
              user={comment.user}
              payload={comment.payload}
            />
          )
      )}
    </CommentsContainer>
  );
}

export default Comments;
