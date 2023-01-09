import { Workbook, Row } from 'exceljs';
import * as fs from 'node:fs/promises';

// eslint-disable-next-line @typescript-eslint/naming-convention
type item = {
  codigo: string;
  descripcion: string | null;
};

const loadItems = async (
  filename = 'Apoyo Gasto - 31-05 PARTE 1 GINO(Recuperado automáticamente).xlsm'
) => {
  const items: item[] = [];
  const workbook = new Workbook();
  try {
    await workbook.xlsx.readFile(filename);
    const worksheet = workbook.getWorksheet('ITEM WEEKLY');
    worksheet.eachRow({ includeEmpty: false }, (row: Row, rowNumber) => {
      if (rowNumber > 9) {
        items.push({
          codigo: String(row.getCell(1).value),
          descripcion: String(row.getCell(4).value),
        });
      }
    });
    await fs.writeFile('items.json', JSON.stringify(items));
  } catch (e) {
    console.error(e);
  }
};

export default loadItems;
