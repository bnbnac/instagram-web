import { gql } from "@apollo/client";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { start } from "repl";
import styled from "styled-components";
import { FEED_PHOTO_FRAGMENT } from "../fragment";
import { useUploadPhotoMutation } from "../generated/graphql";

const Container = styled.div`
  display: flex;
`;
const Column = styled.div`
  padding: 5px;
  display: flex;
  flex-direction: column;
`;
const Row = styled.div`
  display: flex;
  padding: 10px;
`;
const Input = styled.input``;
const Button = styled.button``;
const Image = styled.img`
  width: 90%;
  height: 90%;
`;

gql`
  mutation uploadPhoto($file: Upload!, $caption: String) {
    uploadPhoto(file: $file, caption: $caption) {
      ...FeedPhotoFragment
    }
  }
  ${FEED_PHOTO_FRAGMENT}
`;

export default function UploadPhoto() {
  const { register, handleSubmit, getValues } = useForm();
  const [uploadPhotoMutation, { loading, error }] = useUploadPhotoMutation();
  const onValid = () => {
    console.log(loading, error);
    if (loading) {
      return;
    }
    const { caption, file } = getValues();
    console.log(file.item(0));
    uploadPhotoMutation({
      variables: {
        file: file.item(0),
        caption,
      },
    });
  };
  return (
    <Container>
      <form style={{ display: "flex" }} onSubmit={handleSubmit(onValid)}>
        <Column style={{ flex: 1 }}>
          <Row>
            <Input
              {...register("file", { required: "file is required" })}
              type="file"
              name="file"
              accept="image/*"
            />
          </Row>
          <Row>
            <Image src="https://jinstagram-uploads.s3.amazonaws.com/uploads/4-1662725574476-1.jpg" />
          </Row>
        </Column>
        <Column style={{ flex: 0.7 }}>
          <Row>
            <Button type="submit">Share this!</Button>
          </Row>
          <Row style={{ flex: 1 }}>
            <textarea
              {...register("caption")}
              style={{
                height: "90%",
                width: "90%",
              }}
              name="caption"
              placeholder="Write a caption..."
            />
          </Row>
        </Column>
      </form>
    </Container>
  );
}
