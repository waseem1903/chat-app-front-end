import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatAppHome = () => {
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
    if (error !== "") {
      setError("");
    }
  };

  const handleNavigate = () => {
    if (!userName.trim()) {
      setError("Required *");
    } else {
      navigate("/rooms");
    }
  };

  return userName ? (
    <div className="bg-blue-100 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 shadow-lg mr-5">
        <button
          onClick={() => navigate("/createroom")}
          className="outline outline-sky-300 text-cyan-500 rounded-lg p-10 hover:bg-sky-300 hover:outline-0 hover:text-white"
        >
          Create a room
        </button>
      </div>
      <div className="bg-white rounded-lg p-8 shadow-lg">
        <button
          onClick={() => navigate("/joinroom")}
          className="outline outline-sky-300 text-cyan-500 rounded-lg p-10 hover:bg-sky-300 hover:outline-0 hover:text-white"
        >
          Join a room
        </button>
      </div>
    </div>
  ) : (
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
            onClick={handleNavigate}
            className="w-full bg-sky-500 text-white rounded-lg px-4 py-2 mt-4 hover:bg-sky-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAppHome;
