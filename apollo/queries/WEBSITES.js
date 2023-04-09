import {gql} from '@apollo/client';

export const WEBSITES = gql`
  query websites(
    $offset: Int
    $limit: Int
    $search: String
    $filter: WebsitesFilterInput
  ) {
    websites(offset: $offset, limit: $limit, search: $search, filter: $filter) {
      code
      success
      message
      token
      offset
      limit
      search
      filter {
        enable
      }
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
