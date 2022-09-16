import { gql } from "@apollo/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import BottomBox from "../components/auth/BottomBox";
import Button from "../components/auth/Button";
import FormBox from "../components/auth/FormBox";
import Input from "../components/auth/Input";
import PageTitle from "../components/PageTitle";
import { FatText } from "../components/shared";
import {
  EditProfileMutation,
  useEditProfileMutation,
  useMeQuery,
  useSeeProfileQuery,
} from "../generated/graphql";
import useUser from "../hooks/useUser";
import { Avatar } from "./Profile";

interface IForm {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  result: string;
  avatar: FileList;
}
const Row = styled.div`
  margin-bottom: 20px;
  font-size: 16px;
  display: flex;
  align-items: center;
  width: 70%;
`;
const Container = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const Name = styled.div`
  margin: 0px 30px;
`;

gql`
  mutation editProfile(
    $firstName: String
    $lastName: String
    $email: String
    $password: String
    $bio: String
    $avatar: Upload
  ) {
    editProfile(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      bio: $bio
      avatar: $avatar
    ) {
      ok
      error
    }
  }
`;

export default function Edit() {
  const navigate = useNavigate();
  const { data: myData } = useUser();
  const {
    email: myEmail,
    firstName: myFirstName,
    lastName: myLastName,
    username,
    avatar: myAvatarString,
  }: any = myData?.me;
  const [path, setPath] = useState(myAvatarString);

  const { register, handleSubmit, setError, getValues } = useForm<IForm>({
    mode: "onChange",
    defaultValues: {
      username,
      lastName: myLastName,
      firstName: myFirstName,
      email: myEmail,
      // avatar:
    },
  });

  const onSubmitValid = () => {
    if (loading) {
      return;
    }
    // const { email, firstName, lastName, password } = getValues();
    const { email, firstName, lastName, avatar } = getValues();
    const variables = {
      lastName,
      firstName: firstName === "" ? myFirstName : firstName,
      email: email === "" ? myEmail : email,
      //   avatar: avatar.length === 0 ? myAvatarString : avatar.item(0),
      //   password: password === "" ? "origin" : password,
      ...(avatar.length !== 0 && { avatar: avatar.item(0) }),
    };
    // if (avatar.length !== 0) {
    //   Object.assign(variables, { avatar: avatar.item(0) });
    // }

    editProfile({
      variables,
      update: () => {
        navigate(`/users/${username}`);
        window.location.reload();
      }, // cache.modi}
    });
  };

  const [editProfile, { loading }] = useEditProfileMutation();

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
      <PageTitle title="Edit" />
      <BottomBox
        link={`/edit`}
        cta={"Edit profile - empty field won't be edited (except Last Name)"}
      />
      <FormBox>
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Row>
            <Avatar src={path} />
            <Row>
              <button
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                restore
              </button>
            </Row>
            <Row>
              <Input
                {...register("avatar")}
                type="file"
                name="avatar"
                accept="image/*"
                onChange={Preview}
              />
            </Row>
          </Row>
          <Row>
            <Name>firstName</Name>
            <Input
              {...register("firstName")}
              name="firstName"
              type="text"
              placeholder="First Name"
            />
          </Row>
          <Row>
            <Name>lastName</Name>
            <Input
              {...register("lastName")}
              name="lastName"
              type="text"
              placeholder="Last Name"
            />
          </Row>
          <Row>
            <Name>email</Name>
            <Input
              {...register("email")}
              name="email"
              type="text"
              placeholder="Email"
            />
          </Row>
          <Row>
            <Name>username</Name>
            <Input {...register("username")} disabled={true} />
          </Row>
          {/* <Input
            {...register("password")}
            name="password"
            type="password"
            placeholder="Password"
          /> */}
          <Button type="submit" value={loading ? "Loading..." : "Sign up"} />
        </form>
      </FormBox>
    </Container>
  );
}
