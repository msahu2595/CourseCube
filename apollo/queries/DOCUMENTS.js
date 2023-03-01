import {gql} from '@apollo/client';

export const DOCUMENTS = gql`
  query documents(
    $offset: Int
    $limit: Int
    $search: String
    $filter: DocumentsFilterInput
  ) {
    documents(
      offset: $offset
      limit: $limit
      search: $search
      filter: $filter
    ) {
      payload {
        _id
        title
        thumbnail
        url
        pages
        enable
        createdAt
        updatedAt
      }
    }
  }
`;
