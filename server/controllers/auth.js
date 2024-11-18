import bcrypt from 'bcrypt'; // Służy do bezpiecznego hashowania haseł
import { userModel } from '../models/user.js';

export const register = async (req, res) => {
   const body = req.body;

   if (!body.username || !body.email || !body.password)
      return res.status(400).send('Bad Request');

   try {
      const user = await userModel().get('name', body.username); // 'Użytkownik z podanym adresem e-mail lub nazwą już istnieje'
      if (user)
         return res.status(409).send('User Already Exists');
   } catch (err) {
      console.error(err);
      return res.status(500).send(err.message); // 'Użytkownik z podanym adresem e-mail lub nazwą już istnieje'
   }

   const isPasswordValid = validatePassword(body.password)
   if (!isPasswordValid)
      return res.status(400).send('Hasło musi mieć co najmniej 8 znaków, zawierać wielką i małą literę oraz cyfrę');

   let hashedPassword;
   try {
      hashedPassword = await bcrypt.hash(body.password, 10); // Hashuje hasło dla bezpieczeństwa, używając algorytmu bcrypt  
   } catch (err) {
      console.error(`[BCRYPT ERROR]: ${err}`);
      return res.status(500).send(`[BCRYPT ERROR]: ${err.message}`);
   }

   try {
      const result = await userModel().create({
         nazwa: body.username,
         e_mail: body.email,
         haslo: hashedPassword,
         wypozyczenia: 0
      });
      return res.status(200).json(result)
   } catch (err) {
      console.error(err);
      return res.status(500).send(err.message);
   }
}
// Funkcja walidująca hasło użytkownika według określonych zasad bezpieczeństwa
function validatePassword(password) {
   const minLength = 8; // Wymaga co najmniej 8 znaków
   const hasUpperCase = /[A-Z]/.test(password); // Wymaga co najmniej jednej wielkiej litery
   const hasLowerCase = /[a-z]/.test(password); // Wymaga co najmniej jednej małej litery
   const hasNumber = /\d/.test(password); // Wymaga co najmniej jednej cyfry

   return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber; // Zwraca true, jeśli hasło spełnia wszystkie wymagania
}


export const login = async (req, res) => {
   const body = req.body;

   if (!body.username || !body.password)
      return res.status(400).send('Bad Request');

   let user;
   try {
      user = await userModel().get('name', body.username);
      if (!user)
         return res.status(404).send('User Not Found');
   } catch (err) {
      console.error(err);
      return res.status(500).send(err.message);
   }

   try {
      const isPasswordCorrect = await bcrypt.compare(body.password, user.haslo);
      if (!isPasswordCorrect)
         return res.status(401).send('Wrong Password');
   } catch (err) {
      console.error(`[BCRYPT ERROR]: ${err}`);
      return res.status(500).send(`[BCRYPT ERROR]: ${err.message}`);
   }

   return res.status(200).json({ message: 'Zalogowano pomyślnie', userId: user.id });
}