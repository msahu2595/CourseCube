import {gql} from '@apollo/client';

export const UNLIKE = gql`
  mutation unlike($refId: ID!) {
    unlike(refId: $refId) {
      code
      success
      message
      token
    }
  }
`;
