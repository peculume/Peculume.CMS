import { FormEvent, useState } from 'react';
import styles from './UserAdminLogin.module.scss';
import { useAuthLogin } from 'hooks/AuthHooks/AuthHooks';
import { useNavigate } from 'react-router';

const UserAdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login, loginIsPending } = useAuthLogin({
    onSuccess: () => {
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
    <div className={styles.loginPage}>
      <div className={styles.loginPanel}>
        <div className={styles.header}>
          <div className={styles.brandMark}>P</div>
          <div>
            <p className={styles.kicker}>Peculume CMS</p>
            <h1>Admin sign in</h1>
          </div>
        </div>
        <form className={styles.loginForm} onSubmit={handleOnSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              autoComplete="email"
              placeholder="admin@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              autoComplete="current-password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <input
            className={styles.submitButton}
            type="submit"
            value={loginIsPending ? 'Signing in...' : 'Sign in'}
            disabled={loginIsPending}
          />
          {error && <p className={styles.error}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default UserAdminLogin;
