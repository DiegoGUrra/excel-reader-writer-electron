import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Tabla from './tabla';
import loadItems from '../logic/excel';

const Index = () => {
  return (
    <div>
      <Tabla />
      <button
        type="submit"
        onClick={() => {
          console.log(window.electron.store.get('items'));
        }}
      >
        Guardar Excel
      </button>
      <button type="button">Borrar</button>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
      </Routes>
    </Router>
  );
}
