import { GetServerSideProps } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import cookie from "cookie";

const Portal: React.FC<{}> = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h2>PORTAL PAGE</h2>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const localCookie =
    context.req?.headers?.cookie && cookie.parse(context.req?.headers?.cookie);
  if (localCookie?.email) {
    return {
      props: {},
    };
  } else {
    context.res.setHeader("location", "/");
    context.res.statusCode = 302;
    context.res.end();
    return {
      props: {},
    };
  }
};

export default Portal;
