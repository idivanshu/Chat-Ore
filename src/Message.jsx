import React from 'react';
import { HStack, Avatar, Text   } from '@chakra-ui/react';   



function Message({text, uri, user="other"}) {
  return (
    <HStack alignSelf={user==="me"?"self-end":"self-start"} bgColor={"blackAlpha.500"} border={"2px solid aliceblue"} borderRadius={"base"}  paddingX={"3"} paddingY={"1"}  >
     {
    
    user==="other" &&    <Avatar src={uri}/>
    }
     
      <Text>{text}</Text>
      {
    
      user==="me" &&    <Avatar src={uri}/>
      }
    </HStack>
  )
}

export default Message