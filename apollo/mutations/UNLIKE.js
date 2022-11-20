import {gql} from '@apollo/client';
import {CORE_LIKE_FIELDS} from '@fragments';

export const UNLIKE = gql`
  ${CORE_LIKE_FIELDS}
  mutation unlike($refId: ID!) {
    unlike(refId: $refId) {
      code
      success
      message
      token
      payload {
        ...CoreLikeFields
      }
    }
  }
`;
