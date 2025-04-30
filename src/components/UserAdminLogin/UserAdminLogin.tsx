import { FormEvent, useState } from "react";
import styles from "./UserAdminLogin.module.scss";

const UserAdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }

  return (
    <form className={styles.loginForm} onSubmit={handleOnSubmit}>
      <div className="formGroup">
        <label htmlFor="email">Email</label>
        <input id="name" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="formGroup">
        <label htmlFor="password">Passowrd</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <input className={styles.submitButton} type="submit" value="Login" />
    </form>
  );
};

export default UserAdminLogin;
