import { db } from '../connection.js';

export const userModel = () => {
   const get = async (email) => {
      return db.query('SELECT * FROM users WHERE e_mail = ?', [email]);
   };

   const create = async (user) => {
      db.query('INSERT INTO users SET ?', user);
   };

   return {
      get,
      create
   };
};