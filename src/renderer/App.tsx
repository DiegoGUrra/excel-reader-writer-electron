import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import {
  DataSheetGrid,
  Column,
  textColumn,
  keyColumn,
  intColumn,
} from 'react-datasheet-grid';
import 'react-datasheet-grid/dist/style.css';

import icon from '../../assets/icon.svg';
// import './App.css';

const Hello = () => {
  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <div className="Hello">
        <a
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              📚
            </span>
            Read our docs
          </button>
        </a>
        <a
          href="https://github.com/sponsors/electron-react-boilerplate"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="folded hands">
              🙏
            </span>
            Donate
          </button>
        </a>
      </div>
    </div>
  );
};
const Tabla = () => {
  const [data, setData] = useState<Fila[]>([
    {
      codigo: '',
      especialidad: '',
      descripcion: '',
      comentario: '',
      ubicacion: '',
      capataz: '',
      directos: null,
      oficina: null,
      equipos: null,
      total: null,
    },
  ]);

  const columns: Column<Fila>[] = [
    {
      ...keyColumn('codigo', textColumn),
      title: 'Codigo',
    },
    {
      ...keyColumn('especialidad', textColumn),
      title: 'Especialidad',
    },
    {
      ...keyColumn('descripcion', textColumn),
      title: 'Descripción',
    },
    {
      ...keyColumn('comentario', textColumn),
      title: 'Comentario',
    },
    {
      ...keyColumn('ubicacion', textColumn),
      title: 'Ubicación',
    },
    {
      ...keyColumn('capataz', textColumn),
      title: 'Capataz',
    },
    {
      ...keyColumn('directos', intColumn),
      title: 'Directos',
    },
    {
      ...keyColumn('oficina', intColumn),
      title: 'Oficina',
    },
    {
      ...keyColumn('equipos', intColumn),
      title: 'Equipos',
    },
    {
      ...keyColumn('total', intColumn),
      title: 'Total',
    },
  ];

  return (
    <div
    /* style={{
      margin: '50px',
      padding: '50px',
      maxWidth: '900px',
      background: '#f3f3f3',
    }}  */
    >
      <DataSheetGrid value={data} onChange={setData} columns={columns} />
    </div>
  );
};

const Index = () => {
  return (
    <div>
      <Tabla />
      <button type="submit">Guardar Excel</button>
      <button type="button">Borrar</button>
    </div>
  );
};
type Fila = {
  codigo: string | null;
  especialidad: string | null;
  descripcion: string | null;
  comentario: string | null;
  ubicacion: string | null;
  capataz: string | null;
  directos: number | null;
  oficina: number | null;
  equipos: number | null;
  total: number | null;
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
