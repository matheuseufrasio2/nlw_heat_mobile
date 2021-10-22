import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import {
  ScrollView,
} from 'react-native';
import { api } from '../../services/api';
import { Message, MessageProps } from '../Message';

import { styles } from './styles';

let messagesQueue: MessageProps[] = [];

const socket = io(String(api.defaults.baseURL));

socket.on('new_message', (newMessage: MessageProps) => {
  messagesQueue.push(newMessage);
});

export function MessageList() {
  const [currentMessages, setCurrentMessages] = useState<MessageProps[]>([]);

  useEffect(() => {
    api.get<MessageProps[]>('messages/last3').then(response => {
      setCurrentMessages(response.data);
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if(messagesQueue.length > 0) {
        setCurrentMessages(prevState => [
          messagesQueue[0],
          prevState[0],
          prevState[1]
        ]);
        messagesQueue.shift();
      }
    }, 3000);

    // return () => clearInterval(timer);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="never"
    >
      {
        currentMessages.map(message => (
          <Message key={message.id} data={message} />
        ))
      }
    </ScrollView>
  );
}