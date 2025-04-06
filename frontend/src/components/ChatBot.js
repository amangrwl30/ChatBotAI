import React, { useState, useEffect, useRef, useContext } from 'react';
// import 'tailwindcss/tailwind.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faPaperclip, faMicrophone, faPaperPlane, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import BotAvatar from "../assets/robot-norby.png";
// import UserAvatar from "../assets/user.jpg";
import { format } from "date-fns";
import { AppContext } from '../context/AppContext';

library.add(faMoon, faSun, faPaperclip, faMicrophone, faPaperPlane, faExternalLinkAlt);

const ChatBot = ({ website }) => {
	const [isDarkTheme, setIsDarkTheme] = useState(true);
	const formattedWebsite = website.startsWith("http") ? website : `https://${website}`;
	const { sharedState, setSharedState } = useContext(AppContext);
	const [userInfo, setUserInfo] = useState({ name: "", phoneNumber: '' })
	const [isOnline, setIsOnline] = useState(navigator.onLine);
	
	const handleChangeName = (e) => {
		setUserInfo(prev => ({ ...prev, name: e.target.value }))
	}
	const handleChangePhoneNumber = (e) => {
		setUserInfo(prev => ({ ...prev, phoneNumber: +e.target.value }))
	}

	const submitUserInfo = async () => {
		const response = await fetch('http://localhost:4000/submitUserInfo', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(userInfo),
		});
	}

	const [messages, setMessages] = useState([
		{
			content: (
				<>
					Hello! I'm your AI assistant for{" "}
					<a
						href={formattedWebsite}
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-500 underline"
					>
						{formattedWebsite}
					</a>
					. How can I help you today?
				</>
			),
			isUser: false
		}
	]);


	const [messageInput, setMessageInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [currentWebsite, setCurrentWebsite] = useState(website);
	const [newWebsite, setNewWebsite] = useState(website);
	const [isEditingWebsite, setIsEditingWebsite] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [isUpdatingWebsite, setIsUpdatingWebsite] = useState(false);
	const messagesEndRef = useRef(null);

	const toggleTheme = () => {
		setSharedState(prev => ({ ...prev, yellowAiTheme: !prev.yellowAiTheme }))
		// setIsDarkTheme(!isDarkTheme);
	};

	const isValidWebsite = (url) => {
		const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
		return pattern.test(url);
	};

	const handleSendMessage = () => {
		if (messageInput.trim()) {
			const userMessage = messageInput.trim();
			const timestamp = format(new Date(), "EEE hh:mm a");

			setMessages([...messages, { content: userMessage, isUser: true, timestamp }]);
			setMessageInput('');
			fetchBotResponse(userMessage);
		}
	};

	const fetchBotResponse = async (userMessage) => {
		setIsLoading(true);
		try {
			const response = await fetch('http://localhost:4000/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					query: userMessage,
					website: currentWebsite,
					use_site_operator: true,
				}),
			});

			const data = await response.json();
			const timestamp = format(new Date(), "EEE hh:mm a");
			const botMessage = {
				content: data.answer,
				links: data.links,
				isUser: false,
				timestamp
			};

			setMessages((prevMessages) => [...prevMessages, botMessage]);
		} catch (error) {
			console.error('Error fetching bot response:', error);
			setMessages((prevMessages) => [...prevMessages, { content: 'Error fetching response from server.', isUser: false }]);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages, isLoading]);


	useEffect(() => {
		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => setIsOnline(false);

		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
		};
	}, []);



	const handleWebsiteChange = (e) => {
		e.preventDefault();
		if (isValidWebsite(newWebsite)) {
			setIsUpdatingWebsite(true);
			setTimeout(() => {
				setCurrentWebsite(newWebsite);
				setMessages([
					{
						content: <p >Hello! I'm your AI assistant for <a target="_blank"
							rel="noopener noreferrer" className='text-blue-500 underline' href={`${newWebsite.startsWith("http") ? newWebsite : `https://${newWebsite}`}`}>{newWebsite}</a>. How can I help you today?</p>, isUser: false
					}
				]);
				setIsEditingWebsite(false);
				setErrorMessage('');
				setIsUpdatingWebsite(false);
			}, 2000); // Simulate loading time
		} else {
			setErrorMessage('Please enter a valid website URL.');
		}
	};

	return (
		<div className={` min-h-screen transition-all flex justify-center items-center overflow-x-hidden`}>
			{isUpdatingWebsite ? (
				<div className="flex justify-center items-center">
					<div className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full" role="status">
						{/* <span className="visually-hidden">Loading...</span> */}
					</div>
				</div>
			) : (
				<div className="container w-[96%] max-w-none mx-auto flex flex-col lg:flex-row gap-24 animate-slideIn overflow-hidden">
					{/* Side Form */}
					<div className="bg-white h-[94vh] dark:bg-zinc-1100 border  border-gray-200 dark:border-[rgba(138,124,184,0.1)] rounded-2xl p-3 shadow-lg w-full md:w-4/5 lg:w-2/5 xl:w-1/3 mx-auto lg:mx-0" >
						{/* Header Section */}
						<div className="bg-gray-100 dark:bg-zinc-1100 p-4 rounded-lg mb-4">
							<p className="text-gray-700 dark:text-gray-300 text-sm text-[18px]">
								Your bot can answer questions on <span className="text-blue-500">{currentWebsite}</span>
							</p>
							<button
								className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center mt-4"
								onClick={() => setIsEditingWebsite(!isEditingWebsite)}
							>
								<span className="mr-2">✏️</span> Change URL
							</button>
							{isEditingWebsite && (
								<form onSubmit={handleWebsiteChange} className="mt-4">
									<input
										type="text"
										value={newWebsite}
										onChange={(e) => setNewWebsite(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 text-gray-900 dark:text-black text-sm focus:ring focus:ring-blue-200"
									/>
									{errorMessage && (
										<p className="text-red-500 text-sm mb-2">{errorMessage}</p>
									)}
									<button
										type="submit"
										className="bg-blue-500 text-white w-full py-2 rounded-lg text-sm font-medium"
									>
										Update URL
									</button>
								</form>
							)}
						</div>

						{/* WhatsApp Form */}
						<div className="bg-gray-50 dark:bg-zinc-1100 p-4 rounded-lg mb-4">
							<h3 className="text-gray-800 dark:text-gray-300 text-sm font-semibold mb-2">
								Try your bot on your WhatsApp phone number
							</h3>
							<input
								type="text"
								placeholder="Enter your name"
								className="w-full  px-3 py-2 focus:outline-none rounded-lg mb-2 text-gray-900 dark:text-white dark:bg-gray-1300  text-sm  h-[40px]"
								onChange={handleChangeName}
							/>
							<div className="flex items-center rounded-lg overflow-hidden border-[rgba(138,124,184,0.2)]
">
								<span className="dark:bg-gray-1300 dark:text-[rgb(138,124,184)] px-3 py-2 text-gray-900 text-sm  mr-3 h-[40px]">+91</span>
								<input
									type="text"
									placeholder="Enter your phone number"
									className="w-full px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-1300  text-sm outline-none h-[40px]"
									onChange={handleChangePhoneNumber}
								/>
							</div>
							<button onClick={submitUserInfo} className="bg-[linear-gradient(to_right,rgb(255,204,51),rgb(245,158,11))] hover:bg-[linear-gradient(to_right,rgb(245,158,11),rgb(255,204,51))]  text-gray-900 dark:text-gray-900 w-full py-2 mt-3 rounded-lg text-sm font-medium h-[40px]">
								Submit
							</button>
						</div>

						{/* Rating Section */}
						<div className="bg-gray-100 dark:bg-zinc-1100 p-4 rounded-lg justify-between items-center mb-4">
							<div className="text-gray-700 dark:text-gray-300 text-lg">Rate the experience</div>
							<div className="flex space-x-2 items-center justify-center mt-3">
								<button className='inline-flex items-center justify-center  whitespace-nowrap text-sm font-medium   border bg-background hover:text-accent-foreground w-12 h-12 rounded-full border-light-purple/20 hover:border-bright-purple hover:bg-bright-purple/10 '>👍</button>
								<button className='inline-flex items-center justify-center  whitespace-nowrap text-sm font-medium   border bg-background hover:text-accent-foreground w-12 h-12 rounded-full border-light-purple/20 hover:border-bright-purple hover:bg-bright-purple/10 '>👎</button>
							</div>
						</div>

						{/* Sign Up Button */}
						<button className="bg-[linear-gradient(to_right,rgb(255,204,51),rgb(245,158,11))] hover:bg-[linear-gradient(to_right,rgb(245,158,11),rgb(255,204,51))] text-gray-900 dark:text-gray-900 w-full py-3 rounded-lg text-sm font-medium h-[48px]">
							Sign up
						</button>
					</div>

					{/* Chatbot */}
					<div className="container mx-auto w-1/2 flex flex-col py-4 animate-slideIn rounded-3xl bg-white dark:bg-zinc-1100 shadow-lg overflow-hidden mt-[3rem] mb-[3rem]">
						{/* Header */}
						<header className="flex justify-between items-center p-4 bg-white dark:bg-zinc-1100 border-b border-gray-300 dark:border-[rgba(138,124,184,0.1)] shadow-sm rounded-t-3xl">
							<div className="flex items-center space-x-4">
								<h1 className="text-xl font-semibold text-gray-500 dark:text-gray-300">AI Assistant</h1>
								<div className="flex items-center space-x-2 text-gray-500 dark:text-gray-300">
									{isOnline ? <>
										<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
										<span>Online</span>
									</> : <>
										<div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
										<span>Offline</span>
									</>}
								</div>
							</div>
							<button
								className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
								aria-label="Toggle theme"
								onClick={toggleTheme}
							>
								<FontAwesomeIcon icon={isDarkTheme ? faSun : faMoon} />
							</button>
						</header>

						{/* Chat Messages (Fixed Height & Scrollable) */}
						<div className=" h-[25rem] overflow-y-auto p-4 bg-gray-100 dark:bg-zinc-1100 rounded-b-3xl" id="chatContainer">
							{messages.map((message, index) => (
								<>
									<div key={index} className={`flex items-start ${message.isUser ? "flex-row-reverse" : ""}`}>

										{/* Profile Icon */}
										<div className={`w-10 h-10 flex items-center justify-center mt-[10px]`}>
											{message.isUser ? "" : <img src={BotAvatar} />}
										</div>

										{/* Message Box */}
										<div className={`ml-3 max-w-xs p-3 rounded-lg shadow-sm 
        ${message.isUser
												? "bg-blue-500 text-white"
												: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-md max-w-sm text-black dark:text-white"
											} 
        ${message.isUser ? "ml-4" : "mr-4"}`}
										>

											{/* Message Content (With Gray Background If Links Exist) */}
											<div className={`${!message.isUser && message.links ? " px-3 py-2 rounded-lg mb-2 text-gray-900 dark:text-white" : ""}`}>
												{message.content}
											</div>




											{/* Suggested Articles Section */}
											{message.links && message.links.length > 0 && (
												<div className="mt-2 p-2">
													<p className="text-md text-gray-800 dark:text-gray-300 font-semibold">Suggested articles:</p>

													{/* Grid layout (2 links per row) */}
													<div className="grid grid-cols-2 gap-2 mt-2">
														{message.links.map((link, idx) => (
															<a
																key={idx}
																href={link.link}
																target="_blank"
																rel="noopener noreferrer"
																title={link.title}
																className="flex items-center px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm text-xs font-medium text-gray-900 dark:text-white truncate"
															>
																<FontAwesomeIcon icon={faExternalLinkAlt} className="mr-2 text-xs text-gray-600 dark:text-gray-300" />
																{link.title.length > 20 ? link.title.slice(0, 20) + "..." : link.title}
															</a>
														))}
													</div>
												</div>
											)}

										</div>

									</div>
									<div style={message.isUser ? { marginLeft: '85%' } : { marginLeft: '6%' }} className='mb-4 text-xs mt-1 text-black dark:text-white'>{!message.isUser && message.timestamp}</div>

								</>
							))}
							{isLoading && (
								<div className="flex items-start mb-4">
									<div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-md bg-gradient-to-r from-blue-500 to-purple-500">
										AI
									</div>
									<div className="max-w-xs p-3 rounded-lg shadow-sm bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 ml-4">
										<div className="flex space-x-2">
											<div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
											<div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
											<div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-400"></div>
										</div>
									</div>
								</div>
							)}
							<div ref={messagesEndRef} />
						</div>

						{/* Input Area (Fixed at Bottom) */}
						<div className="p-3 border-t border-[rgba(138,124,184,0.1)]">
							<div className="flex space-x-2 bg-gray-100 dark:bg-gray-1200 rounded-lg p-2 shadow-sm">
								<input
									type="text"
									className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 "
									placeholder="Type your message..."
									aria-label="Message input"
									value={messageInput}
									onChange={(e) => setMessageInput(e.target.value)}
									onKeyPress={(e) => {
										if (e.key === 'Enter') {
											handleSendMessage();
										}
									}}
								/>

								<button className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-md hover:opacity-90 transition-all" onClick={handleSendMessage}>
									<span className="mr-2">Send</span>
									<FontAwesomeIcon icon="paper-plane" />
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ChatBot;