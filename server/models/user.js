import { db } from '../connection.js';

export const userModel = () => {
   const get = async (by, column) => {
      return new Promise((resolve, reject) => {
         const searchColumn = by === 'name' ? 'nazwa' : 'e_mail'
         db.query(`SELECT * FROM users WHERE ${searchColumn} = ?`, [column], (error, results) => {
            if (error) {
               console.error('Database query failed:', error);
               return reject(error);
            }

            resolve(results[0]);
         });
      });
   };

   const create = async (user) => {
      return new Promise((resolve, reject) => {
         db.query('INSERT INTO users SET ?', user, (error, results) => {
            if (error) {
               console.error('Database query failed:', error);
               return reject(error);
            }

            resolve({ id: results.insertId, });
         });
      });
   };

   return {
      get,
      create
   };
};