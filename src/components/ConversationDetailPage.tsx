import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Clock, CheckCircle2, Music, Pause, Square, File, FileText, PresentationIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JukeboxHeader from "./JukeboxHeader";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import MessageFile from "./File"

const MarkdownComponents = {
  h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-6 mb-4 text-red-400" {...props} />,
  h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mt-5 mb-3 text-red-300" {...props} />,
  h3: ({ node, ...props }) => <h3 className="text-xl font-medium mt-4 mb-2 text-red-200" {...props} />,
  h4: ({ node, ...props }) => <h4 className="text-lg font-medium mt-3 mb-2 text-red-100" {...props} />,
  h5: ({ node, ...props }) => <h5 className="text-base font-medium mt-2 mb-1 text-red-100" {...props} />,
  h6: ({ node, ...props }) => <h6 className="text-sm font-medium mt-2 mb-1 text-red-100" {...props} />,
  p: ({ node, ...props }) => <p className="mb-4 text-gray-200" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 text-gray-200" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 text-gray-200" {...props} />,
  li: ({ node, ...props }) => <li className="mb-1" {...props} />,
  a: ({ node, ...props }) => <a className="text-blue-400 hover:underline" {...props} />,
  blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-red-500 pl-4 italic my-4" {...props} />,
  code: ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter
        language={match[1]}
        style={oneDark}
        PreTag="div"
        className="rounded-md my-4"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className="bg-gray-700 rounded px-1 py-0.5 text-sm" {...props}>
        {children}
      </code>
    );
  },
};

const ChatMessage = ({ role, content, files }) => (
  <div className={`mb-4 ${role === 'assistant' ? 'flex justify-start' : 'flex justify-end'}`}>
    <div className={`max-w-3/4 opacity-75 rounded-lg px-4 py-2 ${
      role === 'assistant' ? 'bg-gray-900 text-white-100' : 'bg-zinc-600 text-white-100'
    }`}>
      <div>{content}</div>
      {files && files.length > 0 && (
        <div className="mt-2 border-t border-gray-700 pt-2">
          <p className="text-sm text-gray-400 mb-1">Attachments:</p>
          {files.map((file, index) => (
            <div key={index} className="flex items-center text-sm text-gray-300">
              <File className="w-4 h-4 mr-1" />
              <span>{file.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

const TimelineEvent = ({ time, event }) => (
  <div className="flex items-start mb-4">
    <Clock className="w-5 h-5 mr-2 mt-1 text-gray-400" />
    <div>
      <p className="font-semibold text-gray-200">{time}</p>
      <p className="text-gray-400">{event}</p>
    </div>
  </div>
);

const ExecutionStep = ({ step, description, status }) => (
  <div className="flex items-start mb-4">
    <div className={`w-6 h-6 rounded-full mr-2 flex items-center justify-center ${
      status === 'completed' ? 'bg-green-600' :
      status === 'in-progress' ? 'bg-blue-600' : 'bg-gray-600'
    }`}>
      {status === 'completed' && <CheckCircle2 className="w-4 h-4 text-gray-200" />}
      {status === 'in-progress' && <div className="w-2 h-2 bg-gray-200 rounded-full" />}
    </div>
    <div>
      <p className="font-semibold text-gray-200">Step {step}</p>
      <p className="text-gray-400">{description}</p>
    </div>
  </div>
);

const ArtifactItem = ({ type, name, icon: Icon }) => (
    <div className="flex items-center mb-4 p-2 bg-gray-700 rounded-lg">
      <Icon className="w-6 h-6 mr-3 text-gray-400" />
      <div>
        <p className="font-semibold text-gray-200">{name}</p>
        <p className="text-sm text-gray-400">{type}</p>
      </div>
    </div>
  );

interface ChatMessage {
  role: string;
  content: string;
  files?: MessageFile[];
}

const ConversationDetailPage = () => {
  const { id } = useParams();
  const [chatMessages, setChatMessages] = useState([] as ChatMessage[]);
  const [inputMessage, setInputMessage] = useState('');
  const [artifact, setArtifact] = useState("");

  const createNewMessage = async (message: string, files: MessageFile[], messages: ChatMessage[] = chatMessages) => {
    const messageCreationResponse = await fetch(`/api/v1/conversations/${id}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, files }),
    })

    if (!messageCreationResponse.ok) {
      const error = await messageCreationResponse.json();
      alert(error.message);
      return;
    }

    // Fetch message from stream
    const stream = messageCreationResponse.body;

    if (!stream) {
      return;
    }
      // Get the reader from the stream
    const reader = stream.getReader();
    const decoder = new TextDecoder();

    while(true) {
      const { done, value }  = await reader.read()

      if (done) {
        return;
      }

      const chunks = decoder.decode(value);

      const chunksArr = chunks.split('\r\n');
      
      chunksArr.forEach((chunk) => {
        if (!chunk.trim()) {
          return;
        }
        const chunkObj = JSON.parse(chunk);
        console.log(chunkObj)

        if (chunkObj["message"]) {
          setChatMessages([...messages, {
            role: "assistant",
            content: chunkObj["message"]
          }])
        }

        if (chunkObj["artifact"]) {
          setArtifact(chunkObj["artifact"]);
        }
      });
    }
  };

  useEffect(() => {
    const fetchConversations = async () => {
      const resp = await fetch(`/api/v1/conversations/${id}/messages`);

      if (!resp.ok) {
        const error = await resp.json();
        alert(error.message);
      }

      const data = await resp.json();
      if (data.length > 0) {
        console.log("setChatMessages", data)
        setChatMessages(data);
        setArtifact(data[data.length - 1].artifact);
        return;
      }

      // If no messages exist then start a conversation
      const conversation = await fetch(`/api/v1/conversations/${id}`);

      if (!conversation.ok) {
        const error = await conversation.json();
        alert(error.message);
        return;
      }

      const { goal, files } = await conversation.json();

      const messages = [{ role: 'user', content: goal }];
      setChatMessages(messages);

      await createNewMessage(goal, files, messages);
    }
    fetchConversations();
  }, [id])

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== '') {
      const messages = [...chatMessages, { role: 'user', content: inputMessage }];
      setChatMessages(messages);
      setInputMessage('');
      await createNewMessage(inputMessage, messages);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <JukeboxHeader />
      <div className="container mx-auto px-4 py-6">
        <div className="flex space-x-6 h-[calc(100vh-200px)]">
        <Card className="w-1/3 bg-gray-800 border-gray-700 flex flex-col">
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-gray-100">
                <span className='font-thin font-extralight text-gray-400'>CONVERSATION</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
              <ScrollArea className="h-full pr-4">
                {chatMessages.map((msg, index) => (
                  <ChatMessage key={index} role={msg.role} content={msg.content} files={msg.files} />
                ))}
              </ScrollArea>
            </CardContent>
            <CardFooter className="mt-auto">
              <div className="flex flex-col space-y-2 w-full">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                  className="bg-gray-700 text-gray-200 border-gray-600 focus:border-red-400 resize-none"
                  rows={3}
                />
                <Button onClick={handleSendMessage} className="bg-red-500 hover:bg-red-600 w-full">
                  <Send className="w-4 h-4 mr-2" />
                  SEND
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          <Card className="w-2/3 bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="font-thin font-extralight text-gray-400">ARTIFACT</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="artifact" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="artifact">PREVIEW</TabsTrigger>
                  <TabsTrigger value="source">SOURCE</TabsTrigger>
                </TabsList>
                <TabsContent value="artifact">
                  <ScrollArea className="h-[calc(100vh-350px)]">
                    <ReactMarkdown components={MarkdownComponents}>{artifact}</ReactMarkdown>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="source">
                  <ScrollArea className="h-[calc(100vh-350px)]">
                    <SyntaxHighlighter language="markdown" style={oneDark}>
                      { artifact }
                    </SyntaxHighlighter>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConversationDetailPage;