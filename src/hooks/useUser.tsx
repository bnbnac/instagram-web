import { gql, useReactiveVar } from "@apollo/client";
import { useEffect } from "react";
import { isLoggedInVar, logUserOut } from "../apollo";
import { useMeQuery } from "../generated/graphql";

gql`
  query me {
    me {
      id
      username
      avatar
      firstName
      lastName
      email
    }
  }
`;

function useUser() {
  const hasToken = useReactiveVar(isLoggedInVar);
  const { data } = useMeQuery({
    skip: !hasToken,
  });
  useEffect(() => {
    if (data?.me === null) {
      logUserOut();
    }
  }, [data]);
  return { data };
}

export default useUser;
