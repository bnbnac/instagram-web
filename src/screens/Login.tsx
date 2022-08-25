import styled from "styled-components";
import {
  faFacebookSquare,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import routes from "../routes";
import AuthLayout from "../components/auth/AuthLayout";
import Button from "../components/auth/Button";
import Separator from "../components/auth/Separator";
import Input from "../components/auth/Input";
import FormBox from "../components/auth/FormBox";
import BottomBox from "../components/auth/BottomBox";
import PageTitle from "../components/PageTitle";
import { useForm } from "react-hook-form";
import FormError from "../components/auth/FormError";
import { gql } from "@apollo/client";
import { logUserIn } from "../apollo";
import { useLocation } from "react-router-dom";
import { LoginMutation, useLoginMutation } from "../generated/graphql";

const FacebookLogin = styled.div`
  color: #385285;
  span {
    margin-left: 10px;
    font-weight: 600;
  }
`;

const Notification = styled.div`
  color: #2ecc71;
`;

interface IForm {
  username: string;
  password: string;
  result: string;
}

// for code gen?
gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      error
    }
  }
`;

function Login() {
  const location: any = useLocation();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    getValues,
    formState: { errors, isValid },
  } = useForm<IForm>({
    mode: "onChange",
    defaultValues: {
      username: location?.state?.username,
      password: location?.state?.password,
    },
  });

  const onSubmitValid = () => {
    if (loading) {
      return;
    }
    const { username, password } = getValues();
    login({
      variables: {
        username,
        password,
      },
    });
  };
  const [login, { loading }] = useLoginMutation({
    onCompleted: ({ login: { error, token } }: LoginMutation) => {
      if (error) {
        return setError("result", {
          message: error,
        });
      } else if (token) {
        logUserIn(token);
      }
    },
  });
  const clearLoginError = () => clearErrors("result");

  return (
    <AuthLayout>
      <PageTitle title="Login" />
      <FormBox>
        <div>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
        </div>
        <Notification> {location?.state?.message}</Notification>
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            {...register("username", {
              required: "username is required",
              minLength: {
                value: 5,
                message: "username should be longer than 5 chars",
              },
            })}
            name="username"
            type="text"
            placeholder="Username"
            hasError={Boolean(errors?.username?.message)}
            {...(onchange = clearLoginError)}
          />
          <FormError error={errors?.username?.message} />
          <Input
            {...register("password", { required: "password is required" })}
            name="password"
            type="password"
            placeholder="Password"
            hasError={Boolean(errors?.password?.message)}
            {...(onchange = clearLoginError)}
          />
          <FormError error={errors?.password?.message} />
          <Button
            type="submit"
            value={loading ? "Loading..." : "Log in"}
            disabled={!isValid || loading}
          />
          <FormError error={errors?.result?.message} />
        </form>
        <Separator text="OR" />
        <FacebookLogin>
          <FontAwesomeIcon icon={faFacebookSquare} />
          <span>Log in with Facebook</span>
        </FacebookLogin>
      </FormBox>
      <BottomBox
        cta="Don't have an account?"
        link={routes.SignUp}
        linktext="Sign Up"
      />
    </AuthLayout>
  );
}

export default Login;
