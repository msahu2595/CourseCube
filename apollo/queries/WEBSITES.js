import {gql} from '@apollo/client';

export const WEBSITES = gql`
  query websites($offset: Int, $limit: Int) {
    websites(offset: $offset, limit: $limit) {
      payload {
        _id
        name
        link
        enable
        createdAt
        updatedAt
      }
    }
  }
`;
