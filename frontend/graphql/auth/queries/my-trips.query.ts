import { gql } from "@apollo/client";

export const GET_MY_TRIPS = gql`
  query me {
    me {
      email
      token
      clientArrState @client
      trips {
        id
        site
      }
    }
  }
`;
