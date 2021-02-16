// import request from '@/utils/request'
import firebase from 'firebase'

export function getRules() {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        reject('Not found User')
      }
      const db = firebase.firestore()
      db.collection('alarm-rules').doc(user.email).get().then(doc => {
        resolve({ data: doc.data() })
      })
    })
  })
}
