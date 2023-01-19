import Store from 'electron-store';

/* const schema: Schema<Items> = {
  item: [type: 'string', {}]
}; */
const storage = new Store<Items>();

export default storage;
