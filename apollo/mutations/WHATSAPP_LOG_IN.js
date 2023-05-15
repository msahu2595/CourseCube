import {gql} from '@apollo/client';

export const WHATSAPP_LOG_IN = gql`
  mutation whatsAppLogIn(
    $waId: String!
    $FCMToken: String
    $platform: Platform!
    $acceptTnC: Boolean!
  ) {
    whatsAppLogIn(
      waId: $waId
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
      }
    }
  }
`;
