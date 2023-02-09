import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Tabla from './tabla';
import Navbar from './navbar';
import Options from './options';
import ItemTable from './item-table';

const Index = () => {
  return (
    <div>
      <Tabla />
    </div>
  );
};

export default function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/*" element={<Index />} />
          <Route path="/tabla" element={<Tabla />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/options" element={<Options />} />
          <Route path="/item-table" element={<ItemTable />} />
        </Routes>
      </Router>
    </>
  );
}
