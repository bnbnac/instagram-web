import { gql } from "@apollo/client";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import BottomBox from "../components/auth/BottomBox";
import Button from "../components/auth/Button";
import FormBox from "../components/auth/FormBox";
import Input from "../components/auth/Input";
import PageTitle from "../components/PageTitle";
import {
  EditProfileMutation,
  useEditProfileMutation,
  useMeQuery,
  useSeeProfileQuery,
} from "../generated/graphql";
import useUser from "../hooks/useUser";

interface IForm {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  result: string;
}

const Container = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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
    avatar,
  }: any = myData?.me;

  const { register, handleSubmit, setError, getValues } = useForm<IForm>({
    mode: "onChange",
  });

  const onSubmitValid = () => {
    if (loading) {
      return;
    }
    // const { email, firstName, lastName, password } = getValues();
    const { email, firstName, lastName } = getValues();
    const variables = {
      email: email === "" ? myEmail : email,
      firstName: firstName === "" ? myFirstName : firstName,
      lastName,
      //   password: password === "" ? "origin" : password,
    };
    editProfile({
      variables,
    });

    //cache!!!!!!!!!

    navigate(`/users/${username}`);
  };

  const [editProfile, { loading }] = useEditProfileMutation({
    onCompleted: ({ editProfile: { error } }: EditProfileMutation) => {
      if (error) {
        return setError("result", {
          message: error,
        });
      }
    },
  });

  return (
    <Container>
      <PageTitle title="Edit" />
      <BottomBox
        link={`/edit`}
        cta={"Edit profile - empty field won't be changed (except Last Name)"}
      />
      <FormBox>
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            {...register("firstName")}
            name="firstName"
            type="text"
            placeholder="First Name"
          />
          <Input
            {...register("lastName")}
            name="lastName"
            type="text"
            placeholder="Last Name"
          />
          <Input
            {...register("email")}
            name="email"
            type="text"
            placeholder="Email"
          />
          <Input value={"fixed"} disabled={true} />
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
