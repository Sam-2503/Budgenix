import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import AgoraRTC from "agora-rtc-sdk-ng";

// Create Agora client instance
const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const VoiceAssistant = () => {
  const [agentId, setAgentId] = useState(null);
  const [status, setStatus] = useState("Ready to assist");
  const [loading, setLoading] = useState(false);
  const [micTrack, setMicTrack] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [currentChannel, setCurrentChannel] = useState(null);

  const APP_ID = import.meta.env.VITE_AGORA_APP_ID;
  const TOKEN = import.meta.env.VITE_AGORA_USER_TOKEN;
  const CHANNEL = "convai_nVwXMR";

  // Setup Agora client event handlers
  useEffect(() => {
    client.on("user-joined", (user) => {
      console.log("🟢 Remote user joined:", user.uid);
    });

    client.on("user-published", async (user, mediaType) => {
      console.log("📢 User published:", user.uid, "type:", mediaType);
      try {
        await client.subscribe(user, mediaType);
        console.log("✅ Subscribed to remote user:", user.uid);
        if (mediaType === "audio" && user.audioTrack) {
          const audioTrack = user.audioTrack;
          audioTrack.setVolume(100);
          audioTrack.play();
          console.log("🔊 Playing AI audio from:", user.uid);
        }
      } catch (err) {
        console.error("❌ Subscribe/Playback error:", err);
      }
    });

    client.on("user-unpublished", (user, mediaType) => {
      console.log("🔇 User unpublished:", user.uid, "type:", mediaType);
      if (mediaType === "audio") {
        user.audioTrack?.stop();
      }
    });

    client.on("user-left", (user) => {
      console.log("👋 Remote AI left:", user.uid);
    });

    client.on("volume-indicator", (volumes) => {
      const localVolume = volumes.find((v) => v.uid === "local");
      if (localVolume && localVolume.level > 0) {
        console.log("🎤 Mic volume:", localVolume.level);
      }
    });

    return () => {
      client.removeAllListeners();
    };
  }, []);

  const startAI = async () => {
    try {
      setLoading(true);
      setStatus("Connecting...");
      setCurrentChannel(CHANNEL);
      console.log("📡 Using channel:", CHANNEL);

      await client.join(APP_ID, CHANNEL, TOKEN, null);
      console.log("✅ Joined channel:", CHANNEL);

      const mic = await AgoraRTC.createMicrophoneAudioTrack({
        AEC: true,
        ANS: true,
        AGC: true,
      });
      setMicTrack(mic);
      await client.publish([mic]);
      console.log(
        "🎤 Mic published to channel with noise cancellation enabled"
      );

      setStatus("Starting AI...");
      const res = await axios.post(
        "http://localhost:3300/api/agora/start-ai",
        { channel: CHANNEL },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (res.data.agent_id) {
        setAgentId(res.data.agent_id);
        setStatus("AI Active");
        console.log("🤖 AI Agent Started:", res.data);
      } else {
        setStatus("Failed to start");
      }
    } catch (error) {
      console.error("❌ Start error:", error.message || error);
      setStatus("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const stopAI = async () => {
    try {
      setLoading(true);
      setStatus("Disconnecting...");

      if (agentId) {
        try {
          await axios.post(
            "http://localhost:3300/api/agora/stop-ai",
            { agent_id: agentId },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
          console.log("✅ AI agent stopped");
        } catch (apiError) {
          console.log(
            "⚠️ Agent stop API error (ignoring):",
            apiError.response?.data || apiError.message
          );
        }
      }

      if (micTrack) {
        micTrack.stop();
        micTrack.close();
      }

      if (client.connectionState !== "DISCONNECTED") {
        await client.leave();
        console.log("👋 Left Agora channel");
      }

      setAgentId(null);
      setCurrentChannel(null);
      setMicTrack(null);
      setStatus("Session ended");
    } catch (error) {
      console.error("❌ Stop error:", error.message || error);
      setStatus("Session ended");
      setAgentId(null);
      setCurrentChannel(null);
      setMicTrack(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleMute = () => {
    if (micTrack) {
      if (isMuted) {
        micTrack.setEnabled(true);
        setIsMuted(false);
        console.log("🎤 Mic unmuted");
      } else {
        micTrack.setEnabled(false);
        setIsMuted(true);
        console.log("🔇 Mic muted");
      }
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "assistant",
      content:
        "Hello! I'm your Budgenix FinBuddy. I can help you manage your finances, track expenses, and answer questions about your budget. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
          handleSendMessage(finalTranscript);
          stopListening();
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      setTranscript("");
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setTranscript("");
    setIsProcessing(true);
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = generateAIResponse(message);
      const assistantMessage = {
        id: Date.now() + 1,
        type: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsProcessing(false);
      setIsTyping(false);

      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(aiResponse);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
      }
    }, 1500);
  };

  const generateAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    if (message.includes("expense") || message.includes("spending")) {
      return "I can help you track your expenses! You can add new expenses, categorize them, and view your spending patterns. Would you like me to guide you through adding a new expense?";
    } else if (message.includes("budget")) {
      return "Let me help you with your budget! You can set monthly budgets for different categories, track your progress, and get alerts when you're approaching your limits. What would you like to know about your budget?";
    } else if (message.includes("report") || message.includes("analytics")) {
      return "I can show you detailed analytics about your spending! You can view charts, compare months, and see where your money goes. Would you like me to explain any specific metric?";
    } else if (message.includes("hello") || message.includes("hi")) {
      return "Hello! I'm here to help you manage your finances better. You can ask me about expenses, budgets, analytics, or any financial questions you have.";
    } else if (message.includes("help")) {
      return "I can assist you with: 📊 Tracking expenses, 💰 Managing budgets, 📈 Viewing analytics, 🎯 Setting financial goals, 💡 Financial tips and advice. What would you like help with?";
    } else {
      return "That's an interesting question! While I'm focused on helping with financial management, I can assist you with budgeting, expense tracking, and financial analytics. Is there something specific about your finances you'd like help with?";
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center z-50 group hover:scale-110"
        aria-label="Open AI Assistant"
      >
        <svg
          className="w-7 h-7 group-hover:scale-110 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
        {agentId && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl h-[600px] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-black"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                        />
                      </svg>
                    </div>
                    {agentId && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-zinc-900 animate-pulse" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      FinBuddy AI
                    </h2>
                    <p className="text-sm text-zinc-400">{status}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!agentId ? (
                    <button
                      onClick={startAI}
                      disabled={loading}
                      className="px-6 py-2 bg-white hover:bg-zinc-100 disabled:bg-zinc-700 text-black disabled:text-zinc-400 rounded-lg text-sm font-medium transition-all disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Starting...
                        </span>
                      ) : (
                        "Start Voice AI"
                      )}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={toggleMute}
                        className={`p-2 rounded-lg transition-all ${
                          isMuted
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white"
                        }`}
                        title={isMuted ? "Unmute" : "Mute"}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {isMuted ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                            />
                          )}
                        </svg>
                      </button>
                      <button
                        onClick={stopAI}
                        disabled={loading}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-all disabled:cursor-not-allowed"
                      >
                        {loading ? "Stopping..." : "End Session"}
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => {
                      setIsOpen(false);
                      if ("speechSynthesis" in window) {
                        window.speechSynthesis.cancel();
                      }
                    }}
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center transition-colors border border-zinc-700"
                  >
                    <svg
                      className="w-5 h-5 text-zinc-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex items-center justify-center p-8 bg-black">
              {agentId ? (
                // Voice AI Active - Show animated circle
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative">
                    {/* Outer pulsing rings */}
                    <div
                      className="absolute inset-0 rounded-full bg-white/10 animate-ping"
                      style={{ animationDuration: "2s" }}
                    ></div>
                    <div
                      className="absolute -inset-4 rounded-full bg-white/5 animate-pulse"
                      style={{ animationDuration: "3s" }}
                    ></div>

                    {/* Main circle */}
                    <div className="relative w-48 h-48 rounded-full bg-white flex items-center justify-center shadow-2xl shadow-white/20">
                      <svg
                        className="w-24 h-24 text-black"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <p className="text-white text-lg font-medium">
                      Listening...
                    </p>
                    <p className="text-zinc-400 text-sm">
                      Speak naturally about your finances
                    </p>
                  </div>

                  {/* Audio waveform visualization */}
                  <div className="flex items-center gap-1 h-12">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-white rounded-full animate-pulse"
                        style={{
                          height: `${Math.random() * 40 + 20}px`,
                          animationDelay: `${i * 0.1}s`,
                          animationDuration: "0.8s",
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              ) : (
                // Text Chat Mode
                <div className="w-full h-full flex flex-col">
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.type === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] rounded-xl px-4 py-3 ${
                            message.type === "user"
                              ? "bg-white text-black"
                              : "bg-zinc-800 text-zinc-100 border border-zinc-700"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.type === "user"
                                ? "text-zinc-600"
                                : "text-zinc-500"
                            }`}
                          >
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area for Text Chat */}
                  <div className="p-4 border-t border-zinc-800">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage(transcript)
                        }
                        placeholder="Type your message..."
                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                      />
                      <button
                        onClick={() => handleSendMessage(transcript)}
                        disabled={!transcript.trim() || isProcessing}
                        className="px-4 py-2 bg-white hover:bg-zinc-100 disabled:bg-zinc-700 text-black disabled:text-zinc-400 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceAssistant;
