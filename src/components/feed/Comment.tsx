import styled from "styled-components";
import { FatText } from "../shared";

const CommentArea = styled.div``;

const CommentCaption = styled.span`
  margin-left: 10px;
`;

export interface IComment {
  user: {
    avatar?: string | null | undefined;
    username: string | null | undefined;
  };
  payload?: string | null | undefined;
}

function Comment({ user, payload }: IComment) {
  return (
    <CommentArea>
      <FatText>{user.username}</FatText>
      <CommentCaption>{payload}</CommentCaption>
    </CommentArea>
  );
}

export default Comment;
