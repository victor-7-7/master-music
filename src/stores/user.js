import { defineStore } from 'pinia'
import {
  auth,
  fireStore, doc, setDoc,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword, signOut,
} from '@/includes/firebase'

export default defineStore('user', {
  state: () => ({
    userLoggedIn: false,
  }),
  // https://pinia.vuejs.org/core-concepts/actions.html
  actions: {
    // values - значения полей регистрационной формы
    async register(values) {
      // Creates a new user account. On successful creation of the user account,
      // this user will also be signed in to your application.
      // https://firebase.google.com/docs/reference/js/auth.md#createuserwithemailandpassword
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password)
      // UserCredential interface - https://firebase.google.com/docs/reference/js/auth.usercredential.md#usercredential_interface
      const user = userCredential.user
      console.log(user)
      // ------------
      // Если все ок, то сервис Firebase сохранит токен нового залогиненного юзера
      // на сервере и в local storage браузера и присоединит этот токен к запросу
      // при вызове setDoc/addDoc
      // ------------
      // Add Data Using setDoc() - https://softauthor.com/firebase-firestore-add-document-data-using-setdoc/
      // Можно добавить документ с Auto-generated ID, а можно с Custom ID.
      // Нам надо использовать ID только что созданного в Auth-сервисе юзера в качестве
      // Custom ID для создаваемого документа с данными этого юзера в коллекции users
      // Firestore-сервиса. Сначала создаем в коллекции users базы fireStore документ
      // с идентификатором userId. Получаем ссылку на этот документ.
      const docRef = await doc(fireStore, 'users', user.uid)
      console.log('BARE DOC', docRef)
      // Теперь наполняем созданный документ данными
      await setDoc(docRef, {
        name: values.name,
        // Дублируем для удобства (поле email уже записано в auth сервисе)
        email: values.email,
        age: values.age,
        country: values.country,
      })
      /*// Добавляем документ в коллекцию users Firestore сервиса с Auto-generated ID
      const docRef = await addDoc(collection(fireStore, 'users'), {
        name: values.name,
        // Дублируем для удобства (поле email уже записано в auth сервисе)
        email: values.email,
        age: values.age,
        country: values.country,
      })*/
      // ------------
      // Теперь заполним некоторые поля юзерского профиля (UserInfo)
      // https://firebase.google.com/docs/auth/web/manage-users#update_a_users_profile
      await updateProfile(user, {
        displayName: values.name + '-display',
        // https://medium.com/@Picuki/image-url-for-testing-the-lorem-ipsum-for-photos-2-ways-to-fake-image-upload-for-testing-53bf4c99ec71
        photoURL: 'https://source.unsplash.com/user/c_v_r/300x300',
      })
      // ------------
      this.userLoggedIn = true
      console.log('DOC', docRef)
    },

    async authenticate(values) {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password)
      // ------------
      this.userLoggedIn = true
      // console.log(userCredential.user)
    },

    async userSignOut() {
      // Firebase отзывает токен текущего юзера и чистит в браузере
      // базу Storage/indexedDB/firebaseLocalStorageDb. Web Token
      // хранится в этой базе в таблице в виде свойства по пути
      // value.value.stsTokenManager.accessToken. В этом же менеджере
      // лежат свойства expirationTime и refreshToken.
      // Signs out the current user
      await signOut(auth)
      this.userLoggedIn = false
    },
  },
})


