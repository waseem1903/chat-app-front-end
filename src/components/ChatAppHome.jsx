import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const ChatAppHome = () => {
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const [showRoomPage, setShowRoomPage] = useState(false);
  const [showCreateRoomPage, setShowCreateRoomPage] = useState(false);
  const [showJoinRoomPage, setShowJoinRoomPage] = useState(false);
  // const [roomID, setRoomID] = useState(
  //   `${Math.floor(100000 + Math.random() * 900000)}`
  // );
  const [roomName, setRoomName] = useState("");
  const [fetchedRooms, setFetchedRooms] = useState();
  const [showChatPage, setShowChatPage] = useState(false);
  const [currentRoom, setCurrentRoom] = useState();
  const [activeUsers, setActiveUsers] = useState();
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
    if (error !== "") {
      setError("");
    }
  };

  const handleShowRoomPage = () => {
    if (!userName.trim()) {
      setError("Required *");
    } else {
      setShowRoomPage(!showRoomPage);
    }
  };

  const handleRoomNameChange = (e) => {
    setRoomName(e.target.value);
  };

  const handleCreateRoom = () => {
    if (!roomName.trim()) {
      setError("Required *");
    } else {
      let roomData = {
        userName: userName,
        roomName: roomName,
      };
      socket.emit("createRoom", roomData);
      console.log(showChatPage);
      setShowChatPage(!showChatPage);
      console.log(showChatPage);
    }
  };

  const handleShowJoinRoomPage = async () => {
    try {
      const response = await fetch("http://localhost:5000/rooms");
      const data = await response.json();
      setFetchedRooms(data);
      setShowJoinRoomPage(!showJoinRoomPage);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleJoinRoom = (value) => {
    console.log(value);
    socket.emit("joinRoom", value);
    setShowChatPage(!showChatPage);
    socket.on("roomJoined", (room) => {
      const { roomName, users } = room;
      setCurrentRoom(roomName);
      setActiveUsers(users);
    });
  };

  const handleSendMessage = async () => {
    console.log(message);
    socket.emit("sendMessage", {
      roomName: currentRoom,
      userName: userName,
      message: message,
    });
    // setMessageList((prev) => [...prev, message]);
    setMessage("");
    //  socket.on("recievedMessage", (data) => {
    //     const { message } = data;
    //     setMessageList((list) => [...list, message]);
    //   });
  };

  console.log(messageList);

  useEffect(() => {
    socket.on("recievedMessage", (data) => {
      const { message } = data;
      setMessageList((list) => [...list, message]);
    });
  }, [socket]);

  if (!showRoomPage) {
    return (
      <div className="bg-blue-100 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-8 text-blue-900">
            Welcome to the Chat App!
          </h1>
          <label htmlFor="userName" className="text-lg block mb-4">
            User Name
          </label>
          <input
            type="text"
            name="userName"
            placeholder="Enter your name"
            value={userName}
            onChange={handleUserNameChange}
            className="w-full rounded-lg p-2 border border-2 border-blue-300 focus:outline-blue-500"
          />
          {error && <p className="text-red-500">{error}</p>}
          <div>
            <button
              onClick={handleShowRoomPage}
              className="w-full bg-sky-500 text-white rounded-lg px-4 py-2 mt-4 hover:bg-sky-700"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  } else if (showRoomPage && !showCreateRoomPage && !showJoinRoomPage) {
    return (
      <div className="bg-blue-100 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-lg mr-5">
          <button
            onClick={() => setShowCreateRoomPage(!showCreateRoomPage)}
            className="outline outline-sky-300 text-cyan-500 rounded-lg p-10 hover:bg-sky-300 hover:outline-0 hover:text-white"
          >
            Create a room
          </button>
        </div>
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <button
            onClick={handleShowJoinRoomPage}
            className="outline outline-sky-300 text-cyan-500 rounded-lg p-10 hover:bg-sky-300 hover:outline-0 hover:text-white"
          >
            Join a room
          </button>
        </div>
      </div>
    );
  } else if (showCreateRoomPage && !showChatPage) {
    return (
      <div className="bg-blue-100 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-8 text-blue-900">Create Room</h1>
          {/* <label htmlFor="roomID" className="text-lg block mb-4">
          Room ID
        </label>
        <input
          readOnly
          type="text"
          name="roomID"
          value={roomID}
          className="w-full rounded-lg p-2 mb-4 border border-2 border-blue-300 focus:outline-blue-500"
        /> */}
          <label htmlFor="roomName" className="text-lg block mb-4">
            Room Name
          </label>
          <input
            type="text"
            name="roomName"
            placeholder="Enter room name"
            value={roomName}
            onChange={handleRoomNameChange}
            className="w-full rounded-lg p-2 mb-4 border border-2 border-blue-300 focus:outline-blue-500"
          />
          <div>
            <button
              onClick={handleCreateRoom}
              className="w-full bg-sky-500 text-white rounded-lg px-4 py-2 hover:bg-sky-700"
            >
              Create room
            </button>
          </div>
        </div>
      </div>
    );
  } else if (showJoinRoomPage && !showChatPage) {
    return (
      <div className="bg-blue-100 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-8 text-blue-900">Join Rooms</h1>
          <div>
            <h2>Available Rooms</h2>
            <ul>
              {fetchedRooms.map((room) => (
                <li
                  key={room.roomID}
                  className="border border-sky-300 p-3 my-3 rounded flex items-center justify-between"
                >
                  <span className="mr-3">{room.roomName}</span>
                  <button
                    onClick={() =>
                      handleJoinRoom({
                        roomId: room.roomID,
                        username: userName,
                      })
                    }
                    className="bg-sky-500 text-white rounded-lg px-4 py-2 hover:bg-sky-700"
                  >
                    Join
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  } else if (showChatPage) {
    return (
      <div className="h-screen">
        <div className="h-1/6 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Welcome {userName}</h2>
            <h2 className="text-lg font-semibold">Room: {currentRoom}</h2>
            <p className="text-gray-600">Active Users: {activeUsers?.length}</p>
          </div>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            onClick={() => setCurrentRoom("")}
          >
            Leave Room
          </button>
        </div>

        <div className="h-5/6 flex">
          <div className="w-1/4 bg-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">Active Users</h3>
            <ul>
              {activeUsers?.map((user, index) => (
                <li key={index}>{user}</li>
              ))}
            </ul>
          </div>
          <div className="w-3/4 h-full">
            <div className="border p-4 h-5/6 mb-4 overflow-y-scroll">
              {messageList?.map((msg, index) => (
                <div key={index}>
                  {/* <span className="font-semibold">{msg.username}: </span> */}
                  <span>{msg}</span>
                </div>
              ))}
            </div>
            <div className="h-20 flex items-end">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border rounded-l px-2 py-1 w-full"
                placeholder="Enter your message..."
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-r"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default ChatAppHome;
