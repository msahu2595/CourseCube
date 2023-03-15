import {gql} from '@apollo/client';

export const DELETE_CONTENT = gql`
  mutation DeleteContent($contentId: ID!) {
    deleteContent(contentId: $contentId) {
      message
      payload {
        _id
        subject
        image
        title
        type
        paid
        description
        validity
        visible
        enable
        createdAt
        updatedAt
        language
      }
    }
  }
`;
