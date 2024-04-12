import { doc, getDoc, runTransaction } from 'firebase/firestore';
import { db } from './index';


async function likeSnippet(snippetId: string, userId: string) {
    const snippetRef = doc(db, 'snippets', snippetId);
    const userLikedSnippetsRef = doc(db, 'userLikes', userId, 'likedSnippets', snippetId);

    try {
        const transaction = runTransaction(db, async (transaction) => {
            const userLikedSnippetsDoc = await getDoc(userLikedSnippetsRef);

            const snippetDoc = await getDoc(snippetRef);
            if (!snippetDoc.exists()) {
                throw new Error('Snippet does not exist!');
            }
            if (!userLikedSnippetsDoc.exists()) {
                transaction.set(userLikedSnippetsRef, { liked: true });
                const newLikeCount = snippetDoc.data().likes + 1;
                transaction.update(snippetRef, { likes: newLikeCount });
            }
            return;
        })

        await transaction.then(() => {
            console.log('Transaction successfully committed!');
        }).catch((error) => {
            console.error('Transaction failed: ', error);
        });
    } catch (error) {
        console.error('Error liking snippet:', error);
    }
}

async function getSnippet(snippetId: string, userId: string) {
    const snippetRef = doc(db, 'snippets', snippetId);
    const userLikedSnippetsRef = doc(db, 'userLikes', userId, 'likedSnippets', snippetId);

    try {
        const [snippetDoc, userLikedDoc] = await Promise.all([
            getDoc(snippetRef),
            getDoc(userLikedSnippetsRef)
        ]);

        if (!snippetDoc.exists()) {
            throw new Error('Snippet does not exist!');
        }

        const snippetData = snippetDoc;
        const isLiked = userLikedDoc.exists();

        return {
            snippetData,
            snippetId: snippetDoc.id,
            isLiked: isLiked
        };
    } catch (error) {
        console.error('Error retrieving snippet:', error);
    }
}
export {
    likeSnippet,
    getSnippet
}