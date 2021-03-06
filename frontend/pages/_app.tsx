import "../styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import { AppProps } from "next/app";
import { useApollo } from "../lib/apolloClient";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
};

export default MyApp;
