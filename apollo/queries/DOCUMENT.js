import {gql} from '@apollo/client';

export const DOCUMENT = gql`
  query document($documentId: ID!) {
    document(documentId: $documentId) {
      code
      success
      message
      token
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
