import { useState, useCallback, ChangeEvent, FormEvent } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_USER } from '../queries/queries'
import { CreateUserMutation } from '../types/generated/graphql'

export const useCreateForm = () => {
  const [text, setText] = useState('')
  const [username, setUsername] = useState('')
  const [insert_users_one] = useMutation<CreateUserMutation>(CREATE_USER, {
    update(cache, { data: { insert_users_one } }) {
      const cacheId = cache.identify(insert_users_one)
      cache.modify({
        fields: {
          users(existingUsers, { toReference }) {
            return [toReference(cacheId), ...existingUsers]
          }
        }
      })
    }
  })
  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }
  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }
  const printMsg = () => {
    console.log('Hello')
  }
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await insert_users_one({
        variables: {
          name: username,
        }
      })
    } catch (err) {
      alert(err.message)
    }
    setUsername('')
  }
  return {
    text,
    username,
    handleUsernameChange,
    handleTextChange,
    handleSubmit,
    printMsg,
  }
}