import {BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Taskspages } from "./pages/Taskspages";
import { TasksFormPages } from "./pages/TasksFormPages";
import { TasksbuttonsPages } from "./pages/TasksbuttonsPages";
import { Navigation } from "./componentes/Navigation";
import {Toaster} from "react-hot-toast";

function App(){
  return (
    <BrowserRouter>
      <div className="container mx-auto">
      <Navigation/>
      <Routes>
      <Route path="/" element={<Navigate to="/tasks"/>} />
        <Route path= "/tasks" element={<Taskspages/>} />
        <Route path= "/tasks-create" element={<TasksFormPages/>} />
        <Route path= "/tasks/:id" element={<TasksFormPages/>} />
        <Route path= "/tasks-boton" element={<TasksbuttonsPages/>} />
      </Routes>
      <Toaster/>
      </div>
    </BrowserRouter>
  );
}

export default App;