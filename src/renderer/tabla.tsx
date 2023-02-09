/* eslint-disable react/button-has-type */
import React, { useState, useRef } from 'react';
// import Select, { GroupBase, SelectInstance } from 'react-select';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { registerAllModules } from 'handsontable/registry';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';

registerAllModules();

type Fila = {
  item: string | null;
  fecha: Date | null;
  especialidad: string | null;
  descripcion: string | null;
  comentario: string | null;
  capataz: string | null;
  ubicacion: string | null;
  noDirecto: number | null;
  directos: number | null;
  oficina: number | null;
  equipos: number | null;
  total: number | null;
};

type Choice = {
  label: string;
  value: number;
};

/*
type SelectOptions = {
  choices: Choice[];
  disabled?: boolean;
}; */
// import './App.css';
const choices: Choice[] = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
  { label: '7', value: 7 },
  { label: '8', value: 8 },
  { label: '9', value: 9 },
  { label: '10', value: 10 },
];
const Tabla = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const data = window.electron.store.get('data');
  // const [newRows, setNewRows] = useState(() => [{} as Fila]);
  const [newRowValue, setNewRowValue] = useState(1);
  const items =
    (window.electron.store.get('items') as Items) ||
    ({
      error: { descripcion: 'no hay info' },
    } as Items);
  const date = new Date();
  const hotRef = useRef<HotTable>(null);
  // const [rowToChange, setRowToChange] = useState(() => -1);
  /*   useEffect(() => {
    while (newRows.length < newRowValue) {
      setNewRows((e) => [...e, {} as Fila]);
      console.log('hola', newRows.length);
    }
    while (newRows.length > newRowValue) {
      setNewRows((e) => e.filter((_: unknown, index: number) => index === 0));
      console.log('alo');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newRowValue]); */
  const addRow = () => {
    // console.log(hotRef.current?.hotInstance?.getData());
    // const hot = hotRef.current?.hotInstance;
    // hot?.setDataAtCell(1, 2, '1');
    hotRef.current?.hotInstance?.alter(
      'insert_row_below',
      hotRef.current?.hotInstance?.countRows(),
      newRowValue
    );
  };

  const handleAddedRows = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewRowValue(Number(e.target.value));
  };
  /*   useEffect(() => {
    const hot = hotRef.current?.hotInstance;
  }); */
  const saveToFile = () => {
    const hotTable = hotRef.current?.hotInstance;
    window.electron.dialog.saveExcel(
      hotTable?.getData(),
      hotTable?.getColHeader()
    );
    /* const filename: string[] | undefined = dialog.showOpenDialogSync({
      properties: ['openFile'],
    }); */
  };
  const borrarData = () => {
    const hotTable = hotRef.current?.hotInstance;
    // console.log(hotTable?.getData(), hotTable?.getColHeader());
    hotTable?.updateSettings({
      data: Array(window.electron.store.get('options.numberOfRows'))
        .fill(0)
        .map(() => ({})) as Fila[],
    });
  };
  function removeBlankRows() {
    window.electron.dialog.removeBlankRow();
  }

  return (
    <div>
      <h1> Tabla Gastos</h1>
      <HotTable
        id="main-table"
        data={data}
        ref={hotRef}
        /* contextMenu={['copy', 'cut']} */
        colHeaders={[
          'Item',
          'Fecha',
          'Especialidad',
          'Descripcion',
          'Comentario',
          'Capataz',
          'Ubicación',
          'No Directo',
          'Directos',
          'Oficina',
          'Equipos',
          'Total',
        ]}
        columns={[
          {
            type: 'dropdown',
            source: Object.keys(items),
            trimDropdown: false,
            visibleRows: 10,
          },
          {
            type: 'date',
            dateFormat: 'DD-MM-YYYY',
            correctFormat: true,
            defaultDate: `${date.getDate()}-${
              date.getMonth() + 1 < 10
                ? '0'.concat(String(date.getMonth() + 1))
                : date.getMonth() + 1
            }-${date.getFullYear()}`,
            setDefaultDate: true,
            datePickerConfig: {
              format: 'DD-MM-YYYY',
              firstDay: 0,
              numberOfMonths: 1,
            },
          },
          {},
          {},
          {},
          {},
          {},
          { type: 'numeric' },
          { type: 'numeric' },
          { type: 'numeric' },
          { type: 'numeric' },
          { type: 'numeric' },
        ]}
        rowHeaders
        persistentState
        renderAllRows={false}
        /* persistentStateLoad={('main-table',hotRef.current?.hotInstance?.getData())} */
        height="auto"
        licenseKey="non-commercial-and-evaluation"
        afterChange={(change, source) => {
          if (source === 'loadData') {
            return;
          }
          change?.forEach(([row, prop, oldValue, newValue]) => {
            if (
              prop === 0 &&
              oldValue !== newValue &&
              newValue in items &&
              newValue != null
            ) {
              console.log(items[newValue].descripcion);
              hotRef.current?.hotInstance?.setDataAtCell(
                row,
                3,
                items[newValue].descripcion
              );
            }
            if (
              Number(prop) > 6 &&
              Number(prop) < 11 &&
              oldValue !== newValue
            ) {
              const rowData: Array<number> = hotRef.current?.hotInstance
                ?.getDataAtRow(row)
                .slice(7, 11) || [0];
              // console.log(rowData);
              hotRef.current?.hotInstance?.setDataAtCell(
                row,
                11,
                rowData[0] + rowData[1] + rowData[2] + rowData[3]
              );
            }
            // console.log(row, prop, oldValue, newValue);
          });
          window.electron.store.set(
            'data',
            hotRef.current?.hotInstance?.getData()
          );
          // console.log(hotRef.current?.hotInstance?.getData());
        }}
      />
      <select value={newRowValue} onChange={handleAddedRows} id="rowValue">
        {choices.map((e) => (
          <option key={e.label} value={e.value}>
            {e.label}
          </option>
        ))}
      </select>
      <button onClick={addRow}>Agregar Fila</button>
      <button type="button" onClick={borrarData}>
        Borrar Filas
      </button>
      <p>
        La información para guardar o borrar filas vacias es en la hoja{' '}
        {window.electron.store.get('options.excelSheetName')}
      </p>
      <p>
        <button
          type="button"
          onClick={() => {
            saveToFile();
          }}
        >
          Guardar a Excel
        </button>
        <button
          type="button"
          onClick={() => {
            removeBlankRows();
          }}
        >
          Borrar Filas vacias de archivo
        </button>
      </p>
    </div>
  );
};

export default Tabla;
