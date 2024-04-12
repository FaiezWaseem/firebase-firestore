
import { app, auth, provider } from '../db';

import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';

import {
    Box,
    Flex,
    Stack,
    Heading,
    Text,
    Container,
    Input,
    Button,
    SimpleGrid,
    Avatar,
    AvatarGroup,
    useBreakpointValue,
    IconProps,
    Icon,
    HStack,
    useToast
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';

import firestore from '../db/firestore';

const avatars = [
    {
        name: 'Ryan Florence',
        url: 'https://bit.ly/ryan-florence',
    },
    {
        name: 'Segun Adebayo',
        url: 'https://bit.ly/sage-adebayo',
    },
    {
        name: 'Kent Dodds',
        url: 'https://bit.ly/kent-c-dodds',
    },
    {
        name: 'Prosper Otemuyiwa',
        url: 'https://bit.ly/prosper-baba',
    },
    {
        name: 'Christian Nwamba',
        url: 'https://bit.ly/code-beast',
    },
]

const Blur = (props: IconProps) => {
    return (
        <Icon
            width={useBreakpointValue({ base: '100%', md: '40vw', lg: '30vw' })}
            zIndex={useBreakpointValue({ base: -1, md: -1, lg: 0 })}
            height="560px"
            viewBox="0 0 528 560"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}>
            <circle cx="71" cy="61" r="111" fill="#F56565" />
            <circle cx="244" cy="106" r="139" fill="#ED64A6" />
            <circle cy="291" r="139" fill="#ED64A6" />
            <circle cx="80.5" cy="189.5" r="101.5" fill="#ED8936" />
            <circle cx="196.5" cy="317.5" r="101.5" fill="#ECC94B" />
            <circle cx="70.5" cy="458.5" r="101.5" fill="#48BB78" />
            <circle cx="426.5" cy="-0.5" r="101.5" fill="#4299E1" />
        </Icon>
    )
}

export default function Auth() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const toast = useToast();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                navigate('/')
            } else {
         
            }
        });
    }, [])

    const sigInWithEmail = async () => {
        const auth = getAuth(app);
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                console.log(user);

                firestore.addDoc(['users',user.uid] , {
                    email: user.email,
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    emailVerified: user.emailVerified,
                    phoneNumber: user.phoneNumber,
                    disabled: false
                })


            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                console.log(errorCode, errorMessage);
                toast({
                    title: errorMessage,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                });
            });
    }
    const signin = async () =>{
        signInWithEmailAndPassword(auth, email, password)
           .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user);
            })
           .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                toast({
                    title: errorMessage,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                });
           }
        )
    }
    const googleHandler = async () => {
        provider.setCustomParameters({ prompt: 'select_account' });
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential: any = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                console.log(user)
                firestore.addDoc(['users',user.uid] , {
                    email: user.email,
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    emailVerified: user.emailVerified,
                    phoneNumber: user.phoneNumber,
                    disabled: false
                })

            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);

                console.log(errorCode, errorMessage, email, credential);

                toast({
                    title: errorMessage,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                });
            });
    };
    return (
        <Box position={'relative'}>
            <Container
                as={SimpleGrid}
                maxW={'7xl'}
                columns={{ base: 1, md: 2 }}
                spacing={{ base: 10, lg: 32 }}
                py={{ base: 10, sm: 20, lg: 32 }}>
                <Stack spacing={{ base: 10, md: 20 }}>
                    <Heading
                        lineHeight={1.1}
                        fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}>
                        Senior web designers{' '}
                        <Text as={'span'} bgGradient="linear(to-r, red.400,pink.400)" bgClip="text">
                            &
                        </Text>{' '}
                        Full-Stack Developers
                    </Heading>
                    <Stack direction={'row'} spacing={4} align={'center'}>
                        <AvatarGroup>
                            {avatars.map((avatar) => (
                                <Avatar
                                    key={avatar.name}
                                    name={avatar.name}
                                    src={avatar.url}
                                    // eslint-disable-next-line react-hooks/rules-of-hooks
                                    size={useBreakpointValue({ base: 'md', md: 'lg' })}
                                    position={'relative'}
                                    zIndex={2}
                                    _before={{
                                        content: '""',
                                        width: 'full',
                                        height: 'full',
                                        rounded: 'full',
                                        transform: 'scale(1.125)',
                                        bgGradient: 'linear(to-bl, red.400,pink.400)',
                                        position: 'absolute',
                                        zIndex: -1,
                                        top: 0,
                                        left: 0,
                                    }}
                                />
                            ))}
                        </AvatarGroup>
                        <Text fontFamily={'heading'} fontSize={{ base: '4xl', md: '6xl' }}>
                            +
                        </Text>
                        <Flex
                            align={'center'}
                            justify={'center'}
                            fontFamily={'heading'}
                            fontSize={{ base: 'sm', md: 'lg' }}
                            bg={'gray.800'}
                            color={'white'}
                            rounded={'full'}
                            minWidth={useBreakpointValue({ base: '44px', md: '60px' })}
                            minHeight={useBreakpointValue({ base: '44px', md: '60px' })}
                            position={'relative'}
                            _before={{
                                content: '""',
                                width: 'full',
                                height: 'full',
                                rounded: 'full',
                                transform: 'scale(1.125)',
                                bgGradient: 'linear(to-bl, orange.400,yellow.400)',
                                position: 'absolute',
                                zIndex: -1,
                                top: 0,
                                left: 0,
                            }}>
                            YOU
                        </Flex>
                    </Stack>
                </Stack>
                <Stack
                    bg={'gray.50'}
                    rounded={'xl'}
                    p={{ base: 4, sm: 6, md: 8 }}
                    spacing={{ base: 8 }}
                    maxW={{ lg: 'lg' }}>
                    <Stack spacing={4}>
                        <Heading
                            color={'gray.800'}
                            lineHeight={1.1}
                            fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}>
                            Join our team
                            <Text as={'span'} bgGradient="linear(to-r, red.400,pink.400)" bgClip="text">
                                !
                            </Text>
                        </Heading>

                    </Stack>
                    <Box as={'form'}>
                        <Stack spacing={4}>

                            <Input
                                placeholder="firstname@lastname.io"
                                bg={'gray.100'}
                                border={0}
                                color={'gray.500'}
                                _placeholder={{
                                    color: 'gray.500',
                                }}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Input
                                placeholder="********"
                                bg={'gray.100'}

                                border={0}
                                color={'gray.500'}
                                _placeholder={{
                                    color: 'gray.500',
                                }}
                                type={'password'}
                                _focus={{
                                    borderColor: 'gray.300',
                                }}
                                _active={{
                                    borderColor: 'gray.400',
                                }}
                                _hover={{
                                    borderColor: 'gray.400',
                                }}
                                _invalid={{
                                    borderColor: 'gray.300',
                                }}
                                isInvalid
                                isRequired
                                aria-invalid={'true'}
                                onChange={(e) => setPassword(e.target.value)}

                            />
                            <HStack>

                                <Button fontFamily={'heading'} bg={'gray.200'} color={'gray.800'}
                                    onClick={sigInWithEmail}
                                >
                                    Register
                                </Button>
                                <Button fontFamily={'heading'} bg={'gray.200'} color={'gray.800'}
                                    onClick={signin}
                                >
                                    Login
                                </Button>
                            </HStack>
                        </Stack>
                        <Button
                            fontFamily={'heading'}
                            mt={8}
                            w={'full'}
                            bgGradient="linear(to-r, red.400,pink.400)"
                            color={'white'}
                            _hover={{
                                bgGradient: 'linear(to-r, red.400,pink.400)',
                                boxShadow: 'xl',
                            }}
                            onClick={googleHandler}
                        >
                            Google Signin
                        </Button>
                    </Box>
                    form
                </Stack>
            </Container>
            <Blur position={'absolute'} top={-10} left={-10} style={{ filter: 'blur(70px)' }} />
        </Box>
    )
}