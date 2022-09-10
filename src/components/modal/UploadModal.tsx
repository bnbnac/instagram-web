import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import Modal from "react-modal";
import { USER_FRAGMENT } from "../../fragment";
import UserRow from "../feed/UserRow";
import UploadPhoto from "../UploadPhoto";

interface IUploadModal {
  isOpen: boolean;
  setIsOpenFalse: any;
}

export default function UploadModal({ isOpen, setIsOpenFalse }: IUploadModal) {
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
          top: "15%",
          bottom: "15%",
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
      contentLabel="Upload Modal"
    >
      <UploadPhoto />
    </Modal>
  );
}
