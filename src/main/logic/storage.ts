import Store from 'electron-store';

const storage = new Store<ExcelStore>();
/* const schema: Schema<Items> = {
  item: [type: 'string', {}]
}; */
const getExcelSheetName = (): string => {
  const defaultName = 'Gasto';
  try {
    const { excelSheetName } = storage.get('options');
    return excelSheetName;
  } catch (error) {
    console.error('getExcelSheetName: ', error);
    storage.set('options.excelSheetName', defaultName);
  }
  return defaultName;
};

const getItemSheetName = (): string => {
  const defaultName = 'ITEM Weekly';
  try {
    const { itemSheetName } = storage.get('options');
    return itemSheetName;
  } catch (error) {
    console.error('getItemSheetName: ', error);
    storage.set('options.itemSheetName', defaultName);
  }
  return defaultName;
};

const getNumberOfRows = (): number => {
  const defaultNumberOfRows = 10;
  try {
    const { numberOfRows } = storage.get('options');
    if (numberOfRows) return numberOfRows;
  } catch (error) {
    console.error('getNumberOfRows: ', error);
    storage.set('options.numberOfRows', defaultNumberOfRows);
  }
  return defaultNumberOfRows;
};
try {
  const { itemSheetName } = storage.get('options');
  if (!itemSheetName) throw Error('NO EXISTE');
} catch (error) {
  console.error('itemSheetName: ', error);
  storage.set('options.itemSheetName', 'ITEM Weekly');
}

try {
  const { excelSheetName } = storage.get('options');
  if (!excelSheetName) throw Error('NO EXISTE');
} catch (error) {
  console.error('excelSheetName: ', error);
  storage.set('options.excelSheetName', 'Gasto');
}
try {
  const items = storage.get('items');
  if (!items) throw Error('NO EXISTE');
} catch (error) {
  console.error('excelSheetName: ', error);
  storage.set('items.error', { descripcion: 'no hay items cargados' });
}
storage.set(
  'data',
  Array(getNumberOfRows())
    .fill(0)
    .map(() => ({})) as Fila[]
);

export { storage, getExcelSheetName, getItemSheetName };
