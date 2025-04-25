import { Link } from "react-router";

const HomePage = () => {
  return (
    <div>
      <Link to={"/products"}>Products</Link>
    </div>
  );
};

export default HomePage;