import Modal from "react-modal";

export default function LikesModal() {
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
          width: "30rem",
          height: "30rem",
          left: "30rem",
          top: "20%",
          justifyContent: "center",
          alignItems: "center",
          // border: "1px solid #ccc",
          // background: "#fff",
          color: "black",
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
          borderRadius: "4px",
          outline: "none",
          padding: "20px",
        },
      }}
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      contentLabel="Likes Modal"
    >
      {photiLikesData?.seePhotoLikes?.map((user: any, i: any) => (
        <UserRow key={i} user={user} />
      ))}
    </Modal>
  );
}
