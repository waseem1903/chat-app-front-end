import { useState } from "react";

const CreateRoom = () => {
  const [roomID, setRoomID] = useState(
    `${Math.floor(100000 + Math.random() * 900000)}`
  );
  const [roomName, setRoomName] = useState("");

  const handleRoomNameChange = (e) => {
    setRoomName(e.target.value);
  };

  return (
    <div className="bg-blue-100 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-8 text-blue-900">Create Room</h1>
        <label htmlFor="roomID" className="text-lg block mb-4">
          Room ID
        </label>
        <input
          readOnly
          type="text"
          name="roomID"
          value={roomID}
          className="w-full rounded-lg p-2 mb-4 border border-2 border-blue-300 focus:outline-blue-500"
        />
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
            // onClick={handleNavigate}
            className="w-full bg-sky-500 text-white rounded-lg px-4 py-2 hover:bg-sky-700"
          >
            Create room
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
