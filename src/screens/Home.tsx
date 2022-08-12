import { Dispatch, SetStateAction } from "react";
interface IsLoggedInProps {
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}
function Home({ setIsLoggedIn }: IsLoggedInProps) {
  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => setIsLoggedIn(false)}>logout now</button>
    </div>
  );
}

export default Home;
