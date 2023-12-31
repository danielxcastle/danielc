import React, { useState, useEffect } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import chatimg from "../../img/Bartenderchatlogo/bartenderIconwhite.png";

import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react';

// Define custom styles for the chat elements
const customStyles = {
  chatContainer: {
    backgroundColor: 'red', 
  },
  message: {
    backgroundColor: 'white', 
    color: 'green', 
  },
  messageInput: {
    backgroundColor: 'red', 
    color: 'orange', 
  },
};

function ChatBot() {
  const [chatVisible, setChatVisible] = useState(false);
  const [isChatBigger, setIsChatBigger] = useState(false);
  const [messages, setMessages] = useState(() => loadMessagesFromLocalStorage());

  useEffect(() => {
    saveMessagesToLocalStorage(messages);
  }, [messages]);

  const [isTyping, setIsTyping] = useState(false);

  const toggleChat = () => {
    setChatVisible(!chatVisible);
    setIsChatBigger(!isChatBigger);
  };

  const chatStyle = isChatBigger
    ? {
        width: "400px",
        height: "500px",
        ...customStyles.chatContainer,
      }
    : {
        width: "300px",
        height: "400px",
        ...customStyles.chatContainer, 
      };

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  function saveMessagesToLocalStorage(messages) {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }

  function loadMessagesFromLocalStorage() {
    const storedMessages = localStorage.getItem('chatMessages');
    return storedMessages ? JSON.parse(storedMessages) : [
      {
        message: "Hello, I'm Cheers! Let's Make A Drink",
        sentTime: "just now",
        sender: "ChatGPT"
      }
    ];
  }

  async function processMessageToChatGPT(chatMessages) {
    try {
      let apiMessages = chatMessages.map((messageObject) => {
        let role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
        return { role, content: messageObject.message };
      });

      const systemMessage = {
        role: "system",
        content: "Speak like a bartender."
      };

      const apiRequestBody = {
        model: "gpt-3.5-turbo",
        messages: [systemMessage, ...apiMessages],
      };

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + process.env.REACT_APP_CHATBOT_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiRequestBody),
      });

      if (!response.ok) {
        throw new Error("API request failed.");
      }

      const data = await response.json();
      setMessages([...chatMessages, { 
        message: data.choices[0].message.content, 
        sender: "ChatGPT" 
      }]);
      setIsTyping(false);
    } catch (error) {
      console.error("API request error:", error);
    }
  }

  return (
    <div>
      {chatVisible && (
        <div style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          ...chatStyle,
        }}>
          <MainContainer>
            <ChatContainer style={customStyles.chatContainer}>
              <MessageList
                scrollBehavior="smooth"
                typingIndicator={isTyping ? <TypingIndicator content="Cheers is typing" /> : null}
              >
                {messages.map((message, i) => {
                  return <Message key={i} model={message} style={customStyles.message} />;
                })}
              </MessageList>
              <MessageInput
                style={customStyles.messageInput}
                placeholder="Type message here"
                onSend={handleSend}
              />
            </ChatContainer>
          </MainContainer>
        </div>
      )}

      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          cursor: "pointer",
          zIndex: 1001,
        }}
        onClick={toggleChat}
      >
        <img style={{width: "50px"}} src={chatimg}></img>
      </div>
    </div>
  );
}

export default ChatBot;
