import {gql} from '@apollo/client';

export const BUNDLE = gql`
  query bundle($bundleId: ID!) {
    bundle(bundleId: $bundleId) {
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
        syllabus
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
