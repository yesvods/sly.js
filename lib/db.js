import lowdb from 'lowdb';
import storage from 'lowdb/file-sync';
import path from 'path';

const dbpath = path.resolve(__dirname, '../db/db.json');
const db = lowdb(dbpath, {storage});

export default db;
export let mockKey = 'mock';
