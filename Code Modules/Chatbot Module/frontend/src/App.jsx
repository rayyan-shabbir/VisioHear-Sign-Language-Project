import { BrowserRouter, Route, Routes } from "react-router-dom";
import Chat from './components/Chat'


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Chat />} path="/" />
      </Routes>
    </BrowserRouter>
  );
}

export default App
