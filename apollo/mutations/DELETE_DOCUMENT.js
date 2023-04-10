import {gql} from '@apollo/client';

export const DELETE_DOCUMENT = gql`
  mutation deleteDocument($documentId: ID!) {
    deleteDocument(documentId: $documentId) {
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
