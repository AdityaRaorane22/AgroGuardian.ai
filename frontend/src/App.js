import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Camera,
  MessageCircle,
  CloudSun,
  Activity,
  AlertTriangle,
  TrendingUp,
  Leaf,
  Send,
  Trash2,
  MapPin,
} from "lucide-react";

import "./styles.css";

const API_BASE_URL = "http://localhost:5000/api";

// Renamed component to 'App' as required by the instructions
export default function App() {
  const [activeTab, setActiveTab] = useState("scan");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [city, setCity] = useState("Thane");
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);
  // State for replacing forbidden alert() calls
  const [errorMessage, setErrorMessage] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Scroll to the latest message
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-clear error message after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);
  
useEffect(() => {
  if (activeTab === "chat" && city) {
    fetch(`${API_BASE_URL}/weather?city=${city}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.current) {
          setAnalysis(prev => ({
            ...prev,
            weather: { current: data.current }
          }));
        }
      })
      .catch(err => console.error("Weather fetch error:", err));
  }
}, [activeTab, city]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadedImage(ev.target.result);
        setSelectedFile(file);
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedFile) {
      setErrorMessage("Please upload an image before analyzing.");
      return;
    }

    setAnalyzing(true);
    setErrorMessage(null); // Clear previous errors

    try {
      const formData = new FormData();

      // Prefer the original File object (most reliable)
      if (selectedFile) {
        formData.append("image", selectedFile, selectedFile.name);
      } else {
        // fallback: convert data URL to blob (keeps backward compatibility)
        const response = await fetch(uploadedImage);
        const blob = await response.blob();
        formData.append("image", blob, "plant.jpg");
      }

      formData.append("city", city);

      const result = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        body: formData,
      });

      // handle non-JSON responses safely
      const contentType = result.headers.get("Content-Type") || "";
      let data;
      if (contentType.includes("application/json")) {
        data = await result.json();
      } else {
        const txt = await result.text();
        throw new Error(
          `Unexpected response from server: ${result.status} ${txt}`
        );
      }

      if (data.success) {
        setAnalysis(data);
        setActiveTab("results");
      } else {
        setErrorMessage("Analysis failed: " + (data.error || "Unknown error."));
      }
    } catch (error) {
      setErrorMessage(
        "Connection Error: " +
          (error.message ||
            "Failed to reach the backend API at " + API_BASE_URL)
      );
      console.error("Analyze error:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || sending) return;

    const userMessage = { role: "user", content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setSending(true);

    try {
      const context = analysis
        ? {
            disease_detection: analysis.disease,
            weather_current: analysis.weather?.current,
            risk_analysis: analysis.risk,
          }
        : {};

      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId: "web-session",
          context,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Sorry, I encountered an error during chat processing. Please try again.",
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Connection error. Please check if the backend is running.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    // API call to clear history on the backend
    fetch(`${API_BASE_URL}/chat/clear`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: "web-session" }),
    }).catch((e) => console.error("Failed to clear backend chat history:", e));
  };

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-50";
      case "moderate":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getOutlookColor = (outlook) => {
    switch (outlook?.toLowerCase()) {
      case "critical":
        return "text-red-600";
      case "concerning":
        return "text-orange-600";
      case "stable":
        return "text-blue-600";
      case "excellent":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="app-root">
      {/* --- Error Notification (Replaces alert()) --- */}
      {errorMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 p-4 w-full max-w-sm rounded-xl shadow-2xl bg-red-100 border-l-4 border-red-500 flex items-center justify-between transition-all duration-300 transform animate-slideIn">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
          <p className="text-red-700 text-sm font-medium flex-grow">
            {errorMessage}
          </p>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-500 hover:text-red-700 ml-4 font-bold text-lg leading-none"
          >
            &times;
          </button>
        </div>
      )}

      {/* Tailwind CSS for the toast animation */}
      <style>
        {`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideIn {
            from { opacity: 0; transform: translate(-50%, -50px); }
            to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-slideIn {
            animation: slideIn 0.3s ease-out forwards;
        }
        `}
      </style>

      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-title">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Leaf className="icon-leaf" />
              <div>
                <h1>AgroScan AI</h1>
                <p className="header-sub">
                  Agricultural Disease Detection & Advisory
                </p>
              </div>
            </div>
          </div>
          <div className="city-pill">
            <MapPin />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
            />
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: "scan", label: "Scan Plant", icon: Camera },
              { id: "results", label: "Results", icon: Activity },
              { id: "chat", label: "AI Assistant", icon: MessageCircle },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-600 hover:text-green-600"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">
                  {tab.id === "scan"
                    ? "Scan"
                    : tab.id === "results"
                    ? "Data"
                    : "Chat"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Scan Tab */}
        {activeTab === "scan" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Camera className="w-6 h-6 text-green-600" />
                Upload Plant Image
              </h2>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-3 border-dashed border-green-300 rounded-xl p-8 sm:p-12 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all"
              >
                {uploadedImage ? (
                  <div className="space-y-4">
                    <img
                      src={uploadedImage}
                      alt="Uploaded plant"
                      className="max-h-64 w-auto mx-auto rounded-lg shadow-md object-contain"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedImage(null);
                        setSelectedFile(null); // REQUIRED FIX
                      }}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-16 h-16 mx-auto text-green-600" />
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        Click to upload plant image
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        JPG, PNG up to 16MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {uploadedImage && (
                <button
                  onClick={analyzeImage}
                  disabled={analyzing}
                  className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {analyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Activity className="w-5 h-5" />
                      Analyze Plant
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results Tab */}
{activeTab === "results" && (
  <div className="max-w-6xl mx-auto">
    {!analysis ? (
      <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
        <Activity className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 text-lg">
          No analysis yet. Upload and scan a plant image first.
        </p>
      </div>
    ) : (
      <>
        {/* 🌿 GRID LAYOUT FOR RESULTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 🔹 CARD 1: Disease Detection */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Leaf className="w-6 h-6 text-green-600" />
              Disease Detection
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Plant Type</p>
                <p className="text-2xl font-bold">{analysis.disease.plant}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Disease Detected</p>
                <p
                  className={`text-2xl font-bold ${
                    analysis.disease.is_healthy
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {analysis.disease.disease}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Confidence</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full"
                      style={{ width: `${analysis.disease.confidence}%` }}
                    />
                  </div>
                  <span className="font-bold">
                    {analysis.disease.confidence}%
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    analysis.disease.is_healthy
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {analysis.disease.is_healthy ? "✓ Healthy" : "⚠ Disease Present"}
                </span>
              </div>
            </div>
          </div>

          {/* 🔹 CARD 2: Weather */}
          {analysis.weather?.current && (
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CloudSun className="w-6 h-6" />
                Current Weather – {analysis.weather.current.city}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-blue-100 text-sm">Temperature</p>
                  <p className="text-3xl font-bold">
                    {analysis.weather.current.temperature}°C
                  </p>
                </div>

                <div>
                  <p className="text-blue-100 text-sm">Humidity</p>
                  <p className="text-3xl font-bold">
                    {analysis.weather.current.humidity}%
                  </p>
                </div>

                <div>
                  <p className="text-blue-100 text-sm">Wind Speed</p>
                  <p className="text-3xl font-bold">
                    {analysis.weather.current.wind_speed} m/s
                  </p>
                </div>

                <div>
                  <p className="text-blue-100 text-sm">Condition</p>
                  <p className="text-lg font-medium">
                    {analysis.weather.current.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECOND ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          
          {/* 🔹 CARD 3: Disease Risk */}
          {analysis.risk && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
                Disease Risk Analysis
              </h3>

              <div className="space-y-4">
                <div
                  className={`p-4 rounded-lg ${getRiskColor(
                    analysis.risk.risk
                  )}`}
                >
                  <p className="font-bold text-lg">
                    Risk Level: {analysis.risk.risk.toUpperCase()}
                  </p>
                  <p>{analysis.risk.message}</p>
                </div>

                <div>
                  <p className="font-semibold">Risk Factors:</p>
                  <ul className="list-none space-y-1">
                    {analysis.risk.factors?.map((factor, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-red-500">•</span>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 🔹 CARD 4: Survival Analysis */}
          {analysis.survival && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                Plant Survival Outlook
              </h3>

              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-blue-50">
                    <p className="text-sm text-gray-600">Estimated Safe Days</p>
                    <p className="text-4xl font-bold text-blue-600">
                      {analysis.survival.survival_days}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-purple-50">
                    <p className="text-sm text-gray-600">Outlook</p>
                    <p
                      className={`text-3xl font-bold ${getOutlookColor(
                        analysis.survival.outlook
                      )}`}
                    >
                      {analysis.survival.outlook.toUpperCase()}
                    </p>
                  </div>
                </div>

                <p className="bg-gray-50 p-4 rounded-lg">
                  {analysis.survival.message}
                </p>

                <div>
                  <p className="font-semibold mb-2">Recommendations:</p>
                  <ul className="space-y-2">
                    {analysis.survival.recommendation?.map((rec, i) => (
                      <li
                        key={i}
                        className="flex gap-2 p-2 bg-green-50 rounded-lg"
                      >
                        <span className="text-green-600">✓</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    )}
  </div>
)}

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[600px] max-h-[80vh]">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-6 h-6" />
                  <h3 className="text-xl font-bold">AI Farm Assistant</h3>
                </div>
                <button
                  onClick={clearChat}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Clear chat"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-12">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg">Ask me anything about your crops!</p>
                    <p className="text-sm mt-2">
                      I can help with disease management, treatment advice, and
                      farming tips.
                    </p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl shadow-md ${
                          msg.role === "user"
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-br-none"
                            : "bg-gray-100 text-gray-800 rounded-tl-none"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))
                )}
                {sending && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] p-4 rounded-2xl bg-gray-100 text-gray-800 rounded-tl-none flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-gray-600">
                        AgroScan AI is thinking...
                      </span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 border-t bg-gray-50 flex-shrink-0">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && !sending && sendMessage()
                    }
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={sending}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sending || !inputMessage.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    {sending ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
