import { useEffect, useState } from "react"
import Navigation from "../components/Navigation"
import firestore from "../db/firestore"
import { Stack, Text, Button, Spinner, HStack } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { AiOutlineLike } from "react-icons/ai";
import { FaCommentAlt } from "react-icons/fa";

interface Snippet {
  id: string
  title: string
  description: string
  likes: number
  comments: number
  author: string
  authorId: string
  createdAt: Date
}

export default function Home() {


  const [snippets, setSnippets] = useState<Snippet[]>([])

  useEffect(() => {

    (async () => {

      try {




        //  const user =  await firestore.getDocument('users' , 'uM2a66dJXOVR9KHZIcfXwv4ytEp2')
        //  console.log(user.data())
        //  const r1 = await firestore.addDocument(['posts', 'user','videos'] , {
        //     title : 'Post Video1'
        //   })
        //   await firestore.addDocument(['posts', 'user' ,'videos'] , {
        //     title : 'Post Video2'
        //   })
        //   await firestore.addDocument(['posts', 'user','videos'] , {
        //     title : 'Post Video3'
        //   })

        //   await firestore.addDocument(['posts', 'user','images'] , {
        //     title : 'Post Image 1'
        //   })
        //   await firestore.addDocument(['posts', 'user','images'] , {
        //     title : 'Post Image 2'
        //   })
        //   await firestore.addDocument(['posts', 'user','images'] , {
        //     title : 'Post Image 3'
        //   })

        //   console.log(r1.id)

        //   const refrence  = await firestore.getDocuments('users')
        //   .limit(2)
        //   .getRefrence()

        //  const result = await getDocs(query(refrence, or(where('age', '>', 22),where('age', '==', 30))))
        //   result.forEach((doc) => {
        //     console.log(doc.id, '=>', doc.data())
        //   })



        // const r = await firestore.getDocuments(['posts', 'user','images'])
        // .orderBy('title','asc')
        // .limit(1)
        // .get()

        // const lastDoc = r.docs[r.docs.length - 1]

        // // console.log(lastDoc.data())

        // const q2 = await firestore.getDocuments(['posts', 'user','images'])
        // .orderBy('title','asc')
        // .limit(2)
        // .startAfter(lastDoc)
        // .get()

        // console.log(q2.docs.map(doc => doc.data()))


      } catch (error) {
        console.log(error)
      }

    })()

    loadSnippets()

  }, [])


  const loadSnippets = async () => {
    const sn = await firestore.getDocuments('snippets')
      .orderBy('likes', 'desc')
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get()

    sn.docs.forEach((doc) => {
      const snippy: any | null = doc.data()
      if (snippy) {
        console.log(snippy)
        setSnippets((prev) => [...prev, { id: doc.id, ...snippy }])
      }
    })
  }

  return (
    <div>
      <Navigation />
      <Stack>
        {snippets.length === 0 ? (
          <Spinner />
        ) : null}
        {snippets.map((snippet) => (
          <Stack p="4" boxShadow="lg" m="4" borderRadius="sm" key={+snippet.createdAt}>
            <Stack direction="row" alignItems="center">
              <Text fontWeight="semibold">{snippet.title}</Text>

            </Stack>

            <Stack direction={{ base: 'column', md: 'row' }} justifyContent="space-between">
              <Text fontSize={{ base: 'sm' }} textAlign={'left'} maxW={'4xl'}>
                {snippet.author} -    {snippet.createdAt.toString()}
              </Text>
              <HStack gap={3} >
                <AiOutlineLike />   <Text fontWeight={'bold'}>{snippet.likes}</Text>
                <FaCommentAlt />   <Text fontWeight={'bold'}>{snippet.comments}</Text>
              </HStack>
              <Stack direction={{ base: 'column', md: 'row' }}>
                <Link to={`/snippet/${snippet.id}`}>
                  <Button colorScheme="blue">View</Button>
                </Link>
              </Stack>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </div>
  )
}