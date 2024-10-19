import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, Download, Plus, Upload } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import JukeboxHeader from "./JukeboxHeader";
import docxConvert from "./conversion/docx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { saveAs } from "file-saver";
import { getDocument } from 'pdfjs-dist/build/pdf';
import "../pdf.worker";
import File from "./File";

const ConversationList = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [goal, setGoal] = useState("");
  const [conversations, setConversations] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([] as File[]);

  useEffect(() => {

    const fetchConversations = async () => {
      const resp = await fetch('/api/v1/conversations');

      if (!resp.ok) {
        const error = await resp.json();
        alert(error.message);
      }

      const data = await resp.json();
      setConversations(data || []);
    }
    fetchConversations();
  }, []);

  const getGoal = async (id: string) : Promise<string> => {
    const conversation = await fetch(`/api/v1/conversations/${id}`);

    if (!conversation.ok) {
      const error = await conversation.json();
      alert(error.message);
      return "";
    }

    const { goal } = await conversation.json();

    return goal;
  }

  const handleDownload = async (id, format) => {
    // Placeholder function for downloading artifacts
    // alert(`Downloading artifacts for workflow ${id} in ${format} format`);

    const goal = await getGoal(id);

    const resp = await fetch(`/api/v1/conversations/${id}/messages`);

    if (!resp.ok) {
      const error = await resp.json();
      alert(error.message);
    }

    const data = await resp.json();
    if (data.length == 0) {
      alert('No artifacts found');
      return;
    }

    const artifact = data[data.length - 1].artifact;
    let blob: Blob | null = null;
    let extn: string = "md";

    if (format === 'docx') {
      blob = await docxConvert(artifact);
      extn = 'docx';
    } else if (format === 'markdown') {
      blob = new Blob([artifact], {type: "text/plain;charset=utf-8"})
      extn = 'md';
    }

    if (blob) {
      saveAs(blob, goal.replace(/ /g, '-').toLowerCase().substring(0, 40) + "." + extn);
    }

    setIsDownloadModalOpen(false);
  };

  const handleStartConversation = async () => {
    if (goal.trim()) {
      const resp = await fetch('/api/v1/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          goal,
          files: selectedFiles
        }),
      })

      if (!resp.ok) {
        const error = await resp.json();
        alert(error.message);
      }

      const data = await resp.json();
      navigate('/conversations/' + data.id);
    }
  };

  
  const extractTextFromPDF = async (pdfUrl) => {
    const pdf = await getDocument(pdfUrl).promise;
    let extractedText = '';

    // Iterate through all the pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      // Extract text from the page
      const pageText = textContent.items.map((item) => item.str).join(' ');
      extractedText += pageText + '\n';
    }

    return extractedText;
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const fileURL = URL.createObjectURL(file);
    const text = await extractTextFromPDF(fileURL);
    setSelectedFiles((selectedFiles) => [...selectedFiles, { name: file.name, contents: text }]);
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      <JukeboxHeader />
      <div className="container mx-auto mt-20 px-4">
        <div className="mb-6 bg-gradient-to-r from-red-500 to-red-400 rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Start a New Conversation</h2>
              <p className="text-teal-100">Begin your next workflow with our AI assistant</p>
            </div>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-red-700 hover:bg-red-100"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Conversation
            </Button>
          </div>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-gray-800 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Start New Conversation</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goal" className="text-sm font-medium text-gray-200">
                    What's your goal for this conversation?
                  </Label>
                  <Textarea
                    id="goal"
                    placeholder="e.g., Create a marketing plan for my new product..."
                    className="bg-gray-700 border-gray-600 text-white min-h-[100px] resize-none"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file-upload" className="text-sm font-medium text-gray-200">
                    Upload a file (optional)
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="file-upload"
                      type="file"
                      className="bg-gray-700 border-gray-600 text-white"
                      onChange={handleFileChange}
                    />
                    <Button
                      type="button"
                      className="bg-gray-700 hover:bg-gray-600"
                      onClick={() => document.getElementById('file-upload').click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                  {selectedFiles.map(selectedFile => <p className="text-sm text-gray-300">Selected file: {selectedFile.name}</p>)}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleStartConversation}
                className="bg-red-500 hover:bg-red-600 text-white"
                disabled={!goal.trim()}
              >
                Start Conversation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Card className="w-full bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">YOUR CONVERSATIONS</CardTitle>
            <CardDescription className="text-gray-400">Conversations you've had with the assistant</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Search className="w-4 h-4 text-gray-400" />
              <Input placeholder="Search conversations..." className="flex-grow bg-gray-700 text-white border-gray-600 focus:border-teal-500" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                  <tr>
                    <th scope="col" className="px-4 py-3">ID</th>
                    <th scope="col" className="px-4 py-3">Goal</th>
                    <th scope="col" className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {conversations.map((conversation) => (
                    <tr key={conversation.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700">
                      <td className="px-4 py-4 font-medium text-white whitespace-nowrap">{conversation.id}</td>
                      <td className="px-4 py-4 max-w-xs truncate text-base font-thin font-extralight">{conversation.goal}</td>
                      <td className="px-4 py-4">
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-gray-700 text-white hover:bg-red-500" onClick={() => navigate(`/conversations/${conversation.id}`)}>
                            VIEW DETAILS
                          </Button>
                          <Button size="sm" className="bg-gray-700 text-white hover:bg-red-400" 
                            onClick={() => {
                              setSelectedConversationId(conversation.id);
                              setIsDownloadModalOpen(true);
                            }}>
                            <Download className="w-4 h-4 mr-2" />
                            DOWNLOAD ARTIFACT
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isDownloadModalOpen} onOpenChange={setIsDownloadModalOpen}>
          <DialogContent className="bg-gray-800 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Download Options</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-gray-300 mb-4">Choose a format to download the artifact:</p>
              <div className="space-y-2">
                <Button 
                  className="w-full bg-gray-700 hover:bg-red-500 text-white"
                  onClick={() => handleDownload(selectedConversationId, 'docx')}
                >
                  Download as DOCX
                </Button>
                <Button 
                  className="w-full bg-gray-700 hover:bg-red-500 text-white"
                  onClick={() => handleDownload(selectedConversationId, 'pdf')}
                >
                  Download as PDF
                </Button>
                <Button 
                  className="w-full bg-gray-700 hover:bg-red-500 text-white"
                  onClick={() => handleDownload(selectedConversationId, 'markdown')}
                >
                  Download as Markdown
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setIsDownloadModalOpen(false)}
                className="text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ConversationList;