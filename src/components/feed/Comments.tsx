import { gql } from "@apollo/client";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useCreateCommentMutation } from "../../generated/graphql";
import useUser from "../../hooks/useUser";
import Comment from "./Comment";

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

gql`
  mutation createComment($photoId: Int!, $payload: String!) {
    createComment(photoId: $photoId, payload: $payload) {
      ok
      error
      id
    }
  }
`;

interface IComments {
  id: number;
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

function Comments({
  id: photoId,
  user,
  caption,
  commentsNumber,
  comments,
}: IComments) {
  const { data: userData } = useUser();
  const { register, handleSubmit, setValue, getValues } = useForm();
  const createCommentUpdate = (cache: any, result: any) => {
    const { payload } = getValues();
    setValue("payload", "");
    const {
      data: {
        createComment: { ok, id },
      },
    } = result;
    if (ok && userData?.me) {
      // fake comment
      const newComment = {
        __typename: "Comment",
        id,
        createdAt: Date.now() + "",
        isMine: true,
        payload,
        user: { ...userData?.me },
      };
      // create comment cache
      const newCacheComment = cache.writeFragment({
        fragment: gql`
          fragment WriteComment on Comment {
            id
            createdAt
            isMine
            payload
            user {
              username
              avatar
            }
          }
        `,
        data: newComment,
      });
      // modifying cache to fake comment
      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          comments(prev: any) {
            return [...prev, newCacheComment];
          },
          commentsNumber(prev: any) {
            return prev + 1;
          },
        },
      });
    }
  };
  const [createCommentMutataion, { loading }] = useCreateCommentMutation({
    update: createCommentUpdate,
  });
  const onValid = (data: any) => {
    const { payload } = data;
    if (loading) {
      return;
    }
    photoId &&
      createCommentMutataion({
        variables: {
          photoId: photoId,
          payload,
        },
      });
  };
  const captionComment = {
    id: 1,
    payload: caption || "",
    user,
    isMine: false,
    createdAt: "",
  };
  return (
    <CommentsContainer>
      <Comment photoId={photoId} comment={captionComment} />
      <CommentCount>
        {commentsNumber === 1 ? "1 comment" : `${commentsNumber} comments`}
      </CommentCount>
      {comments?.map(
        (comment) =>
          comment && (
            <Comment photoId={photoId} key={comment.id} comment={comment} />
          )
      )}
      <div>
        <form onSubmit={handleSubmit(onValid)}>
          <input
            {...register("payload", { required: "payload is required" })}
            name="payload"
            type="text"
            placeholder="Write a comment..."
          />
        </form>
      </div>
    </CommentsContainer>
  );
}

export default Comments;
