import {gql} from '@apollo/client';

export const UNBOOKMARK = gql`
  mutation unbookmark($refId: ID!, $type: BookmarkType!) {
    unbookmark(refId: $refId, type: $type) {
      code
      success
      message
      token
    }
  }
`;
