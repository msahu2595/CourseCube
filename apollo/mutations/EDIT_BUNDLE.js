import {gql} from '@apollo/client';

export const EDIT_BUNDLE = gql`
  mutation editBundle($bundleId: ID!, $bundleInput: BundleInput!) {
    editBundle(bundleId: $bundleId, bundleInput: $bundleInput) {
      payload {
        _id
        categories
        createdAt
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
        updatedAt
        likes
        purchases
        purchased
      }
    }
  }
`;
