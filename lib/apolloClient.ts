import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'
import 'cross-fetch/polyfill'

export const APOLLO_STATE_PROPS_NAME = '__APOLLO_STATE__'

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined

const createApolloClient = () => {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined', // windowがある→ブラウザのクライアント操作 → サーバー側でtrue
    link: new HttpLink({
      uri: 'https://basic-lesson-1.hasura.app/v1/graphql', // hasuraのapiエンドポイント
    }),
    cache: new InMemoryCache(), // 決まり文句
  })
}

// 大事
// apolloクライアントの生成処理をサーバーサイドとクライアントサイドで分岐する
export const initializeApollo = (initialState = null) => {
  // ?? → 左辺がnull or undefined だと右辺を実行し代入
  //      左辺に値がある場合はそのまま代入
  const _apolloClient = apolloClient ?? createApolloClient() // ?? の左辺がnull or undefined だと右辺が実行される 
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}
