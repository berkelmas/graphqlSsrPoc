import { gql } from "@apollo/client";

export const ADD_TRIP_MUTATION = gql`
  mutation BookTrips($launchIds: [ID]!) {
    bookTrips(launchIds: $launchIds) {
      success
      message
      launches {
        id
        site
      }
    }
  }
`;
