import Modal from "react-modal";
import CreateRoom from "../room/CreateRoom";

interface ICreateRoomModal {
  isOpen: boolean;
  setIsOpenFalse: any;
}

export default function CreateRoomModal({
  isOpen,
  setIsOpenFalse,
}: ICreateRoomModal) {
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
      <CreateRoom setIsOpenFalse={setIsOpenFalse} />
    </Modal>
  );
}
