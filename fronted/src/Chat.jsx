import "./Chat.css";
import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

const welcomeMessages = [
    "What are you working on?",
    "How can I help you today?",
    "What's on your mind?",
    "What can I help with?",
    "Ready to chat?",
    "What would you like to know?",
    "Let's get started!",
    "What can I do for you?"
];

function Chat({ chatsContainerRef }) {
    const {newChat, prevChats, reply, setPrompt} = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);
    const [hoveredIdx, setHoveredIdx] = useState(null);
    const [welcomeMsg, setWelcomeMsg] = useState("");

    useEffect(() => {
        if (newChat) {
            const randomMsg = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
            setWelcomeMsg(randomMsg);
        }
    }, [newChat]);

    useEffect(() => {
        if(reply === null) {
            setLatestReply(null); //prevchat load
            return;
        }

        if(!prevChats?.length) {
            return;
        }

        const content = reply.split(" "); //individual words

        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx+1).join(" "));

            idx++;
            if(idx >= content.length) {
                clearInterval(interval);
            }
        }, 40);

        return () => {
            clearInterval(interval);
        };

    }, [prevChats, reply])

    const handleEditPrompt = (content) => {
        setPrompt(content);
        // Scroll to input and focus
        const input = document.querySelector('input');
        if (input) {
            input.focus();
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    // Add copy buttons to code blocks after render
    useEffect(() => {
        const codeBlocks = document.querySelectorAll('pre code');
        codeBlocks.forEach((codeBlock) => {
            const pre = codeBlock.parentElement;
            
            // Check if button already exists
            if (pre.querySelector('.code-copy-btn')) {
                return;
            }
            
            const button = document.createElement('button');
            button.className = 'code-copy-btn';
            button.innerHTML = '📋 Copy';
            button.onclick = () => {
                const code = codeBlock.textContent;
                navigator.clipboard.writeText(code).then(() => {
                    button.innerHTML = '✓ Copied!';
                    setTimeout(() => button.innerHTML = '📋 Copy', 2000);
                });
            };
            
            pre.style.position = 'relative';
            pre.appendChild(button);
        });
    }, [prevChats, latestReply]);

    return (
        <>
            {newChat && <h1 className="welcomeHeading">{welcomeMsg}</h1>}
            <div className="chats" ref={chatsContainerRef}>
                {
                    prevChats?.slice(0, -1).map((chat, idx) => 
                        <div 
                            className={chat.role === "user"? "userDiv" : "gptDiv"} 
                            key={idx}
                            onMouseEnter={() => setHoveredIdx(idx)}
                            onMouseLeave={() => setHoveredIdx(null)}
                        >
                            {
                                chat.role === "user"? 
                                <>
                                    <p className="userMessage">{chat.content}</p>
                                    {hoveredIdx === idx && (
                                        <div className="messageActions">
                                            <button 
                                                onClick={() => {
                                                    navigator.clipboard.writeText(chat.content);
                                                    // Show feedback
                                                    const btn = event.target;
                                                    const originalText = btn.textContent;
                                                    btn.textContent = '✓ Copied';
                                                    setTimeout(() => btn.textContent = originalText, 2000);
                                                }} 
                                                className="actionBtn"
                                                title="Copy"
                                            >
                                                <i className="fa-solid fa-copy"></i>
                                            </button>
                                            <button 
                                                onClick={() => handleEditPrompt(chat.content)} 
                                                className="actionBtn"
                                                title="Edit"
                                            >
                                                <i className="fa-solid fa-pencil"></i>
                                            </button>
                                        </div>
                                    )}
                                </>
                                : 
                                <>
                                    <div style={{ flex: 1 }}>
                                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                                    </div>
                                    {hoveredIdx === idx && (
                                        <div className="aiMessageActions">
                                            <button className="aiActionBtn" title="Copy">
                                                <i className="fa-solid fa-copy"></i>
                                            </button>
                                            <button className="aiActionBtn" title="Thumbs up">
                                                <i className="fa-solid fa-thumbs-up"></i>
                                            </button>
                                            <button className="aiActionBtn" title="Thumbs down">
                                                <i className="fa-solid fa-thumbs-down"></i>
                                            </button>
                                            <button className="aiActionBtn" title="Share">
                                                <i className="fa-solid fa-share"></i>
                                            </button>
                                            <button className="aiActionBtn" title="Refresh">
                                                <i className="fa-solid fa-rotate-right"></i>
                                            </button>
                                            <button className="aiActionBtn" title="More">
                                                <i className="fa-solid fa-ellipsis"></i>
                                            </button>
                                        </div>
                                    )}
                                </>
                            }
                        </div>
                    )
                }

                {
                    prevChats.length > 0  && (
                        <>
                            {
                                latestReply === null ? (
                                    <div 
                                        className="gptDiv" 
                                        key={"non-typing"}
                                        onMouseEnter={() => setHoveredIdx('latest')}
                                        onMouseLeave={() => setHoveredIdx(null)}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChats[prevChats.length-1].content}</ReactMarkdown>
                                        </div>
                                        {hoveredIdx === 'latest' && (
                                            <div className="aiMessageActions">
                                    <div 
                                        className="gptDiv" 
                                        key={"typing"}
                                        onMouseEnter={() => setHoveredIdx('typing')}
                                        onMouseLeave={() => setHoveredIdx(null)}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                                        </div>
                                        {hoveredIdx === 'typing' && (
                                            <div className="aiMessageActions">
                                                <button className="aiActionBtn" title="Copy">
                                                    <i className="fa-solid fa-copy"></i>
                                                </button>
                                                <button className="aiActionBtn" title="Thumbs up">
                                                    <i className="fa-solid fa-thumbs-up"></i>
                                                </button>
                                                <button className="aiActionBtn" title="Thumbs down">
                                                    <i className="fa-solid fa-thumbs-down"></i>
                                                </button>
                                                <button className="aiActionBtn" title="Share">
                                                    <i className="fa-solid fa-share"></i>
                                                </button>
                                                <button className="aiActionBtn" title="Refresh">
                                                    <i className="fa-solid fa-rotate-right"></i>
                                                </button>
                                                <button className="aiActionBtn" title="More">
                                                    <i className="fa-solid fa-ellipsis"></i>
                                                </button>
                                            </div>
                                        )}
                                    </div>      <button className="aiActionBtn" title="Share">
                                                    <i className="fa-solid fa-share"></i>
                                                </button>
                                                <button className="aiActionBtn" title="Refresh">
                                                    <i className="fa-solid fa-rotate-right"></i>
                                                </button>
                                                <button className="aiActionBtn" title="More">
                                                    <i className="fa-solid fa-ellipsis"></i>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div 
                                        className="gptDiv" 
                                        key={"typing"}
                                        onMouseEnter={() => setHoveredIdx('typing')}
                                        onMouseLeave={() => setHoveredIdx(null)}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                                        </div>
                                    </div>
                                )

                            }
                        </>
                    )
                }

            </div>
        </>
    )
}

export default Chat;