import {gql} from '@apollo/client';

export const DELETE_BUNDLE_CONTENT = gql`
  mutation deleteBundleContent($bundleContentId: ID!) {
    deleteBundleContent(bundleContentId: $bundleContentId) {
      code
      success
      message
      token
      payload {
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
            #
            time
            #
            enable
            createdAt
            updatedAt
          }
          ... on Test {
            __typename
            _id
            title
            thumbnail
            #
            instructions
            duration
            questions
            totalMarks
            #
            enable
            createdAt
            updatedAt
          }
          ... on Document {
            __typename
            _id
            title
            thumbnail
            #
            pages
            #
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
