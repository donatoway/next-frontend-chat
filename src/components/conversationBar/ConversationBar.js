import { useRouter } from "next/router"
import { ChannelList } from "../channelList.js"
import { useState } from 'react'
import { Flex, Menu, useBreakpointValue } from '@aws-amplify/ui-react'

export const ConversationBar = ({totalChannels = []}) => {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false)
	const variation = useBreakpointValue({
		base: 'isMobile',
		medium: 'isTabletOrHigher',
	})
    const toggleMenu = (ChannelName) => {
        setIsMenuOpen(false);
        router.push(`/channels/${ChannelName}`)
    }
    const ConversationDisplay = ({totalChannels=[]}) => {
        if (variation == 'isMobile') {
            return (
                <Flex>
                    <Menu isOpen= {isMenuOpen} menuAlign="start" onOpenChanege={() => {
                        setIsMenuOpen(!isMenuOpen)
                    }}>
                        <ChannelList totalChannels={totalChannels} handleMenuToggle={toggleMenu} />
                    </Menu>
                </Flex>
            )
        } else if (variation === 'isTabletOrHigher')
        {
            return <ChannelList totalChannels= {totalChannels} handleMenuToggle={toggleMenu} />

        }
    }
    return <ConversationDisplay totalChannels={totalChannels} />
}