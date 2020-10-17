import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../graphql/auth/mutations/login.mutation";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [loginData, setLoginData] = useState<{
    username: string;
    password: string;
  }>({ username: "", password: "" });
  const [
    loginMutation,
    { loading: loginLoading, error: loginError },
  ] = useMutation(LOGIN_MUTATION, {
    onCompleted({ login }) {
      document.cookie = "cookie=example-cookie";
      document.cookie = `email=${loginData.username}`;
      router.push("/portal");
    },
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          loginMutation({ variables: { email: loginData.username } });
        }}
      >
        <input
          value={loginData.username}
          onChange={(e) => {
            e.persist();
            setLoginData((prev) => ({ ...prev, username: e.target.value }));
          }}
          placeholder="email"
        />
        <input
          value={loginData.password}
          onChange={(e) => {
            e.persist();
            setLoginData((prev) => ({ ...prev, password: e.target.value }));
          }}
          placeholder="şifre"
        />
        <button type="submit">Submit</button>
        {loginLoading && <p>Loading authentication...</p>}
        {loginError && <p style={{ color: "red" }}>Error Occured On Login</p>}
      </form>
    </div>
  );
}
