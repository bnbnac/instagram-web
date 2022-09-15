import { gql } from "@apollo/client";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useSearchUsersLazyQuery } from "../generated/graphql";
import Input from "./auth/Input";

interface ISearchBar {
  placeholder?: string;
  fromWhere: string;
  userId?: any;
  setUserId?: any;
}
interface IUsername {
  clicked?: boolean;
}

const SSearchBar = styled(Input)`
  width: 400px;
`;
const Avatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 100%;
  background-color: ${(props) => props.theme.bgColor};
  overflow: hidden;
  cursor: pointer;
`;

const Username = styled.div<IUsername>`
  display: inline;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  background-color: ${(props) =>
    props.clicked ? "blue" : props.theme.bgColor};
`;

const Wrapper = styled.div`
  font-size: 14px;
  margin: 12px;
  color: grey;
  overflow-y: scroll;
`;
const Row = styled.div`
  display: inline;
  margin: 20px;
`;
gql`
  query searchUsers($keyword: String!) {
    searchUsers(keyword: $keyword) {
      id
      username
      avatar
    }
  }
`;

export default function SearchBar({
  placeholder,
  fromWhere,
  userId,
  setUserId,
}: ISearchBar) {
  const navigate = useNavigate();
  const [startQueryFn, { loading, data }] = useSearchUsersLazyQuery();

  const { register, handleSubmit } = useForm({
    mode: "onChange",
  });
  const onValid = ({ keyword }: any) => {
    if (fromWhere !== "CreateRoom") {
      const sliced = keyword.slice(1);
      if (keyword[0] === "@") {
        navigate(`/users/${sliced}`);
      } else if (keyword[0] === "#") {
        navigate(`/tags/${sliced}`);
      } else {
        return;
      }
    } else {
      startQueryFn({
        variables: {
          keyword,
        },
      });
      return;
    }
  };
  return (
    <Wrapper>
      <form onSubmit={handleSubmit(onValid)}>
        <SSearchBar {...register("keyword")} placeholder={placeholder} />
      </form>
      {fromWhere === "CreateRoom"
        ? data?.searchUsers?.map((user) => (
            <Row
              onClick={() => {
                setUserId(Number(user?.id + ""));
              }}
              key={user?.id}
            >
              <Avatar src={user?.avatar + ""} />
              <Username>{user?.username}</Username>
            </Row>
          ))
        : null}
    </Wrapper>
  );
}
