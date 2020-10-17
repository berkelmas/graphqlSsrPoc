import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import cookie from "cookie";
import { GetServerSideProps } from "next";
import { initializeApollo } from "../lib/apolloClient";
import { GET_LAUNCHES_PAGINATION } from "../graphql/launches/queries/launches.query";
import { useQuery, NetworkStatus, gql, useMutation } from "@apollo/client";
import {
  IGetLaunches,
  IGetLaunchesVariables,
} from "../graphql/launches/queries/types/launces.types";
import { userInfo } from "../graphql/reactive-variables/auth.variables";
import { GET_MY_TRIPS } from "../graphql/auth/queries/my-trips.query";
import {
  IGetMeVariables,
  IMe,
} from "../graphql/auth/queries/types/my-trips.types";
import { ADD_TRIP_MUTATION } from "../graphql/auth/mutations/add-trip.mutation";
import {
  IAddTripData,
  IAddTripVariables,
} from "../graphql/auth/mutations/types/add-trip.types";

const Home: React.FC<{ authenticated: boolean }> = ({ authenticated }) => {
  const {
    data: latestLaunches,
    loading,
    error,
    networkStatus,
    fetchMore,
  } = useQuery<IGetLaunches, IGetLaunchesVariables>(GET_LAUNCHES_PAGINATION, {
    variables: { pageSize: 10, after: null },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });
  const { data: myTrips } = useQuery<IMe, IGetMeVariables>(GET_MY_TRIPS);
  const [addTrip] = useMutation<IAddTripData, IAddTripVariables>(
    ADD_TRIP_MUTATION,
    {
      update(cache, { data: { bookTrips } }) {
        cache.modify({
          fields: {
            me(existingMe = { email: "", token: "", trips: [] }) {
              const newTrip = cache.writeFragment({
                data: bookTrips.launches[0],
                fragment: gql`
                  fragment NewTrip on Launch {
                    id
                    site
                  }
                `,
              });
              const newData = {
                ...existingMe,
                trips: [...existingMe.trips, newTrip],
              };
              console.log(newData);
              return newData;
            },
          },
        });
      },
    }
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h2>MAIN LANDING PAGE</h2>
      {!authenticated ? (
        <Link href="/login">GO TO LOGIN</Link>
      ) : (
        <Link href="/portal">GO TO MY PORTAL</Link>
      )}
      <h2>Latest Launches</h2>
      <p>{userInfo().email}</p>
      {latestLaunches?.launches?.launches.map((item) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <p>
            {item.id} - {item.site}
          </p>
          {myTrips.me.trips.findIndex((trip) => trip.id === item.id) === -1 && (
            <button
              onClick={() => addTrip({ variables: { launchIds: [item.id] } })}
              style={{ marginLeft: 20 }}
            >
              BOOK NOW!
            </button>
          )}
        </div>
      ))}
      {!latestLaunches?.launches?.hasMore && (
        <p style={{ color: "blue" }}>All data has been loaded!</p>
      )}
      <button
        disabled={
          networkStatus === NetworkStatus.fetchMore ||
          !latestLaunches?.launches?.hasMore
        }
        onClick={(e) =>
          fetchMore({
            variables: {
              pageSize: 10,
              after: latestLaunches.launches.cursor,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) return prev;
              return {
                launches: {
                  ...prev.launches,
                  cursor: fetchMoreResult.launches.cursor,
                  hasMore: fetchMoreResult.launches.hasMore,
                  launches: [
                    ...prev.launches.launches,
                    ...fetchMoreResult.launches.launches,
                  ],
                },
              };
            },
          })
        }
      >
        More Data
      </button>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const localCookie =
    context.req?.headers?.cookie && cookie.parse(context.req?.headers?.cookie);

  // REINITIALIZE APOLLO FOR EVERY SSR.
  const apolloClient = initializeApollo(null, context);

  await apolloClient.query({
    query: GET_LAUNCHES_PAGINATION,
    variables: { pageSize: 10, after: null },
  });

  if (localCookie && localCookie.email) {
    await apolloClient.query({ query: GET_MY_TRIPS });
    return {
      props: {
        authenticated: true,
        initialApolloState: apolloClient.cache.extract(),
      },
    };
  } else {
    return {
      props: {
        authenticated: false,
        initialApolloState: apolloClient.cache.extract(),
      },
    };
  }
};

export default Home;
