import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	View,
} from '@aws-amplify/ui-react'
export const ChannelList = ({handleMenuToggle, totalChannels=[]}) => {
    return (
        <View>
            <Table variation="striped" highlightOnHover>
                <TableHead>
                        <TableRow>
                            <TableCell as="th">Application Rooms</TableCell>
                        </TableRow>
                </TableHead>
                <TableBody>
                    {totalChannels.map((channel) => (
                        <TableRow key={channel.ChannelName}
                        onClick={() => { handleMenuToggle(channel.ChannelName)}}
                        >
                        <TableCell>{channel.ChannelName}</TableCell>    
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </View>
    )
}