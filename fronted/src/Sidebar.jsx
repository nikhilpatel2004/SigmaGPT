import "./Sidebar.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import { config } from "./config.js";
import {v1 as uuidv1} from "uuid";

function Sidebar() {
    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [showExplore, setShowExplore] = useState(false);
    const [showLibrary, setShowLibrary] = useState(false);

    const exploreFeatures = [
        {
            id: 'creative',
            title: 'Creative Writing',
            icon: 'fa-lightbulb',
            description: 'Get inspired with creative writing ideas and prompts',
            prompts: [
                'Write a short story about...',
                'Create a poem about...',
                'Generate creative writing prompts for...'
            ]
        },
        {
            id: 'coding',
            title: 'Coding Help',
            icon: 'fa-code',
            description: 'Write, debug, and optimize code in any language',
            prompts: [
                'Help me write a function to...',
                'Debug this code: ',
                'Explain this algorithm: '
            ]
        },
        {
            id: 'learning',
            title: 'Learning',
            icon: 'fa-graduation-cap',
            description: 'Learn new concepts and subjects with explanations',
            prompts: [
                'Explain the concept of...',
                'What is... and how does it work?',
                'Teach me about...'
            ]
        },
        {
            id: 'analysis',
            title: 'Analysis',
            icon: 'fa-chart-line',
            description: 'Analyze data, trends, and insights with deep research',
            prompts: [
                'Analyze the trends in...',
                'What are the key insights about...?',
                'Break down the data on...'
            ]
        },
        {
            id: 'content',
            title: 'Content Creation',
            icon: 'fa-pen',
            description: 'Create engaging content for blogs, social media, and more',
            prompts: [
                'Write a blog post about...',
                'Create social media content for...',
                'Generate headlines for...'
            ]
        },
        {
            id: 'brainstorm',
            title: 'Brainstorming',
            icon: 'fa-comments',
            description: 'Brainstorm ideas and explore different perspectives',
            prompts: [
                'Brainstorm ideas for...',
                'What are different ways to...?',
                'Suggest alternatives for...'
            ]
        }
    ];

    const getDateGroup = (dateStr) => {
        const now = new Date();
        const date = new Date(dateStr);
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays <= 7) return 'Previous 7 days';
        if (diffDays <= 30) return 'Previous 30 days';
        return 'Older';
    };

    const groupedThreads = () => {
        const filtered = allThreads?.filter(thread => 
            thread.title.toLowerCase().includes(searchQuery.toLowerCase())
        ) || [];
        
        const groups = {
            'Today': [],
            'Previous 7 days': [],
            'Previous 30 days': [],
            'Older': []
        };
        
        filtered.forEach(thread => {
            const group = getDateGroup(thread.createdAt || new Date());
            if (groups[group]) {
                groups[group].push(thread);
            }
        });
        
        return Object.entries(groups).filter(([_, items]) => items.length > 0);
    };

    const getAllThreads = async () => {
        try {
            const response = await fetch(`${config.apiUrl}/api/thread`);
            if (!response.ok) throw new Error(`Backend error: ${response.status}`);
            const res = await response.json();
            const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
            setAllThreads(filteredData);
        } catch (err) {
            console.error("Error loading threads:", err.message);
            setAllThreads([]);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId])


    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`${config.apiUrl}/api/thread/${newThreadId}`);
            const res = await response.json();
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch (err) {
        }
    }   

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`${config.apiUrl}/api/thread/${threadId}`, {method: "DELETE"});
            const res = await response.json();

            //updated threads re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if(threadId === currThreadId) {
                createNewChat();
            }

        } catch(err) {
            console.log(err);
        }
    }

    const toggleSearch = () => {
        setShowSearch(!showSearch);
        if (!showSearch) {
            setSearchQuery("");
        }
    }

    const handleExploreFeature = (feature) => {
        createNewChat();
        setShowExplore(false);
        // Set a prompt from the feature's prompts array
        const randomPrompt = feature.prompts[Math.floor(Math.random() * feature.prompts.length)];
        setPrompt(randomPrompt);
    }

    return (
        <section className="sidebar">
            <div className="sidebarHeader">
                <button className="newChatBtn" onClick={createNewChat}>
                    <i className="fa-solid fa-pen-to-square"></i>
                    <span>New chat</span>
                </button>
            </div>

            <div className="sidebarMenu">
                <button className="menuItem" onClick={toggleSearch}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <span>Search chats</span>
                </button>
                <button className="menuItem" onClick={() => setShowExplore(true)}>
                    <i className="fa-solid fa-compass"></i>
                    <span>Explore</span>
                </button>
                <button className="menuItem" onClick={() => setShowLibrary(true)}>
                    <i className="fa-solid fa-book"></i>
                    <span>Library</span>
                </button>
            </div>

            {showSearch && (
                <div className="searchBox">
                    <i className="fa-solid fa-magnifying-glass searchIcon"></i>
                    <input 
                        type="text" 
                        placeholder="Search chats..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                    {searchQuery && (
                        <i className="fa-solid fa-xmark clearSearch" onClick={() => setSearchQuery("")}></i>
                    )}
                </div>
            )}

            <div className="sidebarSection">
                <div className="sectionLabel">GPTs</div>
                <button className="exploreBtn" onClick={() => setShowExplore(true)}>
                    <i className="fa-solid fa-compass"></i>
                    <span>Explore</span>
                </button>
                <ul className="history">
                    {
                        groupedThreads().map(([groupName, threads]) => (
                            <div key={groupName} className="chatGroup">
                                <div className="groupLabel">{groupName}</div>
                                {threads.map((thread, idx) => (
                                    <li key={idx} 
                                        onClick={(e) => changeThread(thread.threadId)}
                                        className={thread.threadId === currThreadId ? "highlighted": " "}
                                    >
                                        <i className="fa-solid fa-message"></i>
                                        <span className="threadTitle">{thread.title}</span>
                                        <i className="fa-solid fa-trash"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteThread(thread.threadId);
                                            }}
                                        ></i>
                                    </li>
                                ))}
                            </div>
                        ))
                    }
                </ul>
            </div>

            <div className="sign">
                <p>By SigmaGPT &hearts;</p>
            </div>

            {showExplore && (
                <div className="exploreModal">
                    <div className="exploreContent">
                        <button className="closeBtn" onClick={() => setShowExplore(false)}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                        <h2>Explore</h2>
                        <div className="exploreGrid">
                            {exploreFeatures.map((feature) => (
                                <div 
                                    key={feature.id}
                                    className="exploreCard"
                                    onClick={() => handleExploreFeature(feature)}
                                >
                                    <div className="cardIcon"><i className={`fa-solid ${feature.icon}`}></i></div>
                                    <h3>{feature.title}</h3>
                                    <p>{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {showLibrary && (
                <div className="libraryModal">
                    <div className="libraryContent">
                        <button className="closeBtn" onClick={() => setShowLibrary(false)}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                        <h2>Library</h2>
                        <p className="libraryDescription">Your saved and pinned conversations</p>
                        {allThreads && allThreads.length > 0 ? (
                            <div className="libraryList">
                                {allThreads.map((thread) => (
                                    <div 
                                        key={thread.threadId} 
                                        className="libraryItem"
                                        onClick={() => {
                                            changeThread(thread.threadId);
                                            setShowLibrary(false);
                                        }}
                                    >
                                        <i className="fa-solid fa-bookmark"></i>
                                        <div className="libraryItemContent">
                                            <div className="libraryItemTitle">{thread.title}</div>
                                            <div className="libraryItemTime">Saved conversation</div>
                                        </div>
                                        <i className="fa-solid fa-chevron-right"></i>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="emptyLibrary">
                                <i className="fa-solid fa-inbox"></i>
                                <p>No saved conversations yet</p>
                                <span>Conversations you save will appear here</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    )
}

export default Sidebar;