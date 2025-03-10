import {gql} from '@apollo/client';

export const CONTENT = gql`
  query content($contentId: ID!) {
    content(contentId: $contentId) {
      code
      success
      message
      token
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
            questions
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
        liked
        views
        purchased
        bookmarked
      }
    }
  }
`;
