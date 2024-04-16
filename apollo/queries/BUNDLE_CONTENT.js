import {gql} from '@apollo/client';

export const BUNDLE_CONTENT = gql`
  query bundleContent($bundleContentId: ID!) {
    bundleContent(bundleContentId: $bundleContentId) {
      code
      success
      message
      token
      payload {
        __typename
        _id
        subjectId
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
        highlight
        instructors
        language
        index
        description
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
