import { App } from './app'
import firebase from 'firebase'
import 'firebase/firestore'

export const DB: firebase.firestore.Firestore = App.firestore()
