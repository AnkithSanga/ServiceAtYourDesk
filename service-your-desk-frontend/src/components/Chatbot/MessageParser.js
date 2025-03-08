import axios from "axios";

class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
    this.awaitingService = true;
    this.awaitingIssueSelection = false;
    this.serviceIssues = [];
  }

  async parse(message) {
    if (this.awaitingService) {
      this.awaitingService = false;
      await this.fetchServiceIssues(message);
    } else if (this.awaitingIssueSelection) {
      this.awaitingIssueSelection = false;
      await this.actionProvider.handleIssueSelection(message);
    }
  }

  fetchServiceIssues = async (serviceName) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/service-issues/issues/${serviceName}`);

      if (response.data.length > 0) {
        this.serviceIssues = response.data.map(issue => issue.issueName);

        const issueList = this.serviceIssues.map(issue => `• ${issue}`).join("\n");

        this.actionProvider.handleBotResponse(
          `Here are the issues for ${serviceName}:\n\n${issueList}\n\nPlease type the issue name to proceed.`
        );

        this.awaitingIssueSelection = true;
      } else {
        this.actionProvider.handleBotResponse("No issues found for this service. Please try another service.");
        this.awaitingService = true;
      }
    } catch (error) {
      console.error("Error fetching service issues:", error);
      this.actionProvider.handleBotResponse("Oops! Something went wrong.");
      this.awaitingService = true;
    }
  };
}

export default MessageParser;
