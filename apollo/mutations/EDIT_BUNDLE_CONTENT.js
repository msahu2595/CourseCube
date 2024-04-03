import {gql} from '@apollo/client';

export const EDIT_BUNDLE_CONTENT = gql`
  mutation editBundleContent(
    $bundleId: ID!
    $bundleContentId: ID!
    $bundleContentInput: BundleContentEditInput!
  ) {
    editBundleContent(
      bundleId: $bundleId
      bundleContentId: $bundleContentId
      bundleContentInput: $bundleContentInput
    ) {
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
