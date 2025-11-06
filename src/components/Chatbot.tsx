import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm your UniSphere assistant. How can I help you with your career journey today?", isBot: true }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      isBot: false
    };

    setMessages(prev => [...prev, newMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      const conversationMessages = messages.map(m => ({ 
        role: m.isBot ? 'assistant' : 'user', 
        content: m.text 
      }));
      
      conversationMessages.push({ role: 'user', content: currentInput });

      const { data, error } = await supabase.functions.invoke('chat', {
        body: { messages: conversationMessages }
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const botResponseText = data.choices[0].message.content;

      const botResponse = {
        id: Date.now() + 1,
        text: botResponseText,
        isBot: true
      };
      setMessages(prev => [...prev, botResponse]);

    } catch (error: any) {
      console.error("Error calling chat API:", error);
      const botResponse = {
        id: Date.now() + 1,
        text: `Sorry, I'm having trouble connecting right now. Please try again in a moment.`,
        isBot: true
      };
      setMessages(prev => [...prev, botResponse]);
      
      toast.error("Connection Error", {
        description: "Unable to reach the assistant. Please try again.",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleChatbot}
          className="bg-unisphere-blue hover:bg-unisphere-darkBlue text-white rounded-full w-14 h-14 shadow-lg"
          size="icon"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 h-[28rem]">
          <Card className="h-full flex flex-col shadow-xl">
            <CardHeader className="bg-unisphere-blue text-white rounded-t-lg">
              <CardTitle className="text-lg">UniSphere Assistant</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
              {/* Messages Area */}
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                          message.isBot
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-unisphere-blue text-white'
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                        <div className="flex items-center space-x-1">
                          <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                          <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                          <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={sendMessage}
                    size="icon"
                    className="bg-unisphere-blue hover:bg-unisphere-darkBlue text-white"
                    disabled={isTyping || !inputMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default Chatbot;
