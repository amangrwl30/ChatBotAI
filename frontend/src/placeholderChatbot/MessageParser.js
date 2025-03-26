class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    console.log(message);
    // Input message is disabled, so this function will be empty
  }
}

export default MessageParser;