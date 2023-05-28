import {gql} from '@apollo/client';

export const GOOGLE_LOG_IN = gql`
  mutation googleLogIn(
    $idToken: String!
    $FCMToken: String
    $platform: Platform!
    $acceptTnC: Boolean!
  ) {
    googleLogIn(
      idToken: $idToken
      FCMToken: $FCMToken
      platform: $platform
      acceptTnC: $acceptTnC
    ) {
      code
      success
      message
      token
      refresh
      payload {
        __typename
        _id
        email
        emailVerified
        mobile
        mobileVerified
        fullName
        gender
        picture
        about
        userVerified
        education
        workAt
        workAs
        facebook
        instagram
        twitter
        linkedin
        pincode
        country
        state
        district
        cityVillage
        area
        street
        landmark
        role
        FCMToken
        platform
        acceptTnC
        createdAt
        updatedAt
        followers
        followings
      }
    }
  }
`;
