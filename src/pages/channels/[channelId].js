import { Button, Flex, Heading, View, useTheme } from "@aws-amplify/ui-react"
import { mockChannels, mockMessages } from "../../../mockdata"
import { ConversationBar } from '../../components/conversationBar'
import { useState, useEffect } from "react"
import { MessageList } from "../../components/messages"
import { MessageItem } from "../../components/messages"
import { InputArea } from "../../components/InputArea"
import { ButtonGroup } from "@aws-amplify/ui-react"
import io from "socket.io-client";

export const socket = io('http://localhost:3000', {credentials:'include'});
const name =( "donny");
const ChatRoom = ('stanza1')
const Password = ('')

export default  function  ({currentChannel = {}, channels = []}) {
   const [totalMessages, setTotalMessages] = useState([])
   const {tokens} = useTheme()
   const handleMessageSend = (newMessage) => {
      setTotalMessages([newMessage, ...totalMessages])
   }
   const addChannel = () => {
      console.log("add new channel");
   }

   const joinChannel = () => {
      console.log("join new channel");
   }

   const createRoom = async () => {
      // const nome = await getUsers();
       socket.emit('createRoom', {channel: ChatRoom.value, name: name.value, Password: Password.value}, () => {
         joined.value = true;
       }) 
     }

   useEffect(() => {
     const messages = mockMessages.filter(
        (mckMsg) => mckMsg.channelId == currentChannel.channelId
     )
     setTotalMessages(messages)
   }, [currentChannel.channelId])
     return (
     <>
        <Flex direction={{base: 'column', medium:'row'}}>
            <ConversationBar channels={channels}/>
            <View flex={ { base: 0, medium: 1 } }>
              <Heading
                 style={{borderBottom: '1px solid black'}}
                 padding={tokens.space.small}
                 textAlign={'center'}
                 level={3}
                 color={tokens.colors.blue[60]}
              >
               {currentChannel.name}
              </Heading>
              <Flex direction="column" height="85vh">
                  <MessageList messages={totalMessages} />
                  <InputArea onMessageSend={handleMessageSend} />
              </Flex>
            </View>
            <Flex direction="column" >
            <ButtonGroup variant="contained">
               <Button onClick={createRoom}>add channel</Button>
               <Button onClick={joinChannel}>join channel</Button>
            </ButtonGroup>
            </Flex>
        </Flex>
     </>
     )
}

 export async function getStaticPaths() {
   const paths = mockChannels.map(({ channelId }) => ({ params: { channelId } } )) 
      console.log('these are paths', paths)
      return {
         paths,
         fallback:true,
      }
}

export async function getStaticProps( {params}) {
   console.log('these are params', params)
   const channel = mockChannels.find(
      (mckChnl) => mckChnl.channelId == params.channelId 
   )
   return {
      props: {
         currentChannel:channel,
         channels:mockChannels,
         channels: mockChannels,
      },
      revalidate: 10,
   }
}