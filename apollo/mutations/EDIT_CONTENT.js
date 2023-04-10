import {gql} from '@apollo/client';

export const EDIT_CONTENT = gql`
  mutation editContent($contentId: ID!, $contentInput: ContentInput!) {
    editContent(contentId: $contentId, contentInput: $contentInput) {
      code
      success
      message
      token
      payload {
        _id
        categories
        exams
        tags
        subject
        image
        title
        media {
          ... on Video {
            _id
          }
          ... on Test {
            _id
          }
          ... on Document {
            _id
          }
        }
        type
        paid
        price
        offer
        offerType
        highlight
        instructors
        language
        index
        description
        validity
        visible
        enable
        createdAt
        updatedAt
        likes
        purchases
        purchased
      }
    }
  }
`;
