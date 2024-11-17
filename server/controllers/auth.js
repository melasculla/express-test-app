import bcrypt from 'bcrypt'; // Służy do bezpiecznego hashowania haseł
import { userModel } from '../models/user.js';

export const login = async () => {

}

export const register = async (req, res) => {
   // const userId = +req.params.userId;
   const { username, email, password } = req.body;

   if (!username || !email || !password)
      throw res.status(400).send('Bad Request');

   try {
      const user = await userModel().get(email);
      // 'Użytkownik z podanym adresem e-mail lub nazwą już istnieje'
      return user ?? res.status(404).send('User Not Found');
   } catch (err) {
      throw res.status(500).send(err.message);
      // 'Użytkownik z podanym adresem e-mail lub nazwą już istnieje'
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


// // Endpoint do rejestracji nowego użytkownika
// app.post('/register', async (req, res) => {
//    const { username, email, password } = req.body; // Pobiera dane z ciała żądania (JSON)

//    // Sprawdza, czy podany e-mail lub nazwa użytkownika już istnieją w bazie danych
//    db.query('SELECT * FROM users WHERE e_mail = ? OR nazwa = ?', [email, username], async (err, results) => {
//        if (err) {
//            console.error('Błąd zapytania:', err);
//            return res.status(500).send('Błąd serwera'); // Zwraca błąd serwera przy problemie z zapytaniem
//        }

//        if (results.length > 0) { // Jeśli istnieje użytkownik o tej nazwie lub e-mailu
//            return res.status(400).send('Użytkownik z podanym adresem e-mail lub nazwą już istnieje');
//        }

//        // Waliduje hasło według wymagań bezpieczeństwa
//        if (!validatePassword(password)) {
//            return res.status(400).send('Hasło musi mieć co najmniej 8 znaków, zawierać wielką i małą literę oraz cyfrę');
//        }

//        try {
//            const hashedPassword = await bcrypt.hash(password, 10); // Hashuje hasło dla bezpieczeństwa, używając algorytmu bcrypt

//            const user = { nazwa: username, e_mail: email, haslo: hashedPassword, wypozyczenia: 0 }; // Przygotowuje nowego użytkownika do zapisania w bazie
//            db.query('INSERT INTO users SET ?', user, (err, results) => {
//                if (err) {
//                    console.error('Błąd podczas dodawania użytkownika:', err);
//                    return res.status(500).send('Błąd serwera');
//                }
//                res.send('Użytkownik został zarejestrowany pomyślnie'); // Wysyła potwierdzenie udanej rejestracji
//            });
//        } catch (error) {
//            console.error('Błąd podczas hashowania hasła:', error);
//            res.status(500).send('Błąd serwera');
//        }
//    });
// });

// // Endpoint do logowania użytkownika
// app.post('/login', (req, res) => {
//    const { username, password } = req.body; // Pobiera dane logowania z żądania

//    db.query('SELECT * FROM users WHERE nazwa = ?', [username], async (err, results) => { // Szuka użytkownika o danej nazwie
//        if (err) {
//            console.error('Błąd podczas logowania:', err);
//            return res.status(500).send('Błąd serwera');
//        }

//        if (results.length > 0) { // Jeśli użytkownik istnieje
//            const user = results[0];
//            const isPasswordCorrect = await bcrypt.compare(password, user.haslo); // Porównuje hasło z zaszyfrowaną wersją w bazie

//            if (isPasswordCorrect) {
//                res.json({ message: 'Zalogowano pomyślnie', userId: user.id }); // Sukces logowania
//            } else {
//                res.status(401).send('Nieprawidłowa nazwa użytkownika lub hasło'); // Błąd, gdy hasło jest niepoprawne
//            }
//        } else {
//            res.status(401).send('Nieprawidłowa nazwa użytkownika lub hasło'); // Błąd, gdy użytkownik nie istnieje
//        }
//    });
// });