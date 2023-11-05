import { SideBar } from "../../components/Navbar/SideBar";
import ScrollUpButton from "react-scroll-up-button"
import "./Messanger.css"
import Picker from "emoji-picker-react"
import Conversation from "../../components/Conversation/Conversation"
import Message from "../../components/Message/Message";
import ChatOnline from "../../components/ChatOnline/ChatOnlin";
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from "../../app/features/getUser"
import { useEffect, useRef, useState } from "react";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import axios from "axios"
import io from "socket.io-client"
import tokenService from "../../Services/TokenService/tokenService";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";


var config = {
    headers: {
        authorization: tokenService.getToken()
    }
}
const Messanger = ({Activeuser}) => {
    io("http://localhost:5000")
    var BASE_URL = "http://localhost:5000";
    const [conversations, setConversations] = useState([])
    const socket = useRef();
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [Arrivemessage, setArriveMessage] = useState(null);
    const [inputMessage, setInputMessage] = useState("");
    const [showPicker, setShowPicker] = useState(false);
    const [emptyInputBox, setEmptyInputBox] = useState(true);
    const textMessage = useRef("");
    
    const dispatcher = useDispatch();
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [reload, setReload] = useState(false)
    const [currentChattUser, setCurrentChatUser] = useState(null);
    const scrollRef = useRef();
    const [onlineUsers,setOnlineUsers]=useState()
    const navigate = useNavigate();


 

    useEffect(()=>{
        socket.current?.on("get-messages", (data) => {
            setArriveMessage({
                senderId: data?.senderId,
                text: data?.text,
                createdAt: Date.now()
            })
        });
    },[])


    useEffect(() => {
        socket.current = io("ws://localhost:5000");
        socket.current?.on("get-messages", (data) => {
            setArriveMessage({
                senderId: data?.senderId,
                text: data?.text,
                createdAt: Date.now()
            });
            setReload(true)
        })
    }, [Arrivemessage]);

    // get arrive messages
    useEffect(() => {
        setMessages((prev) => [...prev, Arrivemessage]);
        setReload(false)
    }, [Arrivemessage, currentChat, reload])

    // add a user to socket server for communication
    useEffect(() => {
        socket.current.emit("add-user", Activeuser?._id);
        socket.current.on("get-users", (users) => {
            let filterdOnlineUsers=users.filter((u)=>u.userId!=Activeuser?._id && u.userId!=null);
            console.log("filterd ")
            console.log(filterdOnlineUsers)
            setOnlineUsers(filterdOnlineUsers);
        })
    }, [Activeuser?._id])

    // Emoji event listner
    const onEmojiClick = (emojiObject) => {
        console.log(emojiObject);
        setInputMessage((prev) => prev + emojiObject.emoji)
        setShowPicker(false)
    };
    // success message tostyfi
    const notifySuccess = (message) => {

    }

    // send the message
    const onMessageTyping = (e) => {
        if (e.target.value != "") {
            setEmptyInputBox(false)
        } else setEmptyInputBox(true);
        setInputMessage(e.target.value)
    }


    // get all conversation from the backend api
    useEffect(() => {
        const getConversations = async () => {
            try {
                await axios.get(BASE_URL + `/user/chat/getconversation/${Activeuser?._id}`)
                    .then((response) => {
                        let con = response.data.conversation;
                        setConversations(con);
                        console.log(con)
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            } catch (error) {
                console.log(error)
            }
        }
        getConversations();
    }, [Activeuser?._id])


    // define the get message function
    useEffect(() => {
        const getMessages = async () => {
            await axios.get(BASE_URL + "/user/chat/getmessg/" + currentChat?._id)
                .then((response) => {
                    setMessages(response.data.messages);
                    setReload(false);
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        getMessages();
    }, [currentChat, Arrivemessage, reload])


    // send the message 
    const sendMessage = async (e) => {
        e.preventDefault();
        if (inputMessage != "") {
            setEmptyInputBox(false)
            // call the api and send message
            let messagePayload = {
                text: inputMessage,
                senderId: Activeuser?._id,
                conversationId: currentChat?._id
            }
            await axios.post(BASE_URL + "/user/chat/savemessg", messagePayload)
                .then((response) => {
                    if (response.data.messageSent) {
                        notifySuccess("message sent successfully");
                        setInputMessage("");
                        setReload(true)
                        const receiverId = currentChat?.members.find(
                            (member) => member !== Activeuser._id
                        );
                        const messageDetails = {
                            senderId: Activeuser?._id,
                            receiverId: receiverId,
                            text: inputMessage
                        }
                        // send message to the server
                        socket.current.emit("send-message", messageDetails);
                    }
                })
                .then(() => {
                    socket.current?.on("get-messages", (data) => {
                        setArriveMessage({
                            senderId: data?.senderId,
                            text: data?.text,
                            createdAt: Date.now()
                        })
                    });
                })
                .catch((error) => {
                    console.log(error)
                })
        } else {
            setEmptyInputBox(true);
        }
    }


    // when someone start the chat then we update the chatt box details section
    const startChatWithSomeOne = async(con) => {
        setCurrentChat(con);
        let friendId = con?.members.find((c) => c !== Activeuser?._id);

        await axios.get(`http://localhost:5000/user/getanother-user/${friendId}`, config)
            .then((response) => {
                setCurrentChatUser(response.data.user);
            })
            .catch((error) => {
                console.log(error)
            })
    }




    return <>
       
       
        <div className="messanger" >
            <div className="chatMenu">
                <div className="heading">Messages</div>
                <div className="chatMenu-wrapper">
                    {
                        conversations.length ?
                            conversations.map((c) => {
                                return (
                                    <div onClick={() => { startChatWithSomeOne(c) }}>
                                        <Conversation conversation={c} currentUser={Activeuser ? Activeuser : null} />
                                    </div>
                                );
                            })
                            :
                            <div className="no-conversation">
                                <div className="image">
                                    <img src={process.env.PUBLIC_URL + "/Photos/webphotos/conversation.svg"} alt="" />
                                </div>
                                <div className="conversation-footer">
                                    <Link className="gotopage-link" to="/app/homepage">start following</Link>
                                </div>
                            </div>
                    }
                </div>
            </div>
        
            {
                currentChat ?
                    <div className="chatBox">
                        <div className="chatBox-wrapper">
                            <div className="chatBox-header">
                                <div className="profile">
                                    <img className="dp" src={process.env.PUBLIC_URL + "/ProfilePhotos/" + currentChattUser?.profilePicture} alt="" />
                                    <h3 className="username">{currentChattUser?.username}</h3>
                                </div>
                                <div className="divider"></div>
                            </div>
                            <div className="chat-container">
                                <ScrollUpButton className="chat-container">
                                    {
                                        messages.map((message) => {
                                            return (

                                                <Message own={message?.senderId === Activeuser?._id} message={message} />
                                            )
                                        })
                                    }
                                </ScrollUpButton>
                            </div>
                            {/* input box */}
                            {showPicker ? <div id="emoji-picker"><Picker
                                width={400} height={400} onEmojiClick={onEmojiClick} /></div> : ""}
                            <div className="chatBox-bottom">
                                <textarea onKeyPress={(event) => event.key === 'Enter' ? sendMessage(event) : null} value={inputMessage} onChange={onMessageTyping} className="text-area" placeholder="type here...."></textarea>
                                {emptyInputBox ?
                                    <button id="disabledButton">🖋</button> : <button onClick={sendMessage} >send</button>}
                                <button className="emoji-btn" onClick={() => setShowPicker(true)} >😮</button>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="start-chatt">
                        <div className="startchatt-container">
                            <div className="start-chatt-image">
                                <img src={process.env.PUBLIC_URL + "/Photos/webphotos/startchatt.svg.svg"} />
                                <p className="start-mssg">start conversation</p>
                            </div>
                        </div>

                    </div>
            }

            {/* show online users */}
            {/* <div className="online-users">
                <div className="onlineUsers-wrapper">
                    <div className="heading">Online</div>
                    {
                        onlineUsers?.map((o)=>{
                            return <ChatOnline onlineUser={o} activeUser={user}/>
                        })
                    }
                </div>
            </div> */}

        </div>




    </>
}


export default Messanger;