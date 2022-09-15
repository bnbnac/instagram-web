import { gql } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AuthLayout from "../components/auth/AuthLayout";
import BottomBox from "../components/auth/BottomBox";
import Button from "../components/auth/Button";
import FormBox from "../components/auth/FormBox";
// import FormError from "../components/auth/FormError";
import Input from "../components/auth/Input";
import PageTitle from "../components/PageTitle";
import {
  EditProfileMutation,
  useEditProfileMutation,
} from "../generated/graphql";
import useUser from "../hooks/useUser";
import routes from "../routes";

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
  const { data: myData } = useUser();
  const myName = myData?.me?.username;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors, isValid },
    clearErrors,
  } = useForm<IForm>({ mode: "onChange" });

  const onSubmitValid = () => {
    if (loading) {
      return;
    }
    const { email, firstName, lastName, password } = getValues();
    editProfile({
      variables: {
        email,
        firstName,
        lastName,
        password,
      },
    });
  };

  const [editProfile, { loading }] = useEditProfileMutation({
    onCompleted: ({ editProfile: { error } }: EditProfileMutation) => {
      if (error) {
        return setError("result", {
          message: error,
        });
      }
      //   const { username, password } = getValues();
      navigate(routes.Profile, {
        // state: {
        //   message: "Account created. Please log in.",
        //   username,
        //   password,
        // },
      });
    },
  });

  const clearSignUpError = () => clearErrors("result");

  // seeprofile to set value current value

  return (
    <Container>
      <PageTitle title="Edit" />
      <FormBox>
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            {...register("firstName", {
              required: "First Name is required",
            })}
            name="firstName"
            type="text"
            placeholder="First Name"
            hasError={Boolean(errors?.firstName?.message)}
            {...(onchange = clearSignUpError)}
          />
          {/* <FormError error={errors?.firstName?.message} /> */}
          <Input
            {...register("lastName")}
            name="lastName"
            type="text"
            placeholder="Last Name"
          />
          <Input
            {...register("email", { required: "Email is required" })}
            name="email"
            type="text"
            placeholder="Email"
            hasError={Boolean(errors?.email?.message)}
            {...(onchange = clearSignUpError)}
          />
          {/* <FormError error={errors?.email?.message} /> */}
          <Input
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 5,
                message: "username should be longer than 5 chars",
              },
            })}
            name="username"
            type="text"
            placeholder="Username"
            hasError={Boolean(errors?.username?.message)}
            {...(onchange = clearSignUpError)}
          />
          {/* <FormError error={errors?.username?.message} /> */}
          <Input
            {...register("password", { required: "Password is required" })}
            name="password"
            type="password"
            placeholder="Password"
            hasError={Boolean(errors?.password?.message)}
            {...(onchange = clearSignUpError)}
          />
          {/* <FormError error={errors?.password?.message} /> */}
          <Button
            type="submit"
            // value={loading ? "Loading..." : "Sign up"}
            // disabled={!isValid || loading}
          />
          {/* <FormError error={errors?.result?.message} /> */}
        </form>
      </FormBox>
      <BottomBox
        cta="Click confirm button to edit your profile *****"
        link={`/users/${myName}`}
        linktext="Confirm"
      />
    </Container>
  );
}
