/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/display-name */
import { Button, Flex, Heading, View, useTheme } from "@aws-amplify/ui-react"
import { mockChannels, mockMessages } from "../../../mockdata"
import { ConversationBar } from '../../components/conversationBar'
import TextField from '@mui/material/TextField';
import { useState, useEffect } from "react"
import { SelectTextFields } from "../../components/inputField";
import { MessageList } from "../../components/messages"
import { MessageItem } from "../../components/messages"
import { InputArea } from "../../components/InputArea"
import { ButtonGroup } from "@aws-amplify/ui-react"
import io from "socket.io-client";
import {messageText} from "../../components/InputArea"
import Box from '@mui/material/Box';
import { useRouter } from "next/router";
import { CgOptions } from 'react-icons/cg';
import { ButtonBase } from "@mui/material";
import { InputSlider } from "../../components/sliders";
let counter = 0;
let trig = 0;
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

const getPartecipants = async () => {
   let url = "http://localhost:3000/messages/channels";
   try {
       let res = await fetch(url, {method: 'GET', credentials:'include'});
       return await res.json();
   } catch (error) {
       console.log(error);
   }
}

export default  function  ({currentChannel = {}, channels = [], messages = []}) {
   const [totalMessages, setTotalMessages] = useState([])
 //  const [messages, setMessages] = useState([]);
   const [showForm, setShowForm] = useState(false);
   const [showJoin, setShowJoin] = useState(false);
   const [name, setName] = useState('');
   //const [messageText, setMessageText] = useState('');
   const [Password, setPassword] = useState(undefined);
   const [ChatRoom, setChatroom] = useState('');
   const [totalChannels, setTotalChannels] = useState([channels])
   const [user, setUser] = useState({});
   const [roomJoinId, setRoomJoinId] = useState([]);
   const [showOptions, setShowOptions] = useState(false);
   const [allPartecipants, setAllPartecipants] = useState([]);
   const [filterPartecipant, setFilterPartecipant] = useState([]);
   const [select, setSelect] = useState('');
   const [showBan, setShowBan] = useState(false);
   const [showMute, setShowMute] = useState(false);
   const [timer, setTimer] = useState(1);
   const [onMex, setOnMex] = useState([]);
   const [showPassword, setShowPassword] = useState(false);
   const [showAdmin, setShowAdmin] = useState(false);
  // const user = {nickname: "donny", channel: currentChannel.ChannelName, profilePic: 'https://github.com/mtliendo.png'};
   const {tokens} = useTheme()

      socket.on('message', (message) =>
      {
          setTotalMessages([message, ...totalMessages])
      });

   const handleMessageSend = (newMessage) => {
     // setTotalMessages([newMessage, ...totalMessages])
   }

   const checkJoin = () => 
   {
      const chToFind = roomJoinId.find(
         (ch) => ch.channel == currentChannel.ChannelName
      )
      if (chToFind)
      {
         return (1);
         console.log(chToFind);
      }
      return null;
   }
    
   const handleClickOpt = async (event) =>
   {
      event.preventDefault();
      setShowOptions(true);

      const ch = [] =  await getChannels()
      const channel = ch.filter(
         (obj) => obj.ChannelName == currentChannel.ChannelName
      )
      setAllPartecipants(channel.at(0).Partecipant)
      console.log(allPartecipants);
   }

   const handleTimer = async (timerFun) =>
   {
      setTimer(timerFun);
      console.log("timer minute : " + timerFun)
   }

   

   const joinChannel = async (event) => {
      // const nome = await getUsers();
      event.preventDefault()
      const channelToJoin= totalChannels.find(
         (ch) => ch.ChannelName == ChatRoom
      )
      if (channelToJoin)
      {
         socket.emit('join', {name: user.nickname, channel: ChatRoom, Password: Password}, () =>{
         setShowJoin(false);
         const id = {name: user.nickname, channel: ChatRoom}
         setRoomJoinId([id, ...roomJoinId]);
         currentChannel.ChannelName = ChatRoom;
         setPassword(undefined);
         setChatroom('');
       })
      }
      else
         console.log("JOIN: channel does not found");
     }

   const sendMessage = async (newMessage) => {
      // const nome = await getUsers();
      console.log(newMessage);
      socket.emit('createMessage', {profilePic: newMessage.profilePic, text: newMessage.text, channel:newMessage.channel, name: newMessage.name, id: counter++}, () => {
         handleMessageSend(newMessage);
         // messageText.value = '';
       })
     }

     const banUser = async () => {
      if (select == user.nickname)
      {
         console.log("you cannot ban yourself!") ;
         return
      }
      socket.emit('banUser', { channel: currentChannel.ChannelName,
         userToBan: select,
         name: user.nickname,
         timer: timer,
      }, () => {})

      console.log("banna l utente : " + select + " x un tempo di " + timer + " minuti")
      setSelect(undefined);
      setShowBan(false);
      setShowPassword(false);
      setShowMute(false);
      setShowOptions(false);
      setTimer(0);
     }

     const muteUser = async () => {

      socket.emit('muteOn', { channel: currentChannel.ChannelName,
         useToSilent: select,
         name: user.nickname,
         timer: timer,
      }, () => {})
      console.log("muteOn l utente : " + select + " x un tempo di " + timer + " minuti")
      setSelect(undefined);
      setShowPassword(false);
      setShowBan(false)
      setShowMute(false);
      setShowAdmin(false);
      setShowOptions(false);
      setTimer(0);
   }

   const setPasswordFunction = async () =>
   {
      socket.emit('setPassword', { channel: currentChannel.ChannelName,
         password: Password,
         name: user.nickname,
      }, () => {})
      console.log("l utente : " + user.nickname + "setta la Password : " + Password);
      setSelect(undefined);
      setShowAdmin(false);
      setShowBan(false);
      setShowMute(false);
      setShowPassword(false);
      setShowOptions(false);
      setPassword(undefined);
      setTimer(0);
   }

   const addAdmins = async (event) =>
   {
      
      socket.emit('addAdmin', { channel: currentChannel.ChannelName,
         userToAdd: select,
         name: user.nickname,
      }, () => {})
      setSelect(undefined);
      setShowMute(false);
      setShowBan(false);
      setShowAdmin(false);
      setShowPassword(false);
      setShowOptions(false);
      setTimer(0);
   }
   
   const setTempUser = () =>
   {
      setUser({nickname: name,  profilePic: 'https://github.com/mtliendo.png'});
      console.log(user);
   }

   const createRoom = async (event) => {
      currentChannel.ChannelName = ChatRoom;
      event.preventDefault()
      currentChannel.ChannelName = ChatRoom;
      socket.emit('createRoom', {channel: ChatRoom, name: user.nickname, Password: Password}, async () => {
        // joined.value = true;
        setTotalChannels(await getChannels());
        setShowForm(false);
        setPassword(undefined);
         setChatroom('');
         setRoomJoinId([{channel: ChatRoom, name: user.nickname}, ...roomJoinId]);
       })
     }
   const showFormFunction = () => {
      setShowForm(true);
   }

   const showJoinFunction = () => {
      setShowJoin(true);
   }

   const handleSelect = (selected) => {
      console.log("hai selezionato : " + selected);
      setSelect(selected);
   }

   useEffect(() => {
      const messageInRoom = messages.filter(
         (message) => message.channel == currentChannel.ChannelName
      )
      setShowOptions(false);
      setTotalMessages(messageInRoom);
      setShowBan(false);
      setSelect(undefined);
   }, [currentChannel.ChannelName])
   
   useEffect( () => {
      const messageInRoom = messages.filter(
         (message) => message.channel == currentChannel.ChannelName
      )
      setTotalMessages(messageInRoom);
      setTotalChannels(channels);
     }, [/*channels, currentChannel.ChannelName, messages*/])
     return (
     <>
        <Flex direction={{base: 'column', medium:'row'}}>
            < ConversationBar totalChannels={totalChannels} />
            { checkJoin() == 1 && 
               <View flex={{ base: 0, medium: 1 }}>
                    <Heading
                       style={{ borderBottom: '1px solid black' }}
                       padding={tokens.space.small}
                       textAlign={'center'}
                       level={3}
                       color={tokens.colors.blue[60]}
                    >
                       {currentChannel.ChannelName}
                    </Heading>
                    <Flex direction="column" height="85vh">
                       <MessageList messages={totalMessages} />
                       <InputArea onMessageSend={sendMessage} user={user} mex={counter} channel={currentChannel.ChannelName} />
                    </Flex>    
                 </View>
            }
                 <Flex direction="column">
                       <ButtonGroup variant="contained">
                          <Button onClick={showFormFunction}>add channel</Button>
                          <Button onClick={showJoinFunction}>join channel</Button>
                          <form>
                             <TextField id="name" label="" variant="standard" value={name} onChange={e => setName(e.target.value)} />
                             <Button onClick={setTempUser}>Set user</Button>
                          </form>
                       </ButtonGroup>

                       {showForm &&
                          <div>
                             <form onSubmit={createRoom}>
                                Channel:  <TextField id="channel" label="ex: room1" variant="standard" value={ChatRoom} onChange={e => setChatroom(e.target.value)} />
                                Password :  <TextField id="password" label="ex: password" variant="standard" value={Password} onChange={e => setPassword(e.target.value)} />
                                <Button type="submit">submit</Button>
                             </form>
                             {currentChannel.ChannelName = ChatRoom}
                          </div>
                          // funzione provvisoria per settare il nome dopo toglierla
                       }
                       {showJoin &&
                          <div>
                             <form onSubmit={joinChannel}>
                                Channel:  <TextField id="channel" label="ex: room1" variant="standard" value={ChatRoom} onChange={e => setChatroom(e.target.value)} />
                                Password :  <TextField id="password" label="ex: password" variant="standard" value={Password} onChange={e => setPassword(e.target.value)} />
                                <Button type="submit">submit</Button>
                             </form>
                          </div>
                          // funzione provvisoria per settare il nome dopo toglierla
                       }
                       <form onSubmit={handleClickOpt} >
                           <Button type="sumbit" backgroundColor={"#DFFBFF"} opacity={"90%"} width={"100%"}>
                              <CgOptions>
                              </CgOptions>
                           </Button>
                       </form>
                       {
                              showOptions &&
                              <Flex>
                                    <Button onClick={() => (setShowBan(true) )}>Ban user</Button>
                                    {
                                       showBan &&
                                          <form onSubmit={banUser}>
                                                User: <SelectTextFields id="user" users={allPartecipants} handleSelect={handleSelect}  ></SelectTextFields>
                                                Timer: <TextField id="timer" label="time" variant="standard" value={timer} onChange={e => setTimer(e.target.value)} />
                                                <Button type="submit">set</Button>
                                          </form>
                                    }
                                    <Button onClick={() => (setShowMute(true)) }>Mute user</Button>
                                    {
                                       showMute && 
                                          <form onSubmit={muteUser}>
                                                User: <SelectTextFields id="user" users={allPartecipants} handleSelect={handleSelect}  ></SelectTextFields>
                                                Timer: <TextField id="timer" label="time" variant="standard" value={timer} onChange={e => setTimer(e.target.value)} />
                                                <Button type="submit">set</Button>
                                          </form>
                                    }
                                    <Button onClick={() => (setShowAdmin(true)) }>add Admin</Button>
                                    {
                                       showAdmin && 
                                          <form onSubmit={addAdmins}>
                                                User: <SelectTextFields id="user" users={allPartecipants} handleSelect={handleSelect}  ></SelectTextFields>
                                                <Button type="submit">set</Button>
                                          </form>
                                    }
                                    <Button onClick={() => (setShowPassword(true)) }>set Password</Button>
                                    {
                                       showPassword && 
                                          <form onSubmit={setPasswordFunction}>
                                               Password :  <TextField id="password" label="ex: password" variant="standard" value={Password} onChange={e => setPassword(e.target.value)} />
                                                <Button type="submit">set</Button>
                                          </form>
                                    }
                              </Flex>
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
   creare una user-channelList avatar;
   integrare il tutto nel progetto
*/





/*-------- TODO ---------------------------
/*
BACKEND: 
1) createMessage: sostiture lo user da trovare con il ban con
   const isBanned = channel.BanList.find((nick) => nick == user.nickname);
   e se isBanned allora eseguire il checkBan ed ilresto.
   Aggiungere il try catch all inizio se il nome non esiste ritorna
2) creare un SubscribeMessage(addAdmins) che va a richiamare la funzione addAdminToChannel
   e ricostruirla come nella chiamata api
*/