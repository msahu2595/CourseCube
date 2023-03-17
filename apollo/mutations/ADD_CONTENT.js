import {gql} from '@apollo/client';

export const ADD_CONTENT = gql`
  mutation AddContent($contentInput: ContentInput!) {
    addContent(contentInput: $contentInput) {
      payload {
        __typename
        _id
        categories
        exams
        tags
        subject
        image
        title
        media {
          ... on Video {
            __typename
            _id
            title
            thumbnail
            link
            time
            enable
            createdAt
            updatedAt
          }
          ... on Test {
            __typename
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
            __typename
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
