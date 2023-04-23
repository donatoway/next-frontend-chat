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
import Box from '@mui/material/Box';
import { useRouter } from "next/router";

export const socket = io('http://localhoqst:3000', {credentials:'include'});

const getChannels = async () => {
   const ch = await fetch("http://localhost:3000/messages/channels", {method: 'GET', credentials:'include'})
   const data = await ch.json();
   return data;
}

export default  function  ({currentChannel = {}, channels = []}) {
   const [totalMessages, setTotalMessages] = useState([])
   const [showForm, setShowForm] = useState(false);
   const [name, setName] = useState('');
   const [messageText, setMessageText] = useState('');
   const [Password, setPassword] = useState(undefined);
   const [ChatRoom, setChatroom] = useState('');
   const [totalChannels, setTotalChannels] = useState([channels])
   const {tokens} = useTheme()
   const handleMessageSend = (newMessage) => {
      setTotalMessages([newMessage, ...totalMessages])
   }

    /*  socket.on('message', (message) =>
      {
         const msgs = totalMessages.push(message);
         setTotalMessages(msgs);
      });
      */

   const joinChannel  = async () => {
      console.log(await totalChannels);
   }

   const sendMessage = async () => {
      // const nome = await getUsers();
      setChatroom("stanza1");
      setName("mimmo");
      console.log(messageText + " " + ChatRoom +" " + name)
       socket.emit('createMessage', {text: messageText, channel:ChatRoom, name: name}, () => {
         messageText.value = '';
       })
     }

   const createRoom = async (event) => {
      event.preventDefault()
      socket.emit('createRoom', {channel: ChatRoom, name: name, Password: Password}, async () => {
        // joined.value = true;
        setTotalChannels(await getChannels());
        setShowForm(false);
        console.log(ChatRoom + " " + name + " ");
        setChatroom('');
        setName('');
        setPassword(undefined);
       })
       //console.log(ChannelForm.ChatRoom.value + " " + ChannelForm.name.value + " ");

     }
   const showFormFunction = () => {
      setShowForm(true);
   }

   useEffect(() => {

     const messages = mockMessages.filter(
        (mckMsg) => mckMsg.ChannelName == currentChannel.ChannelName
     )
     setTotalMessages(messages)
   }, [currentChannel.ChannelName])

   useEffect(() => {
      // const messages = mockMessages.filter(
      //    (mckMsg) => mckMsg.channelId == currentChannel.channelId
       //)
      // setTotalMessages(messages)
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
                  <InputArea onMessageSend={handleMessageSend} />
              </Flex>
            </View>
            <Flex direction="column" >
            <ButtonGroup variant="contained">
               <Button onClick={showFormFunction}>add channel</Button>
               <Button onClick={joinChannel}>join channel</Button>
            </ButtonGroup>
            
            {showForm &&
               <div>
                  {ChatRoom - name}
                  <form onSubmit={createRoom}>
                     Name:  <TextField id="name" label="ex: donny" variant="standard" value={name} onChange={e => setName(e.target.value)} />
                     Channel:  <TextField id="channel" label="ex: room1" variant="standard" value={ChatRoom} onChange={e => setChatroom(e.target.value)}/>
                     Password :  <TextField id="password" label="ex: password" variant="standard" value={Password} onChange={e => setPassword(e.target.value)} />
                     <Button type="submit">submit</Button>
                  </form>
               </div>
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
   const channel = ch.find(
      (channel) => channel.ChannelName == params.ChannelName 
   )
   return {
      props: {
         currentChannel:channel,
         channels:ch,
         channels: ch,
      },
      revalidate: 5,
   }
}

/*
   Collegare  i messaggi: implementare correttamente il send message e aggiornare un message/setMessage
*/