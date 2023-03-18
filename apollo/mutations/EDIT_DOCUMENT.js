import {gql} from '@apollo/client';

export const EDIT_DOCUMENT = gql`
  mutation editDocument($documentId: ID!, $documentInput: DocumentEditInput!) {
    editDocument(documentId: $documentId, documentInput: $documentInput) {
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
