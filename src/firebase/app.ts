import Firebase from 'firebase/app'
import { credentials } from './credentials'

export const App: Firebase.app.App = Firebase.initializeApp(credentials.config)
