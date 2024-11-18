import { userModel } from '../models/user.js';
import { borrowModel } from '../models/borrow.js';

// Endpoint do wypożyczania książki
export const borrow = async (req, res) => {
   // You should get user info from auth cookie (like JWT) or just cookie, not the body
   const userName = req.body.userName;
   const bookId = req.params.id;
   // Also you need remove works from book ID in database
   // Its better to validate ID but for demo thats fine

   if (!userName || !bookId)
      return res.status(400).send('Bad Request');

   let user;
   try {
      user = await userModel().get('name', userName);
      if (!user)
         return res.status(404).send('User Not Found');
   } catch (err) {
      console.error(err);
      return res.status(500).send(err.message);
   }

   try {
      const borrowedBook = await borrowModel().get(bookId);
      if (borrowedBook)
         return res.status(409).send('Book Already Borrowed');
   } catch (err) {
      console.error(err);
      return res.status(500).send(err.message);
   }

   try {
      const result = await borrowModel().create(user.id, bookId);
      return res.status(200).send('Książka została wypożyczona');
   } catch (err) {
      console.error(err);
      return res.status(500).send(err.message);
   }
}

export const status = async (req, res) => {
   const bookId = req.params.id;

   if (!bookId)
      return res.status(400).send('Bad Request');

   try {
      const borrowedBook = await borrowModel().get(bookId);
      return borrowedBook ?
         res.status(200).json({ borrowed: true, userId: borrowedBook.user_id }) :
         res.status(404).json({ borrowed: false });
   } catch (err) {
      console.error(err);
      return res.status(500).send(err.message);
   }
}