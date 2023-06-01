import { useNavigate } from "react-router-dom";

const Room = () => {
  const navigate = useNavigate();
  return (
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
  );
};

export default Room;
