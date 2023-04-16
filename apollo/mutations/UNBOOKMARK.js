import {gql} from '@apollo/client';

export const UNBOOKMARK = gql`
  mutation unbookmark($refId: ID!) {
    unbookmark(refId: $refId) {
      code
      success
      message
      token
    }
  }
`;
