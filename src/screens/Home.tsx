import { useNavigate } from "react-router-dom";
import { logUserOut } from "../apollo";

function Home() {
  const navigate: any = useNavigate();
  return (
    <div>
      <h1>Welcome~~</h1>
      <button onClick={() => logUserOut(navigate)}>logout now</button>
    </div>
  );
}

export default Home;
