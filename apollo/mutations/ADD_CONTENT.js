import {gql} from '@apollo/client';

export const ADD_CONTENT = gql`
  mutation addContent($contentInput: ContentInput!) {
    addContent(contentInput: $contentInput) {
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
            title
            thumbnail
            time
            link
            enable
            createdAt
            updatedAt
          }
          ... on Test {
            _id
            title
            thumbnail
            instructions
            duration
            totalMarks
            enable
            createdAt
            updatedAt
          }
          ... on Document {
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
