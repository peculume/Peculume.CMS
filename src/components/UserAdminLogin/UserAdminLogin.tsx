import { FormEvent, useState } from 'react';
import styles from './UserAdminLogin.module.scss';
import { useAuthLogin } from 'hooks/AuthHooks/AuthHooks';
import { AuthResponse } from 'types/productTypes';
import { useNavigate } from 'react-router';

const UserAdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login, loginIsPending } = useAuthLogin({
    onSuccess: (data: AuthResponse) => {
      navigate('/');
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    login({ email, password });
  };

  return (
    <form className={styles.loginForm} onSubmit={handleOnSubmit}>
      <div className="formGroup">
        <label htmlFor="email">Email</label>
        <input
          id="name"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="formGroup">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <input
        className={styles.submitButton}
        type="submit"
        value="Login"
        disabled={loginIsPending}
      />
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default UserAdminLogin;
