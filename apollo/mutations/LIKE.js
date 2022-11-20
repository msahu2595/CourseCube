import {gql} from '@apollo/client';
import {CORE_LIKE_FIELDS} from '@fragments';

export const LIKE = gql`
  ${CORE_LIKE_FIELDS}
  mutation like($refId: ID!) {
    like(refId: $refId) {
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
