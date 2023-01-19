import { Workbook, Row } from 'exceljs';
import * as fs from 'node:fs/promises';
import storage from './storage';
// eslint-disable-next-line @typescript-eslint/naming-convention

const loadItems = async (
  filename = 'Apoyo Gasto - 31-05 PARTE 1 GINO(Recuperado automáticamente).xlsm'
) => {
  const items: Items = {};
  const workbook = new Workbook();
  try {
    await workbook.xlsx.readFile(filename);
    const worksheet = workbook.getWorksheet('ITEM WEEKLY');
    worksheet.eachRow({ includeEmpty: false }, (row: Row, rowNumber) => {
      if (rowNumber > 9) {
        items[<string>row.getCell(1).value] = {
          descripcion: String(row.getCell(4).value),
        };
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await fs.writeFile('items.json', JSON.stringify(items));
    storage.set('items', items);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
};

export default loadItems;
