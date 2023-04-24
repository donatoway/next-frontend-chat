import { Button, Flex, Heading, View, useTheme } from "@aws-amplify/ui-react"
import { mockChannels, mockMessages } from "../../../mockdata"
import { ConversationBar } from '../../components/conversationBar'
import TextField from '@mui/material/TextField';
import { useState, useEffect } from "react"
import { MessageList } from "../../components/messages"
import { MessageItem } from "../../components/messages"
import { InputArea } from "../../components/InputArea"
import { ButtonGroup } from "@aws-amplify/ui-react"
import io from "socket.io-client";
import {messageText} from "../../components/InputArea"
import Box from '@mui/material/Box';
import { useRouter } from "next/router";
let counter = 0;
export const socket = io('http://localhost:3000', {credentials:'include'});

const getChannels = async () => {
//   const ch = await fetch("http://localhost:3000/messages/channels", {method: 'GET', credentials:'include'})
  // const data = await ch.json();
 //  return data;
   let url = "http://localhost:3000/messages/channels";
   try {
       let res = await fetch(url);
       return await res.json();
   } catch (error) {
       console.log(error);
   }
}

const getAllMessages = async () => {
   const ch = await fetch("http://localhost:3000/messages/allMessages", {method: 'GET', credentials:'include'})
   const data = await ch.json();
   return data;
}



export default  function  ({currentChannel = {}, channels = [], messages = []}) {
   const [totalMessages, setTotalMessages] = useState([])
 //  const [messages, setMessages] = useState([]);
   const [showForm, setShowForm] = useState(false);
 //  const [name, setName] = useState('');
   //const [messageText, setMessageText] = useState('');
   const [Password, setPassword] = useState(undefined);
   const [ChatRoom, setChatroom] = useState('');
   const [totalChannels, setTotalChannels] = useState([channels])
   const user = {nickname: "donny", channel: currentChannel.ChannelName, profilePic: 'https://github.com/mtliendo.png'};
   const {tokens} = useTheme()
   const handleMessageSend = (newMessage) => {
      setTotalMessages([newMessage, ...totalMessages])
      console.log(totalMessages)
   }

   const joinChannel  = async () => {
     // const mex = await getAllMessages();
      console.log(messages);
   }

   const sendMessage = async (newMessage) => {
      // const nome = await getUsers();
      console.log(newMessage);
      socket.emit('createMessage', {profilePic: newMessage.profilePic, text: newMessage.text, channel:newMessage.channel, name: newMessage.name, id: counter++}, () => {
         handleMessageSend(newMessage);
         // messageText.value = '';
       })
     }

   const createRoom = async (event) => {
      event.preventDefault()
      socket.emit('createRoom', {channel: ChatRoom, name: user.nickname, Password: Password}, async () => {
        // joined.value = true;
        setTotalChannels(await getChannels());
        setShowForm(false);
        setChatroom('');
        setPassword(undefined);
       })
     }
   const showFormFunction = () => {
      setShowForm(true);
   }

   useEffect(() => {
      const messageInRoom = messages.filter(
         (message) => message.channel == currentChannel.ChannelName
      )
      setTotalMessages(messageInRoom);
   }, [currentChannel.ChannelName])
   
   useEffect( () => {
      setTotalChannels(channels);
     }, [])
     return (
     <>
        <Flex direction={{base: 'column', medium:'row'}}>
            < ConversationBar totalChannels={totalChannels} />
            <View flex={ { base: 0, medium: 1 } }>
              <Heading
                 style={{borderBottom: '1px solid black'}}
                 padding={tokens.space.small}
                 textAlign={'center'}
                 level={3}
                 color={tokens.colors.blue[60]}
              >
               {currentChannel.ChannelName}
              </Heading>
              <Flex direction="column" height="85vh">
                  <MessageList messages={totalMessages} /> 
                  <InputArea onMessageSend={sendMessage} user= {user} mex={counter}/>
              </Flex>
            </View>
            <Flex direction="column" >
            <ButtonGroup variant="contained">
               <Button onClick={showFormFunction}>add channel</Button>
               <Button onClick={joinChannel}>join channel</Button>
            </ButtonGroup>
            
            {showForm &&
               <div>
                  <form onSubmit={createRoom}>
                     Channel:  <TextField id="channel" label="ex: room1" variant="standard" value={ChatRoom} onChange={e => setChatroom(e.target.value)}/>
                     Password :  <TextField id="password" label="ex: password" variant="standard" value={Password} onChange={e => setPassword(e.target.value)} />
                     <Button type="submit">submit</Button>
                  </form>
               </div>
               // funzione provvisoria per settare il nome dopo toglierla

            }
            </Flex>
        </Flex>
     </>
     )
}

 export async function getStaticPaths() {
   const ch = await getChannels();
   const paths = ch.map(({ ChannelName }) => ({ params: { ChannelName } } )) 
      console.log('these are paths', paths)
      return {
         paths,
         fallback:true,
      }
}

export async function getStaticProps( {params}) {
   //console.log('these are params', params)
   const ch = await getChannels();
   const mex  = await getAllMessages();
   mex.reverse();
   const channel = ch.find(
      (channel) => channel.ChannelName == params.ChannelName 
   )
   return {
      props: {
         currentChannel:channel,
         channels:ch,
         channels: ch,
         messages: mex
      },
      revalidate: 10,
   }
}

/*
   creare le options;
   creare una user-channelList avatar;
   integrare il tutto nel progetto
*/