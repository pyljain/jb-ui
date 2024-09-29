import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Clock, CheckCircle2, Music, Pause, Square, File, FileText, PresentationIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JukeboxHeader from "./JukeboxHeader";
import { Textarea } from "@/components/ui/textarea";


const AI_CHAT_MESSAGES = [
  { role: 'ai', content: 'Hello! How can I assist you with your workflow today?' },
  { role: 'user', content: 'Can you explain what this workflow does?' },
  { role: 'ai', content: 'Certainly! This workflow is designed to analyze music tracks and generate playlist recommendations based on user preferences.' },
];

const TIMELINE_EVENTS = [
  { time: '10:00 AM', event: 'Workflow initiated' },
  { time: '10:05 AM', event: 'Data preprocessing completed' },
  { time: '10:15 AM', event: 'Model training started' },
  { time: '10:45 AM', event: 'Model training completed' },
  { time: '10:50 AM', event: 'Generating recommendations' },
];

const EXECUTION_PLAN = [
  { step: 1, description: 'Collect user music preferences', status: 'completed' },
  { step: 2, description: 'Analyze recent listening history', status: 'completed' },
  { step: 3, description: 'Generate initial playlist recommendations', status: 'in-progress' },
  { step: 4, description: 'Apply user feedback to refine recommendations', status: 'pending' },
  { step: 5, description: 'Finalize and present playlist', status: 'pending' },
];

const ARTIFACTS = [
    { type: 'document', name: 'Review Document', icon: File },
    { type: 'summary', name: 'Executive Summary', icon: FileText },
    { type: 'presentation', name: 'Project Presentation', icon: PresentationIcon },
];

const ChatMessage = ({ role, content }) => (
  <div className={`mb-4 ${role === 'ai' ? 'flex justify-start' : 'flex justify-end'}`}>
    <div className={`max-w-3/4 opacity-75 rounded-lg px-4 py-2 ${
      role === 'ai' ? 'bg-gray-900 text-white-100' : 'bg-zinc-600 text-white-100'
    }`}>
      {content}
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

const WorkflowDetailPage = () => {
  const [chatMessages, setChatMessages] = useState(AI_CHAT_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [isWorkflowRunning, setIsWorkflowRunning] = useState(true);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      setChatMessages([...chatMessages, { role: 'user', content: inputMessage }]);
      setInputMessage('');
      // Here you would typically send the message to your AI backend and wait for a response
      // For this example, we'll just simulate an AI response after a short delay
      setTimeout(() => {
        setChatMessages(prev => [...prev, { role: 'ai', content: 'I understand. How else can I assist you with the workflow?' }]);
      }, 1000);
    }
  };

  const handlePauseWorkflow = () => {
    setIsWorkflowRunning(false);
    // Add logic to pause the workflow
  };

  const handleStopWorkflow = () => {
    setIsWorkflowRunning(false);
    // Add logic to stop the workflow
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <JukeboxHeader />
      <div className="container mx-auto px-4 py-6">
        <div className="flex space-x-6 h-[calc(100vh-200px)]">
        <Card className="w-1/4 bg-gray-800 border-gray-700 flex flex-col">
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-gray-100">
                <span className='font-thin font-extralight text-gray-400'>CONVERSATION</span>
                <div className="space-x-2">
                  <Button 
                    size="sm" 
                    onClick={() => {/* handle pause */}}
                    disabled={!isWorkflowRunning}
                    className="bg-red-500 text-white-400 hover:bg-red-600"
                  >
                    <Pause className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => {/* handle stop */}}
                    disabled={!isWorkflowRunning}
                    className="bg-red-500 text-white-400 hover:bg-red-600"
                  >
                    <Square className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
              <ScrollArea className="h-full pr-4">
                {chatMessages.map((msg, index) => (
                  <ChatMessage key={index} role={msg.role} content={msg.content} />
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
          
          <Card className="w-1/2 bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="font-thin font-extralight text-gray-400">WORKFLOW DETAILS</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="timeline" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="timeline">TIMELINE</TabsTrigger>
                  <TabsTrigger value="artifacts">ARTIFACTS</TabsTrigger>
                </TabsList>
                <TabsContent value="timeline">
                  <ScrollArea className="h-[calc(100vh-350px)]">
                    {TIMELINE_EVENTS.map((event, index) => (
                      <TimelineEvent key={index} time={event.time} event={event.event} />
                    ))}
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="artifacts">
                  <ScrollArea className="h-[calc(100vh-350px)]">
                    {ARTIFACTS.map((artifact, index) => (
                      <ArtifactItem key={index} type={artifact.type} name={artifact.name} icon={artifact.icon} />
                    ))}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="w-1/4 bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="font-thin font-extralight text-gray-400">EXECUTION PLAN</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-full">
                {EXECUTION_PLAN.map((step, index) => (
                  <ExecutionStep key={index} step={step.step} description={step.description} status={step.status} />
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WorkflowDetailPage;