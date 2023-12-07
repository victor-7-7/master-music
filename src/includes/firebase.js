import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut, updateProfile, } from 'firebase/auth'
import { collection, addDoc, doc, setDoc,
  query, where, getDocs, updateDoc, deleteDoc, getDoc,
  limit, startAfter, orderBy, initializeFirestore,
  persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore'
import { firebaseConfig } from '@/includes/firebase.config'
import { getStorage, ref, uploadBytesResumable, getDownloadURL,
  deleteObject, } from 'firebase/storage'

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
// const fireStore = getFirestore(firebaseApp)

// Firestore рекомендует браузеру держать копию базы на девайсе юзера
// на случай отключения от сети. Если не в сети, то юзер не сможет выгрузить
// песни на сервер, не сможет залогиниться (если открыл прогу без сети).
// enablePersistence() не работает в новых версиях Firebase
/*fireStore.enablePersistence().catch(err => {
  console.log(`Firestore persistence error ${err.code}`)
})*/

// https://firebase.google.com/docs/firestore/manage-data/enable-offline?hl=en
// https://firebase.google.com/docs/reference/js/firestore_.md#initializefirestore
const fireStore = initializeFirestore(
  firebaseApp,
  // https://firebase.google.com/docs/reference/js/firestore_.firestoresettings
  // https://firebase.google.com/docs/reference/js/firestore_.firestoresettings.md#firestoresettings_interface
  // FirestoreSettings instance
  {
    // localCache имеет Union-тип FirestoreLocalCache и может быть либо типом
    // MemoryLocalCache (дефолт), либо типом PersistentLocalCache.
    // https://firebase.google.com/docs/reference/js/firestore_.persistentlocalcache
    // To use, create an instance using the factory function, then set the
    // instance to FirestoreSettings.cache and call initializeFirestore using
    // the settings object.

    // Specifies the cache used by the SDK. Available options are MemoryLocalCache
    // and PersistentLocalCache, each with different configuration options.
    // NOTE: setting this field (localCache) and cacheSizeBytes at the same time
    // will throw exception during SDK initialization. Instead, using the
    // configuration in the FirestoreLocalCache object to specify the cache size.
    localCache: persistentLocalCache(
      // PersistentCacheSettings instance
      {
        tabManager: persistentMultipleTabManager(),
      }
    ),

    // NOTE: setting this field (cacheSizeBytes) and localCache at the same time
    // will throw exception during SDK initialization. Instead, using the
    // configuration in the FirestoreLocalCache object to specify the cache size.
    /*// NOTE: This field will be deprecated in a future major release. Use cache
    // field instead to specify cache size, and other cache configurations.
    // The default value is 40 MB
    cacheSizeBytes: 5 * 1024 * 1024,*/
  }
)
// https://github.com/firebase/firebase-js-sdk/issues/7347
// ---------------

// https://firebase.google.com/docs/storage?hl=en&authuser=0
// Cloud Storage for Firebase is built for app developers who need to store
// and serve user-generated content, such as photos or videos.
// https://firebase.google.com/docs/storage/web/start?hl=en&authuser=0#create-default-bucket
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(firebaseApp)

// Мы выгружаем song-файл (песню) в хранилище 'storage' (Cloud Storage) и затем
// записываем в коллекцию 'songs' базы 'fireStore' (Cloud Firestore) song-документ,
// в котором содержится информация по данному файлу, в том числе url файла.

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, fireStore, collection, addDoc, updateProfile, doc, setDoc,
  storage, ref, uploadBytesResumable, getDownloadURL, query, where,
  getDocs, updateDoc, deleteObject, deleteDoc, getDoc, limit, startAfter,
  orderBy,
}
