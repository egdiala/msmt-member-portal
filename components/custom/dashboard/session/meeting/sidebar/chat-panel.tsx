
import { Send } from "lucide-react";
import useMediaStream from "@/hooks/use-media-stream";
import React, { useEffect, useRef, useState } from "react";
import { formatAMPM, nameTructed, json_verify } from "@/lib/utils";

// Types for Chat Message
interface ChatMessageProps {
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

// ChatMessage Component
const ChatMessage: React.FC<ChatMessageProps> = ({
  senderId,
  senderName,
  text,
  timestamp,
}) => {
  const { videoSDK } = useMediaStream();
  const mMeeting = videoSDK?.useMeeting();
  const localParticipantId = mMeeting?.localParticipant?.id;
  const localSender = localParticipantId === senderId;

  return (
    <div
      className={`flex ${localSender ? "justify-end" : "justify-start"} mt-4`}
      style={{ maxWidth: "100%" }}
    >
      <div
        className={`flex ${
          localSender ? "items-end" : "items-start"
        } flex-col py-1 px-2 rounded-md bg-gray-700`}
      >
        <p style={{ color: "#ffffff80" }}>
          {localSender ? "You" : nameTructed(senderName, 15)}
        </p>
        <div>
          <p className="inline-block whitespace-pre-wrap break-words text-right text-white">
            {text}
          </p>
        </div>
        <div className="mt-1">
          <p className="text-xs italic" style={{ color: "#ffffff80" }}>
            {formatAMPM(new Date(timestamp))}
          </p>
        </div>
      </div>
    </div>
  );
};

// Types for ChatInput
interface ChatInputProps {
  inputHeight: number;
}

// ChatInput Component
const ChatInput: React.FC<ChatInputProps> = ({ inputHeight }) => {
  const [message, setMessage] = useState<string>("");
  const { videoSDK } = useMediaStream();
  const pub = videoSDK?.usePubSub("CHAT");
  const publish = pub?.publish;
  const input = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    const messageText = message.trim();
    if (messageText.length > 0) {
      publish?.(messageText, { persist: true });
      setTimeout(() => {
        setMessage("");
      }, 100);
      input.current?.focus();
    }
  };

  return (
    <div
      className="w-full flex items-center px-2"
      style={{ height: inputHeight }}
    >
      <div className="relative w-full">
        <span className="absolute inset-y-0 right-0 flex mr-2 rotate-90">
          <button
            disabled={message.length < 2}
            type="submit"
            className="p-1 focus:outline-none focus:shadow-outline"
            onClick={handleSendMessage}
          >
            <Send
              className={`w-6 h-6 ${
                message.length < 2 ? "text-gray-500" : "text-white"
              }`}
            />
          </button>
        </span>
        <input
          type="text"
          className="py-4 text-base text-white border-gray-400 border bg-gray-750 rounded pr-10 pl-2 focus:outline-none w-full"
          placeholder="Write your message"
          autoComplete="off"
          ref={input}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
      </div>
    </div>
  );
};

// Types for ChatMessages
interface ChatMessagesProps {
  listHeight: number;
}

// Define the shape of each chat message from pubsub
interface PubSubMessage {
  senderId: string;
  senderName: string;
  message: string;
  timestamp: number;
}

// ChatMessages Component
const ChatMessages: React.FC<ChatMessagesProps> = ({ listHeight }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const { videoSDK } = useMediaStream();
  const pub = videoSDK?.usePubSub("CHAT");
  const messages = pub?.messages;

  const scrollToBottom = (data?: { text: string }) => {
    if (!data) {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    } else {
      const { text } = data;
      if (json_verify(text)) {
        const { type } = JSON.parse(text);
        if (type === "CHAT") {
          if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
          }
        }
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return messages ? (
    <div ref={listRef} style={{ overflowY: "scroll", height: listHeight }}>
      <div className="p-4">
        {messages.map((msg, i) => (
          <ChatMessage
            key={`chat_item_${i}`}
            senderId={msg.senderId}
            senderName={msg.senderName}
            text={msg.message}
            timestamp={msg.timestamp}
          />
        ))}
      </div>
    </div>
  ) : (
    <p>No messages</p>
  );
};

// Types for ChatPanel
interface ChatPanelProps {
  panelHeight: number;
}

// ChatPanel Component
export const ChatPanel: React.FC<ChatPanelProps> = ({ panelHeight }) => {
  const inputHeight = 72;
  const listHeight = panelHeight - inputHeight;

  return (
    <div>
      <ChatMessages listHeight={listHeight} />
      <ChatInput inputHeight={inputHeight} />
    </div>
  );
};
