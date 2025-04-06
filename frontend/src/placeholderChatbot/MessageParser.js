class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    const timestamp = new Date().toLocaleString('en-US', {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    this.actionProvider.handleUserMessage(message, timestamp);
  }
}

export default MessageParser;