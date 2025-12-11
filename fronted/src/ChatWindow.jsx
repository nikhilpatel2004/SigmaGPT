import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { AuthContext } from "./AuthContext.jsx";
import { Settings } from "./Settings.jsx";
import { config } from "./config.js";
import { useContext, useState, useEffect, useRef } from "react";
import {ScaleLoader} from "react-spinners";

function ChatWindow() {
    const {prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat} = useContext(MyContext);
    const { user, logout } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [mediaFiles, setMediaFiles] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const [hideNavbar, setHideNavbar] = useState(false);
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const mediaInputRef = useRef(null);
    const recognitionRef = useRef(null);
    const basePromptRef = useRef("");
    const chatsContainerRef = useRef(null);
    const navbarRef = useRef(null);
    const displayName = user?.name || user?.email?.split("@")[0] || "User";

    // Props passed from App
    const props = {
        onLoginClick: arguments[0]?.onLoginClick || (() => {})
    };

    const getReply = async () => {
        if (loading) return;
        if (!prompt.trim()) return;
        setLoading(true);
        setNewChat(false);
        setMediaFiles([]);

        // Scroll to bottom after a brief delay to ensure message is added
        setTimeout(() => {
            if (chatsContainerRef.current) {
                chatsContainerRef.current.scrollTop = chatsContainerRef.current.scrollHeight;
            }
        }, 100);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try {
            const response = await fetch(config.endpoints.chat, options);
            if (!response.ok) throw new Error(`Backend error: ${response.status}`);
            const res = await response.json();
            setReply(res.reply || "I'm here to help!");
        } catch(err) {
            console.error("Error fetching reply:", err);
            setReply("Unable to connect to the server. Please try again later.");
        }
        setLoading(false);
    }

    //Append new chat to prevChats
    useEffect(() => {
        if(prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats, {
                    role: "user",
                    content: prompt
                },{
                    role: "assistant",
                    content: reply
                }]
            ));
        }

        setPrompt("");
        
        // Scroll to bottom when reply is added
        setTimeout(() => {
            if (chatsContainerRef.current) {
                chatsContainerRef.current.scrollTop = chatsContainerRef.current.scrollHeight;
            }
        }, 100);
    }, [reply]);

    // Handle scroll event for navbar hide/show
    useEffect(() => {
        const handleScroll = () => {
            if (chatsContainerRef.current) {
                const scrollTop = chatsContainerRef.current.scrollTop;
                
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    // Scrolling down
                    setHideNavbar(true);
                } else {
                    // Scrolling up
                    setHideNavbar(false);
                }
                
                setLastScrollTop(scrollTop);
            }
        };

        const container = chatsContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [lastScrollTop]);


    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }

    const handleMediaClick = () => {
        if (mediaInputRef.current) {
            mediaInputRef.current.click();
        }
    };

    const handleMediaChange = (event) => {
        const files = Array.from(event.target.files || []);
        setMediaFiles(files);
    };

    const initRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Voice input not supported in this browser.");
            return null;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            let interim = "";
            let final = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    final += transcript + " ";
                } else {
                    interim += transcript + " ";
                }
            }

            const allText = (final + interim).trim();
            const combined = [basePromptRef.current, allText]
                .filter(Boolean)
                .join(" ")
                .replace(/\s+/g, " ")
                .trim();

            setPrompt(combined);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            if (event.error === "not-allowed" || event.error === "service-not-allowed") {
                alert("Microphone permission denied. Please allow mic access to use voice input.");
            }
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
        return recognition;
    };

    const handleToggleVoice = () => {
        if (isListening && recognitionRef.current) {
            recognitionRef.current.stop();
            return;
        }

        const recognition = recognitionRef.current || initRecognition();
        if (!recognition) return;

        try {
            basePromptRef.current = prompt;
            recognition.start();
            setIsListening(true);
        } catch (error) {
            console.error("Speech recognition start error", error);
            alert("Voice input couldn't start. Check mic permissions and that you're on a supported browser (Chrome).");
            setIsListening(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.charAt(0).toUpperCase();
    };

    const handleShareClick = () => {
        const shareUrl = window.location.href;
        const shareText = "Check out my chat on SigmaGPT!";
        
        if (navigator.share) {
            navigator.share({
                title: 'SigmaGPT Chat',
                text: shareText,
                url: shareUrl
            }).catch((error) => console.log('Error sharing:', error));
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(shareUrl)
                .then(() => alert('Link copied to clipboard!'))
                .catch(() => alert('Unable to copy link'));
        }
    };

    const handleAddPeopleClick = () => {
        const email = prompt('Enter email address to share with:');
        if (email && email.includes('@')) {
            alert(`Invite sent to ${email}!\n(Feature coming soon)`);
        } else if (email) {
            alert('Please enter a valid email address');
        }
    };

    return (
        <div className="chatWindow">
            <div className="navbar" ref={navbarRef} style={{ transform: hideNavbar ? 'translateY(-100%)' : 'translateY(0)' }}>
                <span className="brand">SigmaGPT <i className="fa-solid fa-chevron-down"></i></span>
                <div className="navbarCenter">
                    <span className="freeOfferBadge">
                        <i className="fa-solid fa-star"></i> Free offer
                    </span>
                </div>
                <div className="navbarRight">
                    <button className="navButton" onClick={handleShareClick} title="Share">
                        <i className="fa-solid fa-arrow-up-from-bracket"></i>
                        <span>Share</span>
                    </button>
                    <button className="navButton" onClick={handleAddPeopleClick} title="Add people">
                        <i className="fa-solid fa-user-plus"></i>
                        <span>Add people</span>
                    </button>
                    <button className="navMenu" onClick={handleProfileClick} title="Menu">
                        <i className="fa-solid fa-ellipsis"></i>
                    </button>
                    {user ? (
                        <button className="userPill" onClick={handleProfileClick}>
                            <span className="userThumb">
                                {user.photoURL ? (
                                    <img className="userIconImg" src={user.photoURL} alt={displayName} />
                                ) : (
                                    <span className="userInitials">{getInitials(displayName)}</span>
                                )}
                            </span>
                        </button>
                    ) : (
                        <button className="loginButtonNav" onClick={props.onLoginClick}>
                            Sign in
                        </button>
                    )}
                </div>
            </div>
            {
                isOpen && 
                <div className="dropDown">
                    {user && (
                        <div className="profileSummary">
                            <div className="profileSummaryAvatar">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt={displayName} />
                                ) : (
                                    <span className="avatarInitials">{getInitials(displayName)}</span>
                                )}
                            </div>
                            <div className="profileSummaryMeta">
                                <p className="profileName">{displayName}</p>
                            </div>
                        </div>
                    )}
                    <div className="dropDownItem" onClick={() => { setShowSettings(true); setIsOpen(false); }}><i className="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropDownItem" onClick={logout}><i className="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
                </div>
            }
            {showSettings && <Settings onClose={() => setShowSettings(false)} />}
            <Chat chatsContainerRef={chatsContainerRef}></Chat>

            <ScaleLoader color="#fff" loading={loading}>
            </ScaleLoader>
            
            <div className="chatInput">
                <div className="inputBox">
                    <button
                        type="button"
                        className="iconButton attachButton"
                        onClick={handleMediaClick}
                        aria-label="Add media"
                    >
                        <i className="fa-solid fa-plus"></i>
                    </button>

                    <input
                        placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter'? getReply() : ''}
                    >
                    </input>

                    <div className="inputActions">
                        <button
                            type="button"
                            className={`iconButton voiceButton ${isListening ? 'listening' : ''}`}
                            onClick={handleToggleVoice}
                            aria-label="Voice input"
                        >
                            <i className="fa-solid fa-microphone"></i>
                        </button>
                        <button
                            id="submit"
                            type="button"
                            onClick={getReply}
                            disabled={loading || !prompt.trim()}
                            aria-label="Send message"
                        >
                            <i className="fa-solid fa-paper-plane"></i>
                        </button>
                    </div>
                    <input
                        type="file"
                        multiple
                        accept="image/*,video/*,audio/*"
                        ref={mediaInputRef}
                        onChange={handleMediaChange}
                        style={{ display: "none" }}
                    />
                </div>
                {
                    mediaFiles.length > 0 && (
                        <div className="attachmentPills">
                            {mediaFiles.map((file, idx) => (
                                <span key={idx} className="attachmentChip">{file.name}</span>
                            ))}
                        </div>
                    )
                }
                <p className="info">
                    SigmaGPT can make mistakes. Check important info. See Cookie Preferences.
                </p>
            </div>
        </div>
    )
}

export default ChatWindow;
