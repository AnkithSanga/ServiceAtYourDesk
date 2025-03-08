import ActionProvider from "./ActionProvider";
import MessageParser from "./MessageParser";

const handleSend = async (message) => {
  try {
    const response = await fetch('http://localhost:8080/api/service-issues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: message }),
    });
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error searching the database:', error);
    return [];
  }
};

const fetchInitialServices = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/service-issues');
    const data = await response.json();
    return data.map((service, index) => ({
      type: "bot",
      id: `${index + 1}`,
      message: service.service.description,
    }));
  } catch (error) {
    console.error('Error fetching initial services:', error);
    return [{
      type: "bot",
      id: "1",
      message: "Hi! How can I assist you today?",
    }];
  }
};

const initializeConfig = async () => {
  const initialMessages = await fetchInitialServices();
  console.log('initialMessages:', initialMessages);
  return {
    botName: "ServiceAtYourDesk :) 🤖",
    initialMessages,
    customStyles: {
      botMessageBox: {
        backgroundColor: "#007bff",
      },
      chatButton: {
        backgroundColor: "#007bff",
      },
    },
    actionProvider: ActionProvider,
    messageParser: MessageParser,
    handleSend, // Add handleSend to the config
  };
};

const config = await initializeConfig();

export default config;
