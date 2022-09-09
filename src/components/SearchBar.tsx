import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Input from "./auth/Input";

const SSearchBar = styled(Input)`
  width: 400px;
`;

export default function SearchBar() {
  const navigate = useNavigate();

  const { register, getValues, handleSubmit } = useForm({
    mode: "onChange",
  });
  const onValid = () => {
    const { keyword } = getValues();
    const sliced = keyword.slice(1);
    if (keyword[0] === "@") {
      navigate(`/users/${sliced}`);
    } else if (keyword[0] === "#") {
      navigate(`/tags/${sliced}`);
    } else {
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit(onValid)}>
      <SSearchBar
        {...register("keyword")}
        placeholder="search USER with @AnyUsername, TAG with #AnyHashtag"
      />
    </form>
  );
}
