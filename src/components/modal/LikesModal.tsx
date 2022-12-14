import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import Modal from "react-modal";
import { USER_FRAGMENT } from "../../fragment";
import UserRow from "../feed/UserRow";

interface ILikesModal {
  photoId: number;
  isOpen: boolean;
  setIsOpenFalse: any;
}

const LIKES_QUERY = gql`
  query seePhotoLikes($id: Int!) {
    seePhotoLikes(id: $id) {
      ...UserFragment
    }
  }
  ${USER_FRAGMENT}
`;

export default function LikesModal({
  isOpen,
  setIsOpenFalse,
  photoId,
}: ILikesModal) {
  const { data: photoLikesData, loading } = useQuery(LIKES_QUERY, {
    variables: { id: photoId },
  });
  return (
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
          flex: 1,
          left: "30%",
          right: "30%",
          top: "20%",
          bottom: "20%",
          justifyContent: "center",
          alignItems: "center",
          color: "black",
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
          borderRadius: "4px",
          outline: "none",
          padding: "20px",
        },
      }}
      isOpen={isOpen}
      onRequestClose={setIsOpenFalse}
      contentLabel="Likes Modal"
    >
      {photoLikesData?.seePhotoLikes?.map((user: any, i: any) => (
        <UserRow key={i} user={user} />
      ))}
    </Modal>
  );
}
