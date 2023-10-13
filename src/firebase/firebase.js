import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';

class Firebase {
  constructor(collectionName) {
    this.collectionName = collectionName;
    this.db = this.instantiateDatabase();
  }

  instantiateDatabase() {
    const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);
    const app = initializeApp(firebaseConfig);
    return getFirestore(app);
  }

  async retrieveAll() {
    const collectionRef = collection(this.db, this.collectionName);
    const snapshot = await getDocs(collectionRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async retrieveAllSub() {
    const collectionRef = collection(this.db, this.collectionName);
    const snapshot = await getDocs(collectionRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async add(data) {
    const collectionRef = collection(this.db, this.collectionName);
    const docRef = await addDoc(collectionRef, data);
    return docRef.id;
  }

  async edit(data) {
    const { id } = data;
    const docRef = doc(this.db, this.collectionName, id);
    try {
      await setDoc(docRef, data);
    } catch (error) {
      console.error(error);
      return false;
    }
    return true;
  }

  async remove(docId) {
    const docToDelete = doc(this.db, this.collectionName, docId);

    try {
      await deleteDoc(docToDelete);
    } catch (error) {
      console.error(error);
      return false;
    }
    return true;
  }
}

export default Firebase;
