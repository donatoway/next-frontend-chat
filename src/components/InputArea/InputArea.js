import { TextAreaField, View, Flex, Button, TextField } from "@aws-amplify/ui-react"
import { useState } from "react"
export const InputArea = ({onMessageSend}) => {
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
                    onMessageSend({
                        id:11,
                        createAt: 12345,
                        channelId: 'efg1234',
                        updatedAt: 2334445,
                        username: 'mtliendo',
                        profilePic: 'https://github.com/mtliendo.png',
                        content: messageText
                    })
                    setMessageText('')
                }}
            >Send</Button>
            </Flex>
        </View>
    </View>
}