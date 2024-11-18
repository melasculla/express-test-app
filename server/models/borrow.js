import { db } from '../connection.js';

export const borrowModel = () => {
   const get = (bookId) => {
      return new Promise((resolve, reject) => {
         db.query(`SELECT * FROM wypozyczenia WHERE book_id = ?`, [bookId], (error, results) => {
            if (error) {
               console.error('Database query failed:', error);
               return reject(error);
            }

            resolve(results[0]);
         });
      });
   };

   const create = (userId, bookId) => {
      return new Promise((resolve, reject) => {
         db.query('INSERT INTO wypozyczenia (user_id, book_id) VALUES (?, ?)', [userId, bookId], (error, results) => {
            if (error) {
               console.error('Database query failed:', error);
               return reject(error);
            }

            resolve({ id: results.insertId, });
         });
      });
   };

   const update = (book) => {
      return new Promise((resolve, reject) => {
         // db.query('here update query', user, (error, results) => {
         //    if (error) {
         //       console.error('Database query failed:', error);
         //       return reject(error);
         //    }

         //    resolve({ id: results.insertId, });
         // });
      });
   };

   const remove = (bookId) => {
      return new Promise((resolve, reject) => {
         // db.query('here remove query', user, (error, results) => {
         //    if (error) {
         //       console.error('Database query failed:', error);
         //       return reject(error);
         //    }

         //    resolve({ id: results.insertId, });
         // });
      });
   };

   return {
      get,
      create,
      update,
      remove
   };
};