import {
  MessageProcessorReducer,
  createMessageReducer,
  messageProcesserReducers,
} from "../lib/message-processor";

export function getProcessors(): Record<string, MessageProcessorReducer> {
  return {
    ...messageProcesserReducers,
    customProcessor: createMessageReducer(
      (message) => message.Body.messageType === "SHOULD_SKIP",
      (message) => message.Body.messageType === "SHOULD_DELETE",
      (message) => {
        return {
          ...message,
          Body: { ...message.Body, modified: true },
        };
      },
    ),
  };
}
