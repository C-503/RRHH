import {BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Taskspages } from "./pages/Taskspages";
import { TasksFormPages } from "./pages/TasksFormPages";
import { TasksbuttonsPages } from "./pages/TasksbuttonsPages";
import { Tasksprestacion } from "./pages/Tasksprestacion";
import { Navigation } from "./componentes/Navigation";
import { TasksReportepages } from "./pages/TasksReportepages";
import { TasksReporte } from "./pages/TasksReporte";
import { TasksIndem } from "./pages/TasksIndem";
import { TasksClem } from "./pages/TasksClem";
import  TasksIndemPages  from "./pages/TasksIndemPages";
import  TasksListPrestaciones  from "./pages/TasksListPrestaciones";
import  TasksNominaPages  from "./pages/TasksNominaPages";
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
    <Route path= "/tasks-boton/:id" element={<TasksbuttonsPages/>} />
    <Route path= "/tasks-boton/:id/:nomina_id?" element={<TasksbuttonsPages/>} />
    <Route path= "/tasks-prestacion/:id/:prestacion_dias_id?" element={<Tasksprestacion/>} />
    <Route path= "/tasks-prestacion-create/:id" element={<Tasksprestacion/>} />
    <Route path="/tasks-list-prestaciones/:id" element={<TasksListPrestaciones />} />
    <Route path="/reportes/:id" element={<TasksReportepages />} />
    <Route path="/tasks-reporte-create/:id" element={<TasksReporte />} />
    <Route path="/tasks-reporte/:id/:reporte_id?" element={<TasksReporte />} />
    <Route path="/tasks-clemonoit503" element={<TasksClem />} />
    <Route path="/tasks-indem-pages" element={<TasksIndemPages />} />
    <Route path="/tasks-indem" element={<TasksIndem />} />
    <Route path="/tasks-indem/:id" element={<TasksIndem />} />
    <Route path="/tasks-nomina/:id_empleado" element={<TasksNominaPages />} />
</Routes>
      <Toaster/>
      </div>
    </BrowserRouter>
  );
}

export default App;