import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation loginMutation($email: String!) {
    login(email: $email) {
      id
      email
    }
  }
`;
