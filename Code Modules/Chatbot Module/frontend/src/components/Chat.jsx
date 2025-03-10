import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from 'axios'
import { IoSend } from "react-icons/io5";
import { FaRobot } from "react-icons/fa";
import './Chatbot.css'


const sendMessageAPI = async (message) => {
    const res = await axios.post("http://localhost:9000/ask", { message });
    return res.data;
};


const Chat = () => {
    const [message, setMessage] = useState("");
    const [isAITyping, setIsAITyping] = useState(false);
    const [conversation, setConversation] = useState([
        {
            role: "assistant",
            content: "Hello I am Sher... Your AI Chatbot. How can I help you?",
        },
    ]);

    const mutation = useMutation({
        mutationFn: sendMessageAPI,
        onSuccess: (data) => {
            setIsAITyping(false); // Stop showing AI typing when response arrives
            setConversation((prevConversation) => [
                ...prevConversation,
                { role: "assistant", content: data.message },
            ]);
        },
    });

    const handleSendMessage = () => {
        const currentMessage = message.trim();
        if (!currentMessage) {
            alert("Please enter a message.");
            return;
        }

        setConversation((prevConversation) => [
            ...prevConversation,
            { role: "user", content: currentMessage },
        ]);

        setIsAITyping(true); // Show AI is typing as soon as the message is sent

        mutation.mutate(currentMessage); // Removed redundant onSuccess here

        setMessage(""); // Clear the input after sending
    };

    return (
    <body>
        <div className="back">
            <div className="header">
                <h1 className="title">Sign Language Website Assistant</h1>
                <p className="description">
                    Enter your message in the input field below to chat with the Assistant.
                </p>
            </div>
            <div className="chat-container">
                <div className="conversation">
                    {conversation.map((entry, index) => (
                        <div key={index} className={`message ${entry.role}`}>
                            <strong>
                                {entry.role === "user" ? "You: " : <FaRobot />}
                            </strong>
                            {entry.content}
                        </div>
                    ))}
                    {isAITyping && (
                        <div className="message assistant">
                            <FaRobot />
                            <strong>Sher is typing...</strong>
                        </div>
                    )}
                </div>
                <div className="input-area">
                    <input
                        type="text"
                        placeholder="Enter message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="input-message"
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={mutation.isPending}
                        className="send-btn"
                    >
                        {mutation.isPending ? <IoSend className="icon-spin" /> : <IoSend />}
                    </button>
                </div>
            </div>
        </div>
    </body>    
    );
};

export default Chat;
