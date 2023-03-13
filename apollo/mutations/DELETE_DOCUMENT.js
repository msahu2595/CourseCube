import {gql} from '@apollo/client';

export const DELETE_DOCUMENT = gql`
  mutation DeleteDocument($documentId: ID!) {
    deleteDocument(documentId: $documentId) {
      payload {
        _id
        title
        url
        pages
        enable
        createdAt
        updatedAt
      }
    }
  }
`;
