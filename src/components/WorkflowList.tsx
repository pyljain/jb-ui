import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Download } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import JukeboxHeader from "./JukeboxHeader";

const WorkflowList = () => {
  const navigate = useNavigate();

  // Mock data for demonstration
  const workflows = [
    { id: 1, name: "Image Classification", status: "RUNNING", goal: "Classify images into categories" },
    { id: 2, name: "Text Summarization", status: "COMPLETED", goal: "Generate concise summaries of long texts" },
    { id: 3, name: "Sentiment Analysis", status: "FAILED", goal: "Determine sentiment of customer reviews" },
    { id: 4, name: "Language Translation", status: "PENDING", goal: "Translate text between multiple languages" },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'running': return 'bg-blue-600';
      case 'completed': return 'bg-green-600';
      case 'failed': return 'bg-red-600';
      case 'pending': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  const handleDownload = (id) => {
    // Placeholder function for downloading artifacts
    alert(`Downloading artifacts for workflow ${id}`);
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      <JukeboxHeader />
      <div className="container mx-auto mt-20 px-4">
        <Card className="w-full bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">YOUR RUNS</CardTitle>
            <CardDescription className="text-gray-400">Manage and monitor your Jukebox runs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Search className="w-4 h-4 text-gray-400" />
              <Input placeholder="Search runs..." className="flex-grow bg-gray-700 text-white border-gray-600 focus:border-teal-500" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                  <tr>
                    <th scope="col" className="px-4 py-3">ID</th>
                    <th scope="col" className="px-4 py-3">Name</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                    <th scope="col" className="px-4 py-3">Goal</th>
                    <th scope="col" className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workflows.map((workflow) => (
                    <tr key={workflow.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700">
                      <td className="px-4 py-4 font-medium text-white whitespace-nowrap">{workflow.id}</td>
                      <td className="px-4 py-4">{workflow.name}</td>
                      <td className="px-4 py-4">
                        <Badge className={`${getStatusColor(workflow.status)} text-white opacity-75 rounded-sm`}>
                          {workflow.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 max-w-xs truncate text-base font-thin font-extralight">{workflow.goal}</td>
                      <td className="px-4 py-4">
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-gray-700 text-white hover:bg-red-500" onClick={() => navigate(`/workflow/${workflow.id}`)}>
                            VEIW DETAILS
                          </Button>
                          <Button size="sm" className="bg-gray-700 text-white hover:bg-red-400" onClick={() => handleDownload(workflow.id)}>
                            <Download className="w-4 h-4 mr-2" />
                            DOWNLOAD ARTIFACTS
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
      </div>
    </div>
  );
};

export default WorkflowList;