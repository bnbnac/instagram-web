import styled from "styled-components";
import { FatText } from "../shared";
import { Link } from "react-router-dom";
import React from "react";

const CommentArea = styled.div``;

const CommentCaption = styled.span`
  margin-left: 10px;
  a {
    color: ${(props) => props.theme.accent};
    background-color: inherit;
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
  return (
    <CommentArea>
      <FatText>{user.username}</FatText>
      <CommentCaption>
        {payload?.split(" ").map((word, index) =>
          /#[[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/g.test(word) ? (
            <React.Fragment key={index}>
              <Link to={`/hashtags/${word}`}>{word} </Link>
            </React.Fragment>
          ) : /@[[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/g.test(word) ? (
            <React.Fragment key={index}>
              <Link to={`/users/${word.replace("@", "")}`}>{word} </Link>
            </React.Fragment>
          ) : (
            <React.Fragment key={index}>{word} </React.Fragment>
          )
        )}
      </CommentCaption>
    </CommentArea>
  );
}

export default Comment;
