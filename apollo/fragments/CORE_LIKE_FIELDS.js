import {gql} from '@apollo/client';

export const CORE_LIKE_FIELDS = gql`
  fragment CoreLikeFields on Like {
    __typename
    _id
    user {
      __typename
      _id
    }
    refId
    active
    createdAt
    updatedAt
  }
`;
