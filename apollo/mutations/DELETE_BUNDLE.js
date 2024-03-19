import {gql} from '@apollo/client';

export const DELETE_BUNDLE = gql`
  mutation deleteBundle($bundleId: ID!) {
    deleteBundle(bundleId: $bundleId) {
      payload {
        _id
        categories
        exams
        tags
        subject
        image
        title
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
