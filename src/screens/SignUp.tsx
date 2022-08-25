import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import routes from "../routes";
import AuthLayout from "../components/auth/AuthLayout";
import Button from "../components/auth/Button";
import Input from "../components/auth/Input";
import FormBox from "../components/auth/FormBox";
import BottomBox from "../components/auth/BottomBox";
import styled from "styled-components";
import { FatLink } from "../components/shared";
import PageTitle from "../components/PageTitle";
import { useForm } from "react-hook-form";
import { gql } from "@apollo/client";
import {
  CreateAccountMutation,
  useCreateAccountMutation,
} from "../generated/graphql";
import FormError from "../components/auth/FormError";

interface IForm {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  result: string;
}

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Subtitle = styled(FatLink)`
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
`;

gql`
  mutation createAccount(
    $firstName: String!
    $lastName: String
    $username: String!
    $email: String!
    $password: String!
  ) {
    createAccount(
      firstName: $firstName
      lastName: $lastName
      username: $username
      email: $email
      password: $password
    ) {
      ok
      error
    }
  }
`;

function SignUp() {
  const navigate: any = useNavigate();
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
    const { email, firstName, lastName, username, password } = getValues();
    createAccount({
      variables: {
        email,
        firstName,
        lastName,
        username,
        password,
      },
    });
  };

  const clearSignUpError = () => clearErrors("result");

  const [createAccount, { loading }] = useCreateAccountMutation({
    onCompleted: ({ createAccount: { error } }: CreateAccountMutation) => {
      if (error) {
        return setError("result", {
          message: error,
        });
      }
      const { username, password } = getValues();
      navigate(routes.Home, {
        state: {
          message: "Account created. Please log in.",
          username,
          password,
        },
      });
    },
  });

  return (
    <AuthLayout>
      <PageTitle title="SignUp" />
      <FormBox>
        <HeaderContainer>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
          <Subtitle>
            Sign up to see photos and videos from your friends.
          </Subtitle>
        </HeaderContainer>
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
          <FormError error={errors?.firstName?.message} />
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
          <FormError error={errors?.email?.message} />
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
          <FormError error={errors?.username?.message} />
          <Input
            {...register("password", { required: "Password is required" })}
            name="password"
            type="password"
            placeholder="Password"
            hasError={Boolean(errors?.password?.message)}
            {...(onchange = clearSignUpError)}
          />
          <FormError error={errors?.password?.message} />
          <Button
            type="submit"
            value={loading ? "Loading..." : "Sign up"}
            disabled={!isValid || loading}
          />
          <FormError error={errors?.result?.message} />
        </form>
      </FormBox>
      <BottomBox cta="Have an account?" link={routes.Home} linktext="Log in" />
    </AuthLayout>
  );
}

export default SignUp;
