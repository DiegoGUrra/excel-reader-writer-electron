type Item = {
  descripcion: string | null;
};
type Items = {
  [index: string]: Item;
};
type Gasto = {
  fecha: object | null;
  especialidad: string | null;
  capataz: string | null;
  item: string | null;
  'no directo': number | null;
  directo: number | null;
  oficina: number | null;
  equipo: number | null;
  total: number | null;
  // eslint-disable-next-line prettier/prettier
  'descripción': string | null;
  comentario: string | null;
  // eslint-disable-next-line prettier/prettier
  'ubicación': string | null;
};
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

type ExcelStore = {
  options: {
    excelSheetName: string;
    numberOfRows: number;
    itemSheetName: string;
  };
  data: Array<Fila>;
  items: Items;
};

type ItemRow = {
  A: string;
  B?: string;
  C?: string;
  D?: string;
};
