import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // Replace with your server URL

function ChatApp() {
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");
  const [rooms, setRooms] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("roomJoined", (room) => {
      setCurrentRoom(room);
      setActiveUsers(room.users);
    });

    socket.on("activeUsers", (users) => {
      setActiveUsers(users);
    });

    socket.on("message", (message) => {
      setChatMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleRoomNameChange = (e) => {
    setRoomName(e.target.value);
  };

  const handleCreateRoom = () => {
    if (roomName.trim() === "") {
      alert("Please enter a room name");
      return;
    }

    socket.emit("joinRoom", { roomId: null, username });
    setRoomName("");
  };

  const handleJoinRoom = (roomId) => {
    socket.emit("joinRoom", { roomId, username });
  };

  const handleSendMessage = () => {
    if (message.trim() === "") {
      alert("Please enter a message");
      return;
    }

    socket.emit("sendMessage", {
      roomId: currentRoom.roomId,
      username,
      message,
    });
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch("http://localhost:5000/rooms"); // Replace with your server URL
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleRoomCreation = async () => {
    if (roomName.trim() === "") {
      alert("Please enter a room name");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: roomName }),
      });

      if (response.ok) {
        const room = await response.json();
        setCurrentRoom(room);
        setActiveUsers([]);
      } else {
        console.error("Error creating room:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  return (
    <div>
      {!currentRoom ? (
        <div>
          <h1>Enter Your Name</h1>
          <input type="text" value={username} onChange={handleUsernameChange} />
          <input type="text" value={roomName} onChange={handleRoomNameChange} />
          <div>
            <button onClick={handleCreateRoom}>Create a Room</button>
            <button onClick={() => setRoomName("")}>Join a Room</button>
          </div>
          {rooms.length > 0 ? (
            <div>
              <h2>Available Rooms</h2>
              <ul>
                {rooms.map((room) => (
                  <li key={room.roomId}>
                    <span>{room.name}</span>
                    <button onClick={() => handleJoinRoom(room.roomId)}>
                      Join
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No available rooms. Please create one.</p>
          )}
        </div>
      ) : (
        <div>
          <h1>Room: {currentRoom.name}</h1>
          <h2>Active Users</h2>
          <ul>
            {activeUsers.map((user) => (
              <li key={user.socketId}>{user.username}</li>
            ))}
          </ul>
          <div>
            <div>
              {chatMessages.map((msg, index) => (
                <div key={index}>
                  <strong>{msg.username}: </strong>
                  <span>{msg.message}</span>
                </div>
              ))}
            </div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatApp;
