import { useEffect, useState } from "react"
import { auth } from "../db"
import { Avatar, HStack , Text } from "@chakra-ui/react"
import { onAuthStateChanged, signOut , User } from "firebase/auth"
import { useNavigate } from "react-router-dom"




export default function Account() {

    const router = useNavigate()

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user : User | null) => {
            if (user) {
                console.log(user.photoURL)
                setUser(user)
            } else {
                console.log('not logged in')
                router('/auth')
            }
        })
    }, [])

    return (
        <HStack>
            {user && <Avatar name={user.displayName?.toString()} src={user.photoURL?.toString()} />}
            <Text>{user?.displayName}</Text>
            <Text>{user?.email}</Text>
        </HStack>
    )
}