import styled from "styled-components";
import { FatText } from "../shared";
import { Link } from "react-router-dom";
import React from "react";
import { gql } from "@apollo/client";
import { useDeleteCommentMutation } from "../../generated/graphql";
import useUser from "../../hooks/useUser";

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
const XButton = styled.button`
  font-size: 8px;
`;

interface IComment {
  comment: {
    __typename?: "Comment";
    id: number;
    payload: string;
    isMine: boolean;
    createdAt: string;
    user: { __typename?: "User"; username: string; avatar?: string | null };
  };
  photoId: number;
}

gql`
  mutation deleteComment($id: Int!) {
    deleteComment(id: $id) {
      ok
    }
  }
`;

function Comment({ photoId, comment }: IComment) {
  const { id, payload, isMine, user } = comment;
  const updateDeleteComment = (cache: any, result: any) => {
    const {
      data: {
        deleteComment: { ok },
      },
    } = result;
    if (ok) {
      // evict : POWER of apollo ver.3
      cache.evict({ id: `Comment:${id}` });
      // no need of fragment : no need to write cache just modify the number
      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          commentsNumber(prev: any) {
            return prev - 1;
          },
        },
      });
    }
  };
  const [deleteCommentMutation] = useDeleteCommentMutation({
    variables: {
      id,
    },
    update: updateDeleteComment,
  });
  const onDeleteClick = () => {
    deleteCommentMutation();
  };
  return (
    <CommentArea>
      <Link to={`/users/${user.username}`}>
        <FatText>{user.username}</FatText>
      </Link>
      <CommentCaption>
        {payload?.split(" ").map((word, index) =>
          /#[[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/g.test(word) ? (
            <React.Fragment key={index}>
              <Link to={`/tags/${word.replace("#", "")}`}>{word} </Link>
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
      {isMine ? <XButton onClick={onDeleteClick}>X</XButton> : null}
    </CommentArea>
  );
}

export default Comment;
