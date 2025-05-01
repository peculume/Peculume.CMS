import { useAuth } from "providers/AuthProvider";

const HomePage = () => {
  const { authData } = useAuth();
  return (
    <div>
      {!authData?.adminUser.verified && (
        <p style={{ fontWeight: "bold" }}>Account requires verification to proceed</p>
      )}
    </div>
  );
};

export default HomePage;