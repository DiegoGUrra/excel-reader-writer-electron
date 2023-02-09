import { useState } from 'react';

const Options = () => {
  const [numberOfRows, setNumberOfRows] = useState(
    window.electron.store.get('options.numberOfRows') as number
  );
  const [excelSheetName, setExcelSheetName] = useState('');
  const [itemSheetName, setItemSheetName] = useState('');

  const handleSubmit = () => {
    console.log({ numberOfRows, excelSheetName, itemSheetName });
    if (numberOfRows !== window.electron.store.get('options.numberOfRows')) {
      window.electron.store.set('options.numberOfRows', numberOfRows);
    }
    if (excelSheetName !== '') {
      window.electron.store.set('options.excelSheetName', excelSheetName);
    }
    if (itemSheetName !== '') {
      window.electron.store.set('options.itemSheetName', itemSheetName);
    }
  };
  return (
    <div>
      <h1>Opciones</h1>
      <span />
      <p>Editar opciones</p>
      <form onSubmit={handleSubmit}>
        <div>
          Cantidad de filas por defecto:{' '}
          <input
            type="number"
            id="rows"
            value={numberOfRows}
            onChange={(e) => setNumberOfRows(Number(e.target.value))}
          />
        </div>
        <div>
          Nombre de hoja a guardar Gastos:{' '}
          <input
            type="text"
            id="save-sheet"
            value={excelSheetName}
            onChange={(e) => setExcelSheetName(e.target.value)}
            placeholder={window.electron.store.get('options.excelSheetName')}
          />
        </div>
        <div>
          Nombre de hoja para actualizar Items:{' '}
          <input
            type="text"
            id="item-sheet"
            value={itemSheetName}
            onChange={(e) => setItemSheetName(e.target.value)}
            placeholder={window.electron.store.get('options.itemSheetName')}
          />
        </div>
        <button type="submit" value="Submit">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};
export default Options;
