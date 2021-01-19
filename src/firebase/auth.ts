import { App } from './app'
import firebase from 'firebase'
import 'firebase/auth'

export const Auth: firebase.auth.Auth = App.auth()
