import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css"; // Import styles
import { FaTimes, FaSun, FaCloudSun, FaCloudMoon } from "react-icons/fa"; // Import icons
import config from "./config"; // Import config
import ActionProvider from "./ActionProvider"; // Import ActionProvider
import MessageParser from "./MessageParser"; // Import MessageParser
import axios from "axios"; // Import axios for API calls
import chatWithGemini from "./chatWithGemini"; // Import chatWithGemini function

const ChatbotComponent = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState(config.initialMessages);
  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef(null);

  const actionProvider = new ActionProvider(
    (response) => ({ sender: "bot", text: response }),
    (newMessage) => setMessages((prev) => [...prev, newMessage])
  );

  const messageParser = new MessageParser(actionProvider);

  const fetchServiceIssues = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/service-issues");
      if (Array.isArray(response.data)) {
        const initialMessages = response.data.map((msg) => ({
          sender: "bot",
          text: msg.issueName, // Extract and use only the issueName
          isClickable: true // Mark as clickable
        }));
        setMessages((prev) => [...prev, ...initialMessages]);
      } else {
        console.error("No data found in response");
      }
    } catch (error) {
      console.error("Error fetching initial messages:", error);
    }
  };

  const handleSend = async (message = userInput) => {
    if (message.trim() === "") return;

    const newMessages = [...messages, { sender: "user", text: message }];
    setMessages(newMessages);
    const userMessage = message;
    setUserInput("");

    // Check if the user input is "get services"
    if (userMessage.toLowerCase() === "get services") {
      await fetchServiceIssues();
    } else {
      // Check if the service exists
      try {
        const response = await axios.get("http://localhost:8080/api/service-issues");
        const serviceExists = Array.isArray(response.data) && response.data.some((msg) => msg.issueName.toLowerCase() === userMessage.toLowerCase());

        if (serviceExists) {
          // Fetch service details
          const serviceDetailResponse = await axios.get(`http://localhost:8080/api/service-issues/issue-detail/${encodeURIComponent(userMessage)}`);
          const serviceDetail = serviceDetailResponse.data;

          // Add service detail to messages
          setMessages((prev) => [...prev, { sender: "bot", text: `Service details for ${userMessage}: ${serviceDetail.service.basePrice}` }]);
        } else {
          // Parse user input
          await messageParser.parse(userMessage);

          // Chat with Gemini
          chatWithGemini(userMessage, (error, responseText) => {
            if (error) {
              console.error("Error chatting with Gemini:", error);
              return;
            }
            if (responseText) {
              const dynamicMessages = responseText.split('\n')
                .filter(text => text.trim() !== "") // Filter out empty messages
                .map(text => ({ sender: "bot", text }));
              setMessages((prev) => [...prev, ...dynamicMessages]);
            }
          });
        }
      } catch (error) {
        console.error("Error checking service existence:", error);
        setMessages((prev) => [...prev, { sender: "bot", text: "Error checking service existence. Please try again." }]);
      }
    }
  };

  useEffect(() => {
    setMessages(config.initialMessages);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleIssueClick = (issueName) => {
    handleSend(issueName);
  };

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return { greeting: "Good Morning", icon: <FaSun style={{ color: "orange" }} /> };
    } else if (currentHour < 18) {
      return { greeting: "Good Afternoon", icon: <FaCloudSun style={{ color: "yellow" }} /> };
    } else {
      return { greeting: "Good Evening", icon: <FaCloudMoon style={{ color: "blue" }} /> };
    }
  };

  const { greeting, icon } = getGreeting();

  return (
    <div>
      {/* Chatbot Toggle Button */}
      <button className="chatbot-btn" onClick={() => setShowChat(!showChat)}>
        {showChat ? "Close Chat" : <>{icon} {greeting}! </>}
      </button>

      {/* Chatbot UI */}
      {showChat && (
        <div className="chatbot-container animate__animated animate__zoomIn">
          <div className="chatbot-header">
            <h2>{config.botName}</h2>
            <button className="close-btn" onClick={() => setShowChat(false)}>
              <FaTimes />
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chatbot-message ${msg.sender} animate__animated animate__fadeIn`}
                onClick={msg.isClickable ? () => handleIssueClick(msg.text) : undefined}
                style={{ cursor: msg.isClickable ? "pointer" : "default" }}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
            />
            <button onClick={() => handleSend()}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotComponent;