import { gql } from "@apollo/client";

export const GET_FAKE_DATA = gql`
  query fakeData($pageIndex: Int!, $pageSize: Int!) {
    orders(pageIndex: $pageIndex, pageSize: $pageSize) {
      item
      orderer
      orderDate
    }
  }
`;
