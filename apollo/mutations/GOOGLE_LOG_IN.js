import {gql} from '@apollo/client';

export const GOOGLE_LOG_IN = gql`
  mutation googleLogIn(
    $idToken: String!
    $acceptTnC: Boolean!
    $FCMToken: String
  ) {
    googleLogIn(idToken: $idToken, acceptTnC: $acceptTnC, FCMToken: $FCMToken) {
      code
      success
      message
      token
      refresh
      payload {
        _id
        email
        emailVerified
        phoneNumber
        fullName
        picture
        gender
        about
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
        FCMToken
        platform
        acceptTnC
        role
        followers
        followings
        history
        createdAt
        updatedAt
      }
    }
  }
`;
