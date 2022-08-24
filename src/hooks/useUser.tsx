import { gql, useReactiveVar } from "@apollo/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedInVar, logUserOut } from "../apollo";
import { useMeQuery } from "../generated/graphql";

gql`
  query me {
    me {
      username
      avatar
    }
  }
`;

// `data.me === null` is depend on the work of protectedResolver in meQuery.
// i.e.  front should send the token by header to the back??
// Login(Mutation)=>logUserIn(set token on localStorage)=>
// authLink contains this token when setContext
// link httpLink(backend)
// if isloggedinvar(REACTIVE VAR) is true, Header component called
// Header component implement useUser(has QUERY me)
// me has protectedResolver what verifies token in CONTEXT(header)
function useUser() {
  const navigate = useNavigate();
  const hasToken = useReactiveVar(isLoggedInVar);
  const { data } = useMeQuery({
    skip: !hasToken,
  });
  useEffect(() => {
    if (data?.me === null) {
      logUserOut(navigate);
    }
  }, [data]);
  return;
}

export default useUser;
