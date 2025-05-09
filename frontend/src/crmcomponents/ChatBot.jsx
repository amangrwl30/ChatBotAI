"use client"

import React, { useState, useEffect, useRef, useContext } from "react"
// import 'tailwindcss/tailwind.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faMoon,
  faSun,
  faPaperclip,
  faMicrophone,
  faPaperPlane,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons"
import { library } from "@fortawesome/fontawesome-svg-core"
import BotAvatar from "../assets/robot-norby.png"
// import UserAvatar from "../assets/user.jpg";
import { format } from "date-fns"
import { AppContext } from "../context/AppContext"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import notificationBeep from "../assets/sounds/notificationbeep.mp3"

library.add(faMoon, faSun, faPaperclip, faMicrophone, faPaperPlane, faExternalLinkAlt)

const loadingMessages = [
  "Thinking",
  "Analyzing your question",
  "Processing information",
  "Searching relevant data",
  "Formulating response",
]

const ChatBot = ({ website }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const formattedWebsite = website.startsWith("http") ? website : `https://${website}`
  const { sharedState, setSharedState } = useContext(AppContext)
  const [userInfo, setUserInfo] = useState({ name: "", phoneNumber: "" })
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  const handleChangeName = (e) => {
    setUserInfo((prev) => ({ ...prev, name: e.target.value }))
  }
  const handleChangePhoneNumber = (e) => {
    setUserInfo((prev) => ({ ...prev, phoneNumber: +e.target.value }))
  }

  const submitUserInfo = async () => {
    const response = await fetch(import.meta.env.VITE_API_BASE_URL_LLM_CHATBOT + "/submitUserInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    })
  }

  const [messages, setMessages] = useState([
    {
      content: (
        <>
          Hello! I'm your AI assistant for{" "}
          <a href={formattedWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            {formattedWebsite}
          </a>
          . How can I help you today?
        </>
      ),
      isUser: false,
    },
  ])

  const [messageInput, setMessageInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentWebsite, setCurrentWebsite] = useState(website)
  const [newWebsite, setNewWebsite] = useState(website)
  const [isEditingWebsite, setIsEditingWebsite] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isUpdatingWebsite, setIsUpdatingWebsite] = useState(false)
  const messagesEndRef = useRef(null)
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme)
  }

  const isValidWebsite = (url) => {
    const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
    return pattern.test(url)
  }

  const notificationSound = new Audio(notificationBeep)

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const userMessage = messageInput.trim()
      const timestamp = format(new Date(), "EEE hh:mm a")

      setMessages([...messages, { content: userMessage, isUser: true, timestamp }])
      setMessageInput("")
      try {
        notificationSound.play().catch(console.error)
      } catch (error) {
        console.error("Error playing sound:", error)
      }
      fetchBotResponse(userMessage)
    }
  }

  const fetchBotResponse = async (userMessage) => {
    setIsLoading(true)
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL_LLM_CHATBOT + "/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: userMessage,
          website: currentWebsite,
          use_site_operator: true,
        }),
      })

      const data = await response.json()
      const timestamp = format(new Date(), "EEE hh:mm a")
      const botMessage = {
        content: data.answer,
        links: data.links,
        isUser: false,
        timestamp,
      }

      setMessages((prevMessages) => [...prevMessages, botMessage])
      try {
        notificationSound.play().catch(console.error)
      } catch (error) {
        console.error("Error playing sound:", error)
      }
    } catch (error) {
      console.error("Error fetching bot response:", error)
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: "Error fetching response from server.", isUser: false },
      ])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isLoading])

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  useEffect(() => {
    let interval
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length)
      }, 3000) // Change message every 3 seconds
    }
    return () => clearInterval(interval)
  }, [isLoading])

  const handleWebsiteChange = async (e) => {
    e.preventDefault()
    if (isValidWebsite(newWebsite)) {
      setIsUpdatingWebsite(true)
      try {
        // Update the current website
        setCurrentWebsite(newWebsite)

        // Reset messages with new website
        setMessages([
          {
            content: (
              <p>
                Hello! I'm your AI assistant for{" "}
                <a
                  href={`${newWebsite.startsWith("http") ? newWebsite : `https://${newWebsite}`}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {newWebsite}
                </a>
                . How can I help you today?
              </p>
            ),
            isUser: false,
          },
        ])

        // Reset the form
        setIsEditingWebsite(false)
        setErrorMessage("")
      } catch (error) {
        console.error("Error updating website:", error)
        setErrorMessage("Failed to update website. Please try again.")
      } finally {
        setIsUpdatingWebsite(false)
      }
    } else {
      setErrorMessage("Please enter a valid website URL.")
    }
  }

  return (
<div className="min-h-screen w-full transition-all flex justify-center items-center p-4 overflow-x-hidden overflow-y-auto max-h-screen">
{isUpdatingWebsite ? (
        <LoadingSpinner />
      ) : (
        <div className="container mx-auto flex flex-col lg:flex-row gap-6 lg:gap-12 xl:gap-24 animate-slideIn max-h-[90vh] lg:max-h-[85vh]">
          {/* Side Form */}
          <div className={`${isDarkTheme ? 'bg-gray-800' : 'bg-white'} 
               border ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'} 
               rounded-2xl w-full lg:w-1/3 lg:max-h-[85vh] 
               order-2 lg:order-1 flex flex-col transition-colors duration-200`}>
            {/* Header */}
            <div className={`${isDarkTheme ? 'bg-gray-700' : 'bg-gray-100'} 
                 p-6 rounded-t-lg flex-shrink-0 transition-colors duration-200`}>
              <p className={`${isDarkTheme ? 'text-gray-200' : 'text-gray-700'} text-lg mb-4`}>
                Your bot can answer questions on <span className="text-blue-500 font-semibold">{currentWebsite}</span>
              </p>
              <button
                className={`w-full ${isDarkTheme ? 'bg-gray-800 text-blue-400 hover:bg-gray-900' : 'bg-white text-blue-600 hover:bg-gray-50'} 
                     text-base font-medium flex items-center justify-center p-4 rounded-lg 
                     transition-colors shadow-sm`}
                onClick={() => setIsEditingWebsite(!isEditingWebsite)}
              >
                <span className="mr-3 text-xl">✏️</span> Change URL
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className={`p-4 space-y-4 ${isDarkTheme ? 'text-gray-100' : 'text-gray-900'} 
                   transition-colors duration-200`}>
                {isEditingWebsite && (
                  <form onSubmit={handleWebsiteChange} className="mb-4">
                    <input
                      type="text"
                      value={newWebsite}
                      onChange={(e) => setNewWebsite(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-base focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 transition-all"
                      placeholder="Enter website URL"
                    />
                    {errorMessage && <p className="text-red-500 text-sm font-medium">{errorMessage}</p>}
                    <button
                      type="submit"
                      className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-base font-medium transition-colors shadow-md"
                    >
                      Update URL
                    </button>
                  </form>
                )}

                {/* WhatsApp Form */}
                <div className={`${isDarkTheme ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg mb-4`}>
                  <h3 className={`${isDarkTheme ? 'text-gray-200' : 'text-gray-800'} text-sm font-semibold mb-2`}>
                    Try your bot on your WhatsApp phone number
                  </h3>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className={`w-full px-3 py-2 rounded-lg mb-2 h-[40px] 
                         ${isDarkTheme ? 'bg-gray-800 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'} 
                         focus:outline-none`}
                    onChange={handleChangeName}
                  />
                  <div className="flex items-center rounded-lg overflow-hidden">
                    <span className={`${isDarkTheme ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-900'} 
                          px-3 py-2 text-sm mr-3 h-[40px]`}>
                      +91
                    </span>
                    <input
                      type="text"
                      placeholder="Enter your phone number"
                      className={`w-full px-3 py-2 h-[40px] outline-none
                           ${isDarkTheme ? 'bg-gray-800 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'}`}
                      onChange={handleChangePhoneNumber}
                    />
                  </div>
                </div>

                {/* Rating Section */}
                <div className={`${isDarkTheme ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg mb-4`}>
                  <div className={`${isDarkTheme ? 'text-gray-200' : 'text-gray-700'} text-lg`}>
                    Rate the experience
                  </div>
                  <div className="flex space-x-2 items-center justify-center mt-3">
                    <button className={`inline-flex items-center justify-center w-12 h-12 rounded-full 
                         ${isDarkTheme ? 'bg-gray-800 hover:bg-gray-900' : 'bg-white hover:bg-gray-50'} 
                         border ${isDarkTheme ? 'border-gray-600' : 'border-gray-200'} 
                         transition-colors duration-200`}>
                      👍
                    </button>
                    <button className={`inline-flex items-center justify-center w-12 h-12 rounded-full 
                         ${isDarkTheme ? 'bg-gray-800 hover:bg-gray-900' : 'bg-white hover:bg-gray-50'} 
                         border ${isDarkTheme ? 'border-gray-600' : 'border-gray-200'} 
                         transition-colors duration-200`}>
                      👎
                    </button>
                  </div>
                </div>

                {/* Sign Up Button */}
                <button className="bg-[linear-gradient(to_right,rgb(255,204,51),rgb(245,158,11))] 
                       hover:bg-[linear-gradient(to_right,rgb(245,158,11),rgb(255,204,51))] 
                       text-gray-900 w-full py-3 rounded-lg font-medium transition-all duration-200">
                  Sign up
                </button>
              </div>
            </div>
          </div>

          {/* Chatbot */}
          <div className={`${isDarkTheme ? 'bg-gray-800' : 'bg-white'} 
               w-full lg:w-2/3 flex flex-col rounded-3xl shadow-lg overflow-hidden 
               order-1 lg:order-2 lg:max-h-[85vh] transition-colors duration-200`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 md:p-4 flex-shrink-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 md:space-x-4">
                  <h1 className="text-lg md:text-xl font-semibold text-white">AI Assistant</h1>
                  <div className="flex items-center space-x-2 text-sm text-white">
                    {isOnline ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Online</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>Offline</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  className="p-2 rounded-full text-white bg-white/10 hover:bg-white/20 transition-colors"
                  onClick={toggleTheme}
                >
                  <FontAwesomeIcon icon={isDarkTheme ? faSun : faMoon} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className={`flex-1 overflow-y-auto p-4 ${isDarkTheme ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-200`}>
              {messages.map((message, index) => (
                <React.Fragment key={index}>
                  <div className={`flex items-start mb-4 ${message.isUser ? "flex-row-reverse" : ""}`}>
                    {/* Profile Icon */}
                    <div className="w-10 h-10 flex items-center justify-center mt-[10px]">
                      {message.isUser ? "" : <img src={BotAvatar} alt="Bot Avatar" />}
                    </div>

                    {/* Message Box */}
                    <div className={`ml-3 max-w-[75%] md:max-w-[70%] lg:max-w-[60%] p-4 rounded-lg shadow-md
                      ${message.isUser 
                        ? "bg-blue-600 text-white" 
                        : isDarkTheme 
                          ? "bg-gray-800 text-gray-100 border border-gray-700" 
                          : "bg-white text-gray-900 border border-gray-200"
                      } 
                      ${message.isUser ? "ml-2" : "mr-2"}`}
                    >
                      {/* Message Content */}
                      <div className="prose dark:prose-invert max-w-none">
                        {!message.isUser && typeof message.content === "string" ? (
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              a: ({ node, ...props }) => (
                                <a
                                  {...props}
                                  className={`${isDarkTheme 
                                    ? 'text-blue-400 hover:text-blue-300' 
                                    : 'text-blue-600 hover:text-blue-700'} 
                                    underline transition-colors`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                />
                              ),
                              code: ({ node, ...props }) => (
                                <code
                                  {...props}
                                  className={`${isDarkTheme 
                                    ? 'bg-gray-700 text-gray-100' 
                                    : 'bg-gray-100 text-gray-800'} 
                                    px-1 py-0.5 rounded font-mono text-sm`}
                                />
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        ) : (
                          message.content
                        )}
                      </div>

                      {/* Suggested Articles Section */}
                      {message.links && message.links.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <p className={`text-sm font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                            Website Links:
                          </p>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {message.links.map((link, idx) => (
                              <a
                                key={idx}
                                href={link.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={link.title}
                                className={`flex items-center px-3 py-2 rounded-lg
                                  ${isDarkTheme 
                                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-100' 
                                    : 'bg-gray-50 hover:bg-gray-100 text-gray-900'}
                                  transition-colors text-sm font-medium truncate`}
                              >
                                <FontAwesomeIcon
                                  icon={faExternalLinkAlt}
                                  className={`mr-2 text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}
                                />
                                {link.title.length > 20 ? `${link.title.slice(0, 20)}...` : link.title}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className={`mb-4 text-xs mt-1 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'} 
                    ${message.isUser ? "ml-auto mr-4" : "ml-16"}`}
                  >
                    {!message.isUser && message.timestamp}
                  </div>
                </React.Fragment>
              ))}
              {isLoading && (
                <div className="flex items-start mb-4">
                  <div className="w-10 h-10 flex items-center justify-center mt-[10px]">
                    <img src={BotAvatar || "/placeholder.svg"} alt="Bot Avatar" className="animate-pulse" />
                  </div>
                  <div className="ml-3 max-w-[75%] md:max-w-[70%] lg:max-w-[60%] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-md">
                    <div className="flex flex-col">
                      <div className="text-sm text-gray-500 dark:text-gray-400 italic relative">
                        <div className="flex items-center gap-1">
                          <span className="inline-block">{loadingMessages[loadingMessageIndex]}</span>
                          <span className="inline-flex">
                            <span className="w-1 h-1 bg-gray-500 rounded-full animate-[bounce_0.8s_ease-in-out_0s_infinite]" />
                            <span className="w-1 h-1 bg-gray-500 rounded-full animate-[bounce_0.8s_ease-in-out_0.2s_infinite] mx-0.5" />
                            <span className="w-1 h-1 bg-gray-500 rounded-full animate-[bounce_0.8s_ease-in-out_0.4s_infinite]" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className={`${isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
                 border-t p-3 md:p-4 flex-shrink-0 sticky bottom-0 transition-colors duration-200`}>
              <div className={`flex space-x-2 ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-100'} 
                   rounded-lg p-2 md:p-3 transition-colors duration-200`}>
                <input
                  type="text"
                  className={`flex-1 min-w-0 bg-transparent border-none outline-none 
                       ${isDarkTheme ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'} 
                       transition-colors duration-200`}
                  placeholder="Type your message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-md hover:opacity-90 transition-all whitespace-nowrap"
                  onClick={handleSendMessage}
                >
                  <span className="hidden md:inline mr-2">Send</span>
                  <FontAwesomeIcon icon="paper-plane" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatBot
