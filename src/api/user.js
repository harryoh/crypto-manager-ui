import request from '@/utils/request'
import firebase from 'firebase'

export function login(data) {
  return request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        reject('Not found User')
      }
      const db = firebase.firestore()
      db.collection('users').doc(user.email).get().then(doc => {
        if (doc.exists) {
          resolve({ data: doc.data() })
        } else {
          const data = {
            email: user.email,
            name: user.displayName,
            roles: 'admin',
            avatar: user.photoURL,
            instroduction: ''
          }
          db.collection('users').doc(user.email).set(data).then(() => {
            resolve({ data })
          })
        }
      })
    })
  })

  // const db = firebase.firestore()

  // return request({
  //   url: '/vue-element-admin/user/info',
  //   method: 'get',
  //   params: { token }
  // })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
