import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_APP_URL}graphql`
});
const authLink = setContext((_, { headers }) => {
  const sessionData = localStorage.getItem('userDetails');
  const userData = sessionData ? JSON.parse(sessionData) : null;
  return {
    headers: {
      ...headers,
      ...(userData?.accessToken && {
        Authorization: `Bearer ${userData.accessToken}`
      })
    }
  };
});

const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
      errorPolicy: "ignore",
    },
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
    mutate: {
      fetchPolicy: "no-cache",
    },
  },
});

export default client;