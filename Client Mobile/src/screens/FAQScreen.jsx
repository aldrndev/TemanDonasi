// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   StyleSheet,
//   Text,
//   TextInput,
//   Button,
//   FlatList,
//   Image,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import io from "socket.io-client";

// const FAQScreen = () => {
//   const [messages, setMessages] = useState([]);
//   const [messageInput, setMessageInput] = useState("");
//   const [isBotTyping, setIsBotTyping] = useState(false);

//   const flatListRef = useRef(null);

//   const scrollToBottom = () => {
//     if (flatListRef.current) {
//       flatListRef.current.scrollToEnd({ animated: true });
//     }
//   };

//   const onSend = (text) => {
//     if (text) {
//       socket.emit("chat message", text);
//       setMessageInput("");
//       setIsBotTyping(true);

//       const newUserMessage = {
//         text,
//         user: "user",
//         id: Date.now().toString(),
//         username: "Guest",
//         profilePicture: require("../assets/guest.png"),
//       };
//       setMessages((prevMessages) => [...prevMessages, newUserMessage]);

//       setTimeout(() => {
//         const botResponse = "Apakah masih ada yang ingin kamu tanyakan?";
//         const newBotMessage = {
//           text: botResponse,
//           user: "bot",
//           id: Date.now().toString(),
//           username: "Bot",
//           profilePicture: require("../assets/bot-img.png"),
//         };
//         setIsBotTyping(false);
//         scrollToBottom();
//         setMessages((prevMessages) => [...prevMessages, newBotMessage]);
//       }, 1500);
//     }
//   };

//   const socket = io("https://v7lc0dx2-3000.asse.devtunnels.ms/");

//   useEffect(() => {
//     const initialBotResponse = "Halo! apa yang bisa aku bantu?";
//     const initialBotMessage = {
//       text: initialBotResponse,
//       user: "bot",
//       id: Date.now().toString(),
//       username: "Bot",
//       profilePicture: require("../assets/bot-img.png"),
//     };
//     setMessages([initialBotMessage]);
//     scrollToBottom();
//   }, []);

//   useEffect(() => {
//     socket.on("chat message", (message) => {
//       const newBotMessage = {
//         text: message,
//         user: "bot",
//         id: Date.now().toString(),
//         username: "Bot",
//         profilePicture: require("../assets/bot-img.png"),
//       };
//       setMessages((prevMessages) => [...prevMessages, newBotMessage]);
//       setIsBotTyping(false);
//       scrollToBottom();
//     });
//   }, []);

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <View style={styles.container}>
//         <FlatList
//           ref={flatListRef}
//           data={messages}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <View
//               style={[
//                 styles.messageContainer,
//                 item.user === "user" ? styles.userMessage : styles.botMessage,
//               ]}
//             >
//               <Image style={styles.profileImage} source={item.profilePicture} />
//               <View style={styles.messageContent}>
//                 <Text style={styles.username}>{item.username}</Text>
//                 <Text style={styles.messageText}>{item.text}</Text>
//               </View>
//             </View>
//           )}
//         />
//         {isBotTyping && (
//           <Text style={styles.typingIndicator}>Bot sedang mengetik...</Text>
//         )}
//         <View style={styles.inputContainer}>
//           <TextInput
//             value={messageInput}
//             onChangeText={setMessageInput}
//             placeholder="Type your message here"
//             style={styles.input}
//           />
//           <Button title="Send" onPress={() => onSend(messageInput)} />
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16 },
//   messageContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   userMessage: {
//     justifyContent: "flex-end",
//     marginLeft: 50,
//   },
//   botMessage: {
//     justifyContent: "flex-start",
//     marginRight: 50,
//   },
//   profileImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 10,
//   },
//   messageContent: { flex: 1 },
//   username: { fontWeight: "bold" },
//   messageText: {
//     backgroundColor: "#e0e0e0",
//     padding: 10,
//     borderRadius: 10,
//   },
//   typingIndicator: { alignSelf: "flex-end", color: "#aaa" },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   input: { flex: 1, marginRight: 10 },
// });

// export default FAQScreen;

import { useState, useEffect } from "react";
import { View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

import { Dialogflow_V2 } from "react-native-dialogflow";
import { dialogflowConfig } from "../../env";
import { SafeAreaView } from "react-native";

const FAQScreen = () => {
  const BOT_USER = {
    _id: 2,
    name: "FAQ Bot",
    avatar: "https://cdn-icons-png.flaticon.com/512/8649/8649605.png",
  };

  const [chatState, setChatState] = useState({
    messages: [
      {
        _id: 1,
        text: `Selamat datang di TemanDonasi, ini adalah layanan chatbot F&Q.`,
        createdAt: new Date(),
        user: BOT_USER,
      },
    ],
  });

  const handleGoogleResponse = (result) => {
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];
    sendBotResponse(text);
  };

  const sendBotResponse = (text) => {
    let msg = {
      _id: chatState.messages.length + 1,
      text,
      createdAt: new Date(),
      user: BOT_USER,
    };

    setChatState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, [msg]),
    }));
  };

  const onSendHandler = (messages = []) => {
    setChatState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));

    let message = messages[0].text;

    Dialogflow_V2.requestQuery(
      message,
      (result) => handleGoogleResponse(result),
      (error) => console.log(error)
    );
  };

  useEffect(() => {
    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id
    );
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          marginTop: 30,
          backgroundColor: "#fff",
        }}
      >
        <GiftedChat
          messages={chatState.messages}
          onSend={onSendHandler}
          user={{ _id: 1 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default FAQScreen;
