
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Check, Paperclip, Send } from 'lucide-react';
import { useIncidents } from '@/context/IncidentContext';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const IncidentReview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getIncidentById, updateIncidentReport, updateIncidentStatus } = useIncidents();
  
  const incident = getIncidentById(id!);
  const [feedback, setFeedback] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [showAttachment, setShowAttachment] = useState<string | null>(null);

  if (!incident) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Incident Not Found</h1>
        <p className="mb-6">The incident report you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/')}>Return to Incidents</Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const handleSendFeedback = () => {
    if (!feedback.trim()) return;
    
    // Add user message to chat history
    setChatHistory(prev => [...prev, { role: 'user', content: feedback }]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = `I've updated the report based on your request: "${feedback}"`;
      setChatHistory(prev => [...prev, { role: 'ai', content: aiResponse }]);
      
      // Update the report with the feedback
      updateIncidentReport(id!, `${incident.investigation}\n\nUpdate (${new Date().toLocaleTimeString()}): ${feedback}`);
      
      // Clear the feedback input
      setFeedback('');
    }, 1000);
  };

  const handleComplete = () => {
    updateIncidentStatus(id!, 'done');
    
    toast({
      title: "Report Completed",
      description: "The incident report has been marked as done."
    });
    
    navigate('/');
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Incident Report Review</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Incident Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Incident Details</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Date of Incident</p>
              <p className="font-medium">{formatDate(incident.date)}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Airline</p>
              <p className="font-medium">{incident.airline}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Departure</p>
                <p className="font-medium">{incident.departureAirport}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Arrival</p>
                <p className="font-medium">{incident.arrivingAirport}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Incident Description</p>
              <p className="mt-1">{incident.incident}</p>
            </div>

            {incident.attachments.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Attachments</p>
                <div className="space-y-2">
                  {incident.attachments.map((attachment) => (
                    <div 
                      key={attachment.id} 
                      className="flex items-center p-2 bg-muted rounded-md cursor-pointer hover:bg-muted/80"
                      onClick={() => setShowAttachment(attachment.url)}
                    >
                      <Paperclip className="h-4 w-4 mr-2" />
                      <span className="text-sm">{attachment.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Middle Column - Report Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Generated Report</h2>
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-line">{incident.investigation}</p>
          </div>
        </div>

        {/* Right Column - AI Chat */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
          
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {chatHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Ask the AI to help improve your report or make changes to the content.</p>
              </div>
            ) : (
              chatHistory.map((message, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-primary/10 ml-4' 
                      : 'bg-muted mr-4'
                  }`}
                >
                  <p className="text-sm">
                    {message.content}
                  </p>
                </div>
              ))
            )}
          </div>
          
          <div className="flex gap-2">
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Type your feedback or questions here..."
              className="min-h-[80px] resize-none"
            />
            <Button 
              className="self-end" 
              size="icon" 
              onClick={handleSendFeedback}
              disabled={!feedback.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <Button 
            className="mt-4 w-full" 
            onClick={handleComplete}
          >
            <Check className="mr-2 h-4 w-4" />
            Mark as Done
          </Button>
        </div>
      </div>

      {/* Attachment Preview Dialog */}
      <Dialog open={!!showAttachment} onOpenChange={() => setShowAttachment(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Attachment Preview</DialogTitle>
          </DialogHeader>
          {showAttachment && (
            showAttachment.includes('pdf') ? (
              <div className="h-[70vh]">
                <iframe 
                  src={showAttachment} 
                  className="w-full h-full" 
                  title="PDF Preview"
                />
              </div>
            ) : (
              <div className="flex justify-center">
                <img 
                  src={showAttachment} 
                  alt="Attachment" 
                  className="max-h-[70vh] object-contain"
                />
              </div>
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IncidentReview;
