import styled from "styled-components";
import { FatText } from "../shared";
import sanitizeHtml from "sanitize-html";

const CommentArea = styled.div``;

const CommentCaption = styled.span`
  margin-left: 10px;
  mark {
    background-color: inherit;
    color: ${(props) => props.theme.accent};
    cursor: pointer;
    &: hover {
      text-decoration: underline;
    }
  }
`;

export interface IComment {
  user: {
    avatar?: string | null | undefined;
    username: string | null | undefined;
  };
  payload?: string | null | undefined;
}

function Comment({ user, payload }: IComment) {
  const sanitizedPayload = sanitizeHtml(
    payload?.replace(/#[[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/g, "<mark>$&</mark>") || "",
    {
      allowedTags: ["mark"],
    }
  );
  return (
    <CommentArea>
      <FatText>{user.username}</FatText>
      <CommentCaption
        dangerouslySetInnerHTML={{
          __html: sanitizedPayload,
        }}
      />
    </CommentArea>
  );
}

export default Comment;
