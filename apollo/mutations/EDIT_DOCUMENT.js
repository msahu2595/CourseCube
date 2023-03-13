import {gql} from '@apollo/client';

export const EDIT_DOCUMENT = gql`
  mutation EditDocument($documentId: ID!, $documentInput: DocumentEditInput!) {
    editDocument(documentId: $documentId, documentInput: $documentInput) {
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
