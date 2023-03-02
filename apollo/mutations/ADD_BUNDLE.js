import {gql} from '@apollo/client';

export const ADD_BUNDLE = gql`
  mutation addBundle($bundleInput: BundleInput!) {
    addBundle(bundleInput: $bundleInput) {
      success
      token
      message
      code
    }
  }
`;
