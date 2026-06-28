import ProtectedRoute from "../../auths/components/protectedRoute";
import Feeds from "./feeds";

const Home = () => {
  return (
    <ProtectedRoute>
      <Feeds />
    </ProtectedRoute>
  );
};

export default Home;
