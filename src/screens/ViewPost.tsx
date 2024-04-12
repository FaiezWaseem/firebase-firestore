import { useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { Stack, Heading, Text, Button, HStack, Spinner } from "@chakra-ui/react";
import firestore from "../db/firestore";
import { useNavigate, useParams } from "react-router-dom";
import useUser from "../hooks/useUser";
import { likeSnippet, getSnippet } from "../db/functions";
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
interface Snippet {
    id: string
    title: string
    code: string
    likes: number
    comments: number
    author: string
    authorId: string
    createdAt: Date
}

export default function ViewPost() {

    const params = useParams()

    const [isLoading, setLoading] = useState<boolean>(true)

    const [snippet, setSnippet] = useState<Snippet>()

    const [isLiked, setLiked] = useState<boolean>(false)

    const [ likes , setLikes ] = useState<number>(0)


    const user = useUser((state: any) => state.user)



    useEffect(() => {

        console.log(user)
        if (params.id) {
            fetchSnippet()
        }

    }, [params.id])

    const fetchSnippet = async () => {
        console.log(params)
        const s = await getSnippet(params.id || '', user?.uid)
        setLiked(s?.isLiked || false)
        if (s?.snippetData.exists()) {
            const data: any = s.snippetData.data()
            setSnippet({
                id: s.snippetId,
                title: data.title,
                code: data.code,
                likes: data.likes,
                author: data.author,
                authorId: data.authorId,
                createdAt: data.createdAt,
                comments: data.comments,
            })
            setLikes(data.likes)
        }
        setLoading(false)
    }

    if (isLoading) {
        return <Spinner />
    }


    return (
        <Stack justify={'center'} align={'center'} p={8}>
            <Heading m={5} >{snippet?.title}</Heading>
            <Editor
                width={'60%'}
                height="50vh"
                theme="vs-dark"
                defaultLanguage="javascript"
                defaultValue={snippet?.code}
                options={{
                    minimap: {
                        enabled: true,
                    },
                }}
            />
            <HStack w={'60%'} mt={5} >


                <Button
                    isDisabled={isLiked}
                    leftIcon={ isLiked ? <AiFillLike /> : <AiOutlineLike />}
                    onClick={async () => {
                        await likeSnippet(snippet?.id || '', user.uid)
                        setLiked(true)
                        setLikes(likes + 1)
                    }}
                    colorScheme='red' variant='outline'>
                    {likes}
                </Button>

                <Text fontWeight={'bold'}> - </Text>
                <Text fontWeight={'bold'}>Comments {snippet?.comments}</Text>
            </HStack>
        </Stack>
    )
}