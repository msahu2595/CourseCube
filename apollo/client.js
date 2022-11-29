import AsyncStorage from '@react-native-async-storage/async-storage';
import {from, ApolloClient, createHttpLink} from '@apollo/client';
import {InMemoryCache, makeVar, gql} from '@apollo/client';
// import {setContext} from '@apollo/client/link/context';
import {onError} from '@apollo/client/link/error';
import {Alert} from 'react-native';

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    me: User
    cartItems: [ID!]!
  }
`;

// Initializes to true if localStorage includes a 'token' key,
// false otherwise
export const isLoggedInVar = makeVar(!!AsyncStorage.getItem('token'));

// Initializes logged in user
export const loggedUserVar = makeVar(null);

// Initializes to an empty array
export const cartItemsVar = makeVar([]);

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        isLoggedIn: {
          read() {
            return isLoggedInVar();
          },
        },
        me: {
          read() {
            return loggedUserVar();
          },
        },
        cartItems: {
          read() {
            return cartItemsVar();
          },
        },
      },
    },
  },
});

// const authLink = setContext(() => {
//   return AsyncStorage.multiGet(['token', 'refresh']).then(res => {
//     if (res[0][1]) {
//       return {
//         headers: {
//           authorization: `Bearer ${res[0][1]}`,
//           'refresh-token': res[0][1],
//         },
//       };
//     }
//     return;
//   });
// });

export const errorLink = onError(error => {
  console.log({error});
  const {graphQLErrors, networkError, operation} = error;
  if (graphQLErrors) {
    const message =
      graphQLErrors.length > 0
        ? graphQLErrors[0].message
        : 'Something Went Wrong';
    console.log({message});
    return;
  }
  if (networkError) {
    if (networkError?.result) {
      const unAuthenticate = networkError?.result?.errors.find(
        er => er.extensions.code === 'UNAUTHENTICATED',
      );

      if (unAuthenticate) {
        console.log('unAuthenticate', unAuthenticate);
      }
      return;
    } else if (networkError?.message === 'Failed to fetch') {
      if (operation?.operationName === 'outletLogin') {
        Alert.alert(
          'No Internet Connection',
          'Please check your internet connectivity.',
        );
      }
    } else {
      Alert.alert('Network Error', 'Please check your internet connectivity.');
      return;
    }
  }
});

const httpLink = createHttpLink({
  uri: 'https://course-cube-server.herokuapp.com/',
  credentials: 'include',
});

// Initialize Apollo Client
const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  typeDefs: typeDefs,
  cache: cache,
});

export default client;
