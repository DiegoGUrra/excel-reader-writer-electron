import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import React, { useRef, useState } from 'react';

registerAllModules();
type Fila = {
  item: string | null;
  descripcion: string | null;
};
type Cambio = {
  row?: number;
  item?: string;
  nuevoItem?: string;
  descripcion?: string;
  nuevaDescripcion?: string;
};
let items = window.electron.store.get('items');
const ItemTable = () => {
  const [data, setData] = useState(
    Object.keys(items).map((e) => {
      return { item: e, descripcion: items[e].descripcion } as Fila;
    })
  );
  const hotRef = useRef<HotTable>(null);
  // eslint-disable-next-line @typescript-eslint/ban-types
  const [nombreItem, setNombreItem] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cambios, setCambios] = useState([] as Cambio[]);

  const formatString = (str: string): string => {
    return str.replace(/\./g, '\\.');
  };

  const reloadStore = () => {
    const hotTable = hotRef.current?.hotInstance;
    items = window.electron.store.get('items');
    setData(
      Object.keys(items).map((e) => {
        return { item: e, descripcion: items[e].descripcion } as Fila;
      })
    );
    console.log('reloadStore');
    hotTable?.updateSettings({
      data,
    });
    setCambios([] as Cambio[]);
    console.log(cambios);
  };

  const loadItems = () => {
    window.electron.dialog.loadItems();
    reloadStore();
  };
  const guardarCambios = (): void => {
    console.log('cambios a guardar', cambios);
    if (
      cambios.every(
        (e) => e.descripcion === e.nuevaDescripcion && e.item === e.nuevoItem
      )
    )
      return;
    console.log('hay cambios');
    cambios.forEach((e) => {
      if (e.item !== e.nuevoItem) {
        window.electron.store.delete(`items.${formatString(e.item || '')}`);
        console.log('borre');
        if (e.nuevoItem !== null) {
          window.electron.store.set(
            `items.${formatString(e.nuevoItem || '')}`,
            {
              descripcion: e.nuevaDescripcion,
            }
          );
          console.log('agregué');
        }
      } else if (e.descripcion !== e.nuevaDescripcion) {
        console.log('cambio desc');
        window.electron.store.set(`items.${formatString(e.item || '')}`, {
          descripcion: e.nuevaDescripcion,
        });
        console.log(
          window.electron.store.get(`items.${formatString(e.item || '')}`)
        );
      }
    });
    reloadStore();
    // cambios.splice(0, cambios.length);
  };

  const agregarItem = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log(formatString(nombreItem), { descripcion });
    window.electron.store.set(`items.${formatString(nombreItem)}`, {
      descripcion,
    });
    console.log(formatString('1.1'));
    console.log(window.electron.store.get(`items.${formatString('1.1')}`));
    reloadStore();
  };

  return (
    <div>
      <h1>Tabla Items</h1>
      <button type="button" onClick={loadItems} id="load-items">
        Cargar Items de Archivo
      </button>
      <span>
        {' '}
        de la hoja {window.electron.store.get('options.itemSheetName')}
      </span>
      <br />
      <hr />
      <br />
      <form onSubmit={agregarItem} id="form">
        <div>
          Agregar nuevo Item:{' '}
          <input
            type="text"
            id="item"
            placeholder="Item"
            value={nombreItem}
            onChange={(e) => setNombreItem(e.target.value)}
          />{' '}
          Descripción:{' '}
          <input
            type="text"
            id="descripcion"
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>
        <button type="submit" value="Submit" id="submit-button">
          Agregar
        </button>
      </form>
      <br />
      <hr />
      <br />
      <h2>Editar Tabla</h2>
      <p>
        Se puede buscar item mediante el cuadro bajo Item y Descripción <br />
        Para conservar cambios hay que presionar guardar cambios
      </p>
      <button type="button" onClick={guardarCambios} id="save-button">
        Guardar Cambios
      </button>
      <br />
      <HotTable
        data={data}
        colHeaders={['Item', 'Descripción']}
        id="item-table"
        ref={hotRef}
        rowHeaders
        filters
        dropdownMenu
        afterChange={(change) => {
          const hot = hotRef.current?.hotInstance;
          console.log(hot?.getDataAtRow(0));
          change?.forEach(([row, prop, oldValue, newValue]) => {
            if (oldValue !== newValue) {
              console.log({ row, prop, oldValue, newValue });
              const [nombre, des] = hot?.getDataAtRow(row) as [string, string];
              const index = cambios.findIndex((e) => {
                return e.row === row;
              });
              if (index === -1) {
                if (prop === 'item') {
                  setCambios([
                    ...cambios,
                    {
                      row,
                      item: oldValue,
                      nuevoItem: newValue,
                      descripcion: des,
                      nuevaDescripcion: des,
                    } as Cambio,
                  ]);
                } else {
                  setCambios([
                    ...cambios,
                    {
                      row,
                      item: nombre,
                      nuevoItem: nombre,
                      descripcion: oldValue,
                      nuevaDescripcion: newValue,
                    } as Cambio,
                  ]);
                }
              } else {
                // eslint-disable-next-line no-lonely-if
                if (prop === 'item') {
                  setCambios([
                    ...cambios.slice(0, index),
                    {
                      row: cambios[index].row,
                      item: cambios[index].item,
                      nuevoItem: newValue,
                      descripcion: cambios[index].descripcion,
                      nuevaDescripcion: cambios[index].nuevaDescripcion,
                    } as Cambio,
                    ...cambios.slice(index + 1),
                  ]);
                } else {
                  setCambios([
                    ...cambios.slice(0, index),
                    {
                      row: cambios[index].row,
                      item: cambios[index].item,
                      nuevoItem: cambios[index].nuevoItem,
                      descripcion: cambios[index].descripcion,
                      nuevaDescripcion: newValue,
                    } as Cambio,
                    ...cambios.slice(index + 1),
                  ]);
                }
              }
            }
          });
        }}
        licenseKey="non-commercial-and-evaluation"
      />
    </div>
  );
};

export default ItemTable;
