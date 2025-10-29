import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Phone, Mail, HelpCircle } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

const DashboardSupport = () => {
  const [message, setMessage] = useState("");

  const chatHistory = [
    {
      sender: "support",
      message: "Hi! How can I help you today?",
      time: "10:30 AM",
    },
    {
      sender: "user",
      message: "I need help with my Studienbeihilfe application",
      time: "10:32 AM",
    },
    {
      sender: "support",
      message: "I'd be happy to help! Can you tell me which document you're having trouble with?",
      time: "10:33 AM",
    },
    {
      sender: "user",
      message: "I'm not sure what income proof documents I need",
      time: "10:35 AM",
    },
  ];

  const quickActions = [
    {
      icon: Phone,
      title: "Schedule Call",
      description: "Book a time to speak with an expert",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed question",
    },
    {
      icon: HelpCircle,
      title: "FAQ",
      description: "Browse common questions",
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      toast.success("Message sent!");
      setMessage("");
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-muted/30">
      <DashboardSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-foreground">Chat & Support</h1>
            <p className="text-muted-foreground">
              Get instant help from our support team and AI assistant
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            {quickActions.map((action, index) => (
              <Card key={index} className="border-2 transition-smooth hover:border-primary cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                    <action.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Live Chat */}
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="border-2">
                <CardHeader className="border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <MessageCircle className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">Support Team</CardTitle>
                        <p className="text-xs text-green-500">● Online</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      End Chat
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  {/* Chat Messages */}
                  <div className="h-[500px] space-y-4 overflow-y-auto p-6">
                    {chatHistory.map((chat, index) => (
                      <div
                        key={index}
                        className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-3 ${
                            chat.sender === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          <p className="text-sm">{chat.message}</p>
                          <p
                            className={`mt-1 text-xs ${
                              chat.sender === "user"
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            }`}
                          >
                            {chat.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="border-t border-border p-4">
                    <div className="flex gap-2">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      />
                      <Button onClick={handleSendMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Phone className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">Phone</p>
                      <p className="text-sm text-muted-foreground">+43 123 456 789</p>
                      <p className="text-xs text-muted-foreground">Mon-Fri, 9:00 - 18:00</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">Email</p>
                      <p className="text-sm text-muted-foreground">support@care4students.at</p>
                      <p className="text-xs text-muted-foreground">Response within 24h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Support Hours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span className="font-semibold text-foreground">9:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="font-semibold text-foreground">10:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="font-semibold text-foreground">Closed</span>
                  </div>
                  <div className="mt-4 rounded-lg bg-primary/10 p-3">
                    <p className="text-xs text-foreground">
                      💬 AI assistant available 24/7 for instant answers
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardSupport;
