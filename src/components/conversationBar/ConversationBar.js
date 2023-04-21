import { useRouter } from "next/router"
import { ChannelList } from "../channelList.js"
import { useState } from 'react'
import { Flex, Menu, useBreakpointValue } from '@aws-amplify/ui-react'

export const ConversationBar = ({channels = []}) => {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false)
	const variation = useBreakpointValue({
		base: 'isMobile',
		medium: 'isTabletOrHigher',
	})
    const toggleMenu = (channelId) => {
        setIsMenuOpen(false);
        router.push(`/channels/${channelId}`)
    }
    const ConversationDisplay = ({channels=[]}) => {
        if (variation == 'isMobile') {
            return (
                <Flex>
                    <Menu isOpen= {isMenuOpen} menuAlign="start" onOpenChanege={() => {
                        setIsMenuOpen(!isMenuOpen)
                    }}>
                        <ChannelList channels={channels} handleMenuToggle={toggleMenu} />
                    </Menu>
                </Flex>
            )
        } else if (variation === 'isTabletOrHigher')
        {
            return <ChannelList channels= {channels} handleMenuToggle={toggleMenu} />

        }
    }
    return <ConversationDisplay channels={channels} />
}