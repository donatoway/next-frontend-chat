import { Flex, Heading, View, useTheme } from "@aws-amplify/ui-react"
import { mockChannels, mockMessages } from "../../../mockdata"
import { ConversationBar } from '../../components/conversationBar'
import { useState, useEffect } from "react"
import { MessageList } from "../../components/messages"
import { MessageItem } from "../../components/messages"
import { InputArea } from "../../components/InputArea"


export default  function  ({currentChannel = {}, channels = []}) {
   const [totalMessages, setTotalMessages] = useState([])
   const {tokens} = useTheme()
   const handleMessageSend = (newMessage) => {
      setTotalMessages([newMessage, ...totalMessages])
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