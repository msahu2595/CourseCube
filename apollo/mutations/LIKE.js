import {gql} from '@apollo/client';

export const LIKE = gql`
  mutation like($refId: ID!) {
    like(refId: $refId) {
      code
      success
      message
      token
    }
  }
`;
