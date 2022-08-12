import { Dispatch, SetStateAction } from "react";
interface IsLoggedInProps {
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}
function Login({ setIsLoggedIn }: IsLoggedInProps) {
  return (
    <div>
      <h1>Login</h1>
      <button onClick={() => setIsLoggedIn(true)}>login now</button>
    </div>
  );
}

export default Login;
