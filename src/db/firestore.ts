import { db } from ".";
import {
    collection,
    addDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    startAt,
    doc,
    setDoc,

} from "firebase/firestore";

class Firestore {
    addDocument = async (collectionStr: string | string[], data: Object) => {
        let docRef = null;
        if (typeof collectionStr === "string") {
            docRef = await addDoc(collection(db, collectionStr), data);
        } else {
            const path = collectionStr[0];
            collectionStr.shift();
            docRef = await addDoc(collection(db, path, ...collectionStr), data);
            
        }
        return docRef;
    }
    addDoc = async (collectionStr: string | string[], data: Object) => {
        let docRef = null;
        if (typeof collectionStr === "string") {
            docRef = await setDoc(doc(db, collectionStr), data);
        } else {
            const path = collectionStr[0];
            collectionStr.shift();
            console.log(collectionStr)
            docRef = await setDoc(doc(db, path, ...collectionStr), data);
            
        }
        return docRef;
    };

    getDocuments = (collectionStr: string | string[]) => {
        let collections = null;
        if (typeof collectionStr === "string") {
            collections = collection(db, collectionStr);
        } else {
            const path = collectionStr[0];
            collectionStr.shift();
            collections = collection(db, path, ...collectionStr);
        }

        const createQuery = (conditions: any[]) => {
            let queryRef = query(collections);
            conditions.forEach((condition) => {
                const { field, operator, value } = condition;
                queryRef = query(queryRef, where(field, operator, value));
            });
            return queryRef;
        };

        const getQuerySnapshot = async (queryRef: any) => {
            const querySnapshot = await getDocs(queryRef);
            return querySnapshot
        };
        let refs: any = collections;

        const firestoreInstance = {
            where: (...conditions: any[]) => {
                const queryRef = createQuery(conditions);
                refs = queryRef;
                return firestoreInstance; 
            },
            get() {
                return getQuerySnapshot(refs);
            },
            orderBy: (field: string, direction: "asc" | "desc") => {
                refs = query(refs, orderBy(field, direction));
                return firestoreInstance;
            },
            limit: (_limit: number) => {
                refs = query(refs, limit(_limit));
                return firestoreInstance;
            },
            startAt : (value: number | string) => {
                refs = query(refs, startAt(value));
                return firestoreInstance;
            },
            startAfter : (value: any) => {
                refs = query(refs, startAfter(value));
                return firestoreInstance;
            },
            getRefrence: () => {
                return refs;
            }
        };

        return firestoreInstance;
    };
    getDocument = async (collectionStr: string | string[], docId: string) => {
        let docRef = null;
        if (typeof collectionStr === "string") {
            docRef = doc(db, collectionStr, docId);
        } else {
            const path = collectionStr[0];
            collectionStr.shift();
            docRef = doc(db, path, ...collectionStr, docId);
        }
        const docSnapshot = await getDoc(docRef);
        return docSnapshot;
    }
}

export default new Firestore();