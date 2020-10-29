import { useMemo } from "react";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloLink } from "apollo-link";
import { GET_FAKE_DATA } from "../graphql/fake/queries/fake.query";

let apolloClient;

function createApolloClient(ctx = null) {
  const enchancedFetch = (url, init) =>
    fetch(url, {
      ...init,
      headers: {
        ...init.headers,
        ...(ctx.req?.headers?.cookie && { Cookie: ctx.req?.headers?.cookie }),
      },
    }).then((response) => response);

  const cache = new InMemoryCache({
    typePolicies: {
      User: {
        fields: {
          clientArrState: {
            read(_, { variables }) {
              return [];
            },
          },
        },
      },
    },
  });

  const mainBackendLink = new HttpLink({
    uri: "http://localhost:4000", // Server URL (must be absolute)
    credentials: "include", // Additional fetch() options like `credentials` or `headers`
    fetch: ctx ? enchancedFetch : fetch,
  });
  const fakeBackendLink = new HttpLink({
    uri: "http://localhost:5000", // Server URL (must be absolute)
    credentials: "include", // Additional fetch() options like `credentials` or `headers`
    fetch: ctx ? enchancedFetch : fetch,
  });

  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: ApolloLink.split(
      (operation) => operation.getContext().clientName === "fake-backend",
      fakeBackendLink,
      mainBackendLink
    ),
    cache,
  });
}

export function initializeApollo(initialState = null, ctx = null) {
  const _apolloClient = apolloClient ?? createApolloClient(ctx);

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();
    // Restore the cache using the data passed from getStaticProps/getServerSideProps
    // combined with the existing cached data
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
