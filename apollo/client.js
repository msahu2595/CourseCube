import AsyncStorage from '@react-native-async-storage/async-storage';
import {from, ApolloClient, createHttpLink, ApolloLink} from '@apollo/client';
import {InMemoryCache, makeVar, gql} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
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

const authLink = setContext((_, {headers}) => {
  return AsyncStorage.multiGet(['token', 'refresh']).then(res => {
    if (res[0][1]) {
      return {
        headers: {
          ...headers,
          authorization: `Bearer ${res[0][1]}`,
          'refresh-token': res[1][1],
        },
      };
    }
    return {headers};
  });
});

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
  uri: 'https://course-cube-server.onrender.com/',
});

async function singleSet(name, token) {
  try {
    await AsyncStorage.setItem(name, token);
    console.log('SingleSet done.');
  } catch (e) {
    console.log(e);
  }
}

const setTokenLink = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    console.log(`====${operation.operationName}=====`);
    if (response?.data && response?.data[operation.operationName]?.token) {
      if (response?.data[operation.operationName]?.token) {
        console.log(
          'Got new token ==> ',
          response?.data[operation.operationName]?.token,
        );
        singleSet('token', response?.data[operation.operationName]?.token);
      }
      if (response?.data[operation.operationName]?.refresh) {
        console.log(
          'Got new refresh ==> ',
          response?.data[operation.operationName]?.refresh,
        );
        singleSet('refresh', response?.data[operation.operationName]?.refresh);
      }
    }
    console.log(`====${operation.operationName}=====`);
    return response;
  });
});

// Initialize Apollo Client
const client = new ApolloClient({
  link: from([authLink, errorLink, setTokenLink.concat(httpLink)]),
  typeDefs: typeDefs,
  cache: cache,
});

export default client;
