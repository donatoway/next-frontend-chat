import { TextAreaField, View, Flex, Button, TextField } from "@aws-amplify/ui-react"
import { useState } from "react"
let i =  1;

export const InputArea = (/*{onMessageSend}, */ props ) => {
    const [messageText, setMessageText] = useState('')
    const [imageName, setImageName] = useState()
    return <View
        style={{
            borderTop: '1px solid lightgray',
            padding: '5px',
        }}
    >
        <View>
            <TextAreaField
                placeholder="type a message..."
                rows={2}
                onChange={(e) => {
                    setMessageText(e.target.value)
                }}
                value={messageText}
            />
            <hr />
            <Flex justifyContent={'space-between'} alignItems={'center'}>
            <TextField
                type={'file'}
                onChange={(e) => setImageName(e.target.files[0].name)}
            />
            <Button
                variation="primary"
                onClick={ () => {
                   props.onMessageSend({
                        id: props.mex,
                        name: props.user.nickname,
                        channel: props.channel,
                        profilePic: props.user.profilePic,
                        text: messageText
                    })
                
                    setMessageText('')
                    console.log(props.user)
                }}
            >Send</Button>
            </Flex>
        </View>
    </View>
}