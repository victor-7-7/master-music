import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore'
import { firebaseConfig } from '@/includes/firebase.config'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// https://firebase.google.com/docs/auth/web/start
// Initialize Firebase App instance
const firebaseApp = initializeApp(firebaseConfig)

// Returns the Auth instance associated with the provided FirebaseApp.
const auth = getAuth(firebaseApp)

// https://firebase.google.com/docs/firestore?hl=en&authuser=0
// Cloud Firestore is a flexible, scalable NoSQL database for mobile, web,
// and server development from Firebase and Google Cloud. Like Firebase
// Realtime Database, it keeps your data in sync across client apps through
// realtime listeners and offers offline support for mobile and web, so you
// can build responsive apps that work regardless of network latency or
// Internet connectivity.
// Returns the Firestore instance associated with the provided FirebaseApp.
const fireStore = getFirestore(firebaseApp)

// https://firebase.google.com/docs/storage?hl=en&authuser=0
// Cloud Storage for Firebase is built for app developers who need to store
// and serve user-generated content, such as photos or videos.
// https://firebase.google.com/docs/storage/web/start?hl=en&authuser=0#create-default-bucket
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(firebaseApp)

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, fireStore, collection, addDoc, updateProfile, doc, setDoc,
  storage, ref, uploadBytesResumable, getDownloadURL,
}
