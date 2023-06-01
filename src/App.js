import logo from "./logo.svg";
import "./App.css";
import ChatAppHome from "./components/ChatAppHome";
// import { Route, Routes } from "react-router-dom";
// import Room from "./components/room";
// import CreateRoom from "./components/createRoom";
// import ChatApp from "./components/ChatApp";

function App() {
  return (
    <ChatAppHome />
    // <Routes>
    //   <Route path="/" element={<ChatAppHome />} />
    //   <Route path="/rooms" element={<Room />} />
    //   <Route path="/createroom" element={<CreateRoom />} />
    //   <Route />
    // </Routes>
  );
}

export default App;
