import { Box, Container, VStack, HStack, Button, Input, GridItem , Image, Heading} from "@chakra-ui/react";
import Message from "./Message";
import { useState, useEffect, useRef } from "react";
import { signOut, onAuthStateChanged, getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"

import { app } from "./firebase";
import { getFirestore, addDoc, collection, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore"
import { async, map } from "@firebase/util";


const auth = getAuth(app);
const db = getFirestore(app);

const HandleLogin = () => {
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider);
}

const HandleLogout = () => (signOut(auth));



function App() {

  const q1= query(collection(db,"Messages"),orderBy("createdAt", "asc"))

  const [user, setUser] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const divForScroll= useRef(null);

  //handle text submit -- message send 
  const HandleSubmit = async (e) => {
    e.preventDefault();


    try {

      await addDoc(collection(db, "Messages"), {
        text: message,
        uid: user.uid,
        uri: user.photoURL,
        createdAt: serverTimestamp(), 
      })
      setMessage("");
      divForScroll.current.scrollIntoView({
        behavior:"smooth"
      });
    } catch (error) {
      alert(error);
    }

  }


  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (data) => {
      setUser(data);
    });

    const func2= onSnapshot(q1, (snap)=>{
      setMessages(
        snap.docs.map((item)=>{
          const id = item.id;
          return { id, ...item.data()};
        })
      )
    })

    return () => {
      unsubscribe();
      func2();
    }
  }, []);


  return <Box >
    {
      user ? (
        <Container h={"100vh"} bg={"beige"} paddingY={"4"} bgGradient='linear(red.100 0%, orange.100 25%, yellow.100 50%)'>

          <VStack  height={"100%"} padding={4}>
            <Button colorScheme={"purple"} onClick={HandleLogout}  width={"100%"}>
              Sign Out
            </Button>

            <VStack h={"full"} w={"full"} overflowY="auto" css={{"&::-webkit-scrollbar":{
                display :"none"
            }}}>

              {messages.map((item)=>(

                <Message key={item.id} text={item.text} uri={item.uri} user={item.uid===user.uid? "me":"other"} />

              ))}
                   <div ref={divForScroll}></div>
            </VStack>

         

            <form onSubmit={HandleSubmit} style={{ width: "100%" }}>
              <HStack>
                <Input value={message} onChange={
                  (e) => {
                    setMessage(e.target.value);
                  }
                } colorScheme={"gray"} placeholder="Type ur message here" />
                <Button colorScheme={"purple"} type={"submit"}>
                  Send
                </Button>
              </HStack>
            </form>




          </VStack>
        </Container >

      ) :
      <Container 
      
      h={"100vh"} bg={"beige"} paddingY={"4"} bgGradient='linear(red.100 0%, orange.100 25%, yellow.100 50%)'>

        <Heading textAlign={"center"}>
          Chat-Ore
        </Heading>
        <Image src='https://st.depositphotos.com/1169411/1267/i/450/depositphotos_12670132-stock-photo-cloud-of-speech-text-bubbles.jpg' alt='Image of logo' marginBottom={"4"} />
      <VStack  
     >
        <Button onClick={HandleLogin}>
          Sign In With Google
        </Button>
      </VStack>

      </Container >

    }

  </Box>;

}

export default App;
