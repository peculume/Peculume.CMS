import { useAuth } from 'providers/AuthProvider';

const HomePage = () => {
  const { user } = useAuth();
  return (
    <div>
      {!user?.verified && (
        <p style={{ fontWeight: 'bold' }}>
          Account requires verification to proceed
        </p>
      )}
    </div>
  );
};

export default HomePage;
