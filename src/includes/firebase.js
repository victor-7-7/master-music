import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'
import { getFirestore, collection, addDoc } from 'firebase/firestore'
import { firebaseConfig } from '@/includes/firebase.config'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// https://firebase.google.com/docs/auth/web/start
// Initialize Firebase App instance
const firebaseApp = initializeApp(firebaseConfig)
// Returns the Auth instance associated with the provided FirebaseApp.
const auth = getAuth(firebaseApp)
// Returns the Firestore instance associated with the provided FirebaseApp.
const fireStore = getFirestore(firebaseApp)

export { auth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut,
  fireStore, collection, addDoc, updateProfile
}
