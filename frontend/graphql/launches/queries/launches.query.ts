import { gql } from "@apollo/client";

export const GET_LAUNCHES_PAGINATION = gql`
  query launches($pageSize: Int, $after: String) {
    launches(pageSize: $pageSize, after: $after) {
      cursor
      hasMore
      launches {
        id
        site
      }
    }
  }
`;
