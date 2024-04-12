import { useState } from "react";
import { Editor } from "@monaco-editor/react";
import { Stack , Heading , Text , Input , Button} from "@chakra-ui/react";
import firestore from "../db/firestore";
import { useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";

export default function AddPost() {

    const [code, setCode] = useState('');
    const [title , setTitle] = useState('');
    const navigate = useNavigate()

    const user = useUser((state : any) => state.user)

    function handleEditorChange(value : string | undefined) {
        console.log('here is the current model value:', value);
        setCode(value || '');
    }
    const addSnippetAction = async ()=>{
        if(user){
            const snippet = await firestore.addDocument('snippets', {
                title,
                code,
                author: user.displayName,
                authorId: user.uid,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                tags: ['javascript', 'typescript'],
                likes: 0,
                comments: 0,
                isPublic: true,
            })
            console.log('snippet', snippet)
            navigate('/')
        }
    }

    return (
       <Stack justify={'center'} align={'center'} p={8}>
        <Heading>Create A New Snippet</Heading>
        <Stack w={'60%'} my={8} >
            <Text fontWeight={'bold'}>Add a title for your snippet</Text>
            <Input type="text" placeholder="Snippet Title" 
            onChange={(e) => setTitle(e.target.value)}
            />
        </Stack>
          <Editor
          width={'60%'}
                height="50vh"
                theme="vs-dark"
                defaultLanguage="javascript"
                defaultValue={'// add a code snippet here'}
                onChange={handleEditorChange}
                options={{
                    minimap: {
                        enabled: false,
                    },
                }}
            />
            <Button colorScheme='red'  w={200} onClick={addSnippetAction} >Save</Button>
       </Stack>
    )
}