import { VFC, useState, FormEvent } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_USERS,
  CREATE_USER,
  DELETE_USER,
  UPDATE_USER,
} from '../queries/queries'
import {
  GetUsersQuery,
  CreateUserMutation,
  DeleteUserMutation,
  UpdateUserMutation,
} from '../types/generated/graphql'
import { Layout } from '../components/Layout'

const HasuraCRUD: VFC = () => {
  const { data, error } = useQuery<GetUsersQuery>(GET_USERS, {
    fetchPolicy: 'cache-and-network',
  })
  const [update_users_by_pk] = useMutation<UpdateUserMutation>(UPDATE_USER)

  // create, deleteはキャッシュの更新が自動で行われないため、自分で処理を書く
  const [insert_users_one] = useMutation<CreateUserMutation>(CREATE_USER, {
    // create処理後のコールバックで実行
    // update ... コールバック内で使用できるメソッド, ApolloCacheオブジェクトとapiの戻り値を引数に取れる
    update(cache, { data: { insert_users_one } }) {
      // cache.identify ... insert_users_oneのcacheのidを取得する、userIdとは異なるキャッシュを管理するためのもの
      // cacheId ... __typename と insert_users_oneのidを組み合わせたもの
      const cacheId = cache.identify(insert_users_one)
      // cache.modify ... cacheの更新、fieldsをusersに指定して更新させる
      cache.modify({
        fields: {
          // users ... 第一引数に既存のキャッシュされたusersが入る
          users(existingUsers, { toReference }) {
            // toReference ... 引数にcacheIdを指定することで特定のデータを参照できる
            // 既存ユーザー配列の先頭に作成したユーザーを足す処理
            return [toReference(cacheId), ...existingUsers]
          }
        }
      })
    }
  })
  const [delete_users_by_pk] = useMutation<DeleteUserMutation>(DELETE_USER, {
    update(cache, { data: { delete_users_by_pk } }) {
      cache.modify({
        fields: {
          users(existingUsers, { readField }) {
            return existingUsers.filter(
              (user) => delete_users_by_pk.id !== readField('id', user)
            )
          }
        }
      })
    }
  })

  return (
    <Layout title="Hasura CRUD">
      <p className="mb-3 font-bold">Hasura main page</p>
    </Layout>
  )
}
export default HasuraCRUD
