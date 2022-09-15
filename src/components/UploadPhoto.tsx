import { gql } from "@apollo/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
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

export default function UploadPhoto({ setIsOpenFalse }: any) {
  const [path, setPath] = useState("");
  const { register, handleSubmit, getValues } = useForm();
  const [uploadPhotoMutation, { loading }] = useUploadPhotoMutation();

  const uploadPhotoUpdate = (cache: any, result: any) => {
    const {
      data: { uploadPhoto },
    } = result;
    if (uploadPhoto.id) {
      cache.modify({
        id: "ROOT_QUERY",
        fields: {
          seeFeed(prev: any) {
            return [uploadPhoto, ...prev];
          },
        },
      });
      setIsOpenFalse();
      window.location.reload();
    }
  };
  const onValid = () => {
    if (loading) {
      return;
    }
    const { caption, file } = getValues();
    uploadPhotoMutation({
      variables: {
        file: file.item(0),
        caption,
      },
      update: uploadPhotoUpdate,
    });
  };
  const Preview = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e: any) {
      setPath(e.target.result);
    };
    reader.readAsDataURL(file);
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
              onChange={Preview}
            />
          </Row>
          <Row>
            <Image id="img" src={path} />
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
