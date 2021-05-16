import { VFC } from 'react'
import Link from 'next/link'
import { useQuery } from '@apollo/client'
import { GET_USERS } from '../queries/queries'
import { GetUsersQuery } from '../types/generated/graphql'
import { Layout } from '../components/Layout'

const FetchMain: VFC = () => {
  const { data, error, loading } = useQuery<GetUsersQuery>(GET_USERS, {
    fetchPolicy: 'cache-and-network', // 推奨 毎回サーバーサイドのデータを取得してキャッシュする（データ取得中は前キャッシュのデータを表示） → データ更新が多い or リアルタイムにしたい時
    // fetchPolicy: 'network-only', // 毎回サーバーサイドのデータを取得してキャッシュする（データ取得中は何も表示されない） → データ更新が多い or リアルタイムにしたい時
    // fetchPolicy: 'cache-first', // デフォルト値、サーバーサイドの更新を見に行かない → データ更新が少ない場合
    // fetchPolicy: 'no-cache', // キャッシュを使用しない → 通常のaxios spaの挙動
    // fetchPolicy: 'cache-only',
    // fetchPolicy: 'standby',
  })
  // useQueryはoption指定可能
  // デフォルトでキャッシュファースト

  if (error) return (
    <Layout title="Hasura fetchPolicy">
      <p>Error: {error.message}</p>
    </Layout>
  )

  return (
    <Layout title="Hasura fetchPolicy">
      <p className="mb-6 font-bold">Hasura main page</p>
      {console.log(data)}
      {data?.users.map((user) => {
        return (
          <p className="my-1" key={user.id}>
            {user.name}
          </p>
        )
      })}
      <Link href="/hasura-sub">
        <a className="mt-6">Next</a>
      </Link>
    </Layout>
  )
}
export default FetchMain
