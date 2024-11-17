// Importowanie wymaganych modułów
const express = require('express'); // Importuje Express - framework do tworzenia serwera HTTP
const mysql = require('mysql'); // Importuje moduł do połączenia z bazą danych MySQL
const bodyParser = require('body-parser'); // Umożliwia przetwarzanie treści JSON i URL-encoded w żądaniach
const path = require('path'); // Moduł do pracy ze ścieżkami plików
const cors = require('cors'); // Umożliwia CORS (Cross-Origin Resource Sharing), by API było dostępne z innych domen
const bcrypt = require('bcrypt'); // Służy do bezpiecznego hashowania haseł

// Tworzenie instancji aplikacji Express
const app = express();

// Dodanie middleware (środków pośredniczących)
app.use(cors()); // Włącza CORS dla wszystkich żądań HTTP, aby API było dostępne z dowolnej domeny
app.use(bodyParser.json()); // Automatycznie przetwarza żądania z treścią JSON
app.use(express.urlencoded({ extended: true })); // Przetwarza żądania z treścią typu application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, 'public'))); // Ustawia katalog 'public' jako publiczny, aby serwować statyczne pliki (np. CSS, JS)

// Konfiguracja połączenia z bazą danych MySQL
const db = mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost', // Adres bazy danych MySQL
    user: 'test', // Nazwa użytkownika MySQL
    password: '123', // Hasło do MySQL (w tym przypadku puste)
    database: 'biblioteka' // Nazwa bazy danych
});

// Połączenie z bazą danych i obsługa błędów
db.connect((err) => {
    if (err) {
        console.error('Błąd połączenia z bazą danych:', err); // Wyświetla błąd, jeśli połączenie się nie udało
        return; // Zatrzymuje dalsze wykonywanie, jeśli połączenie nie powiodło się
    }
    console.log('Połączono z bazą danych MySQL'); // Informuje o pomyślnym połączeniu z bazą
});

// Funkcja walidująca hasło użytkownika według określonych zasad bezpieczeństwa
function validatePassword(password) {
    const minLength = 8; // Wymaga co najmniej 8 znaków
    const hasUpperCase = /[A-Z]/.test(password); // Wymaga co najmniej jednej wielkiej litery
    const hasLowerCase = /[a-z]/.test(password); // Wymaga co najmniej jednej małej litery
    const hasNumber = /\d/.test(password); // Wymaga co najmniej jednej cyfry

    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber; // Zwraca true, jeśli hasło spełnia wszystkie wymagania
}

// Endpoint do rejestracji nowego użytkownika
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body; // Pobiera dane z ciała żądania (JSON)

    // Sprawdza, czy podany e-mail lub nazwa użytkownika już istnieją w bazie danych
    db.query('SELECT * FROM users WHERE e_mail = ? OR nazwa = ?', [email, username], async (err, results) => {
        if (err) {
            console.error('Błąd zapytania:', err);
            return res.status(500).send('Błąd serwera'); // Zwraca błąd serwera przy problemie z zapytaniem
        }

        if (results.length > 0) { // Jeśli istnieje użytkownik o tej nazwie lub e-mailu
            return res.status(400).send('Użytkownik z podanym adresem e-mail lub nazwą już istnieje');
        }

        // Waliduje hasło według wymagań bezpieczeństwa
        if (!validatePassword(password)) {
            return res.status(400).send('Hasło musi mieć co najmniej 8 znaków, zawierać wielką i małą literę oraz cyfrę');
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10); // Hashuje hasło dla bezpieczeństwa, używając algorytmu bcrypt

            const user = { nazwa: username, e_mail: email, haslo: hashedPassword, wypozyczenia: 0 }; // Przygotowuje nowego użytkownika do zapisania w bazie
            db.query('INSERT INTO users SET ?', user, (err, results) => {
                if (err) {
                    console.error('Błąd podczas dodawania użytkownika:', err);
                    return res.status(500).send('Błąd serwera');
                }
                res.send('Użytkownik został zarejestrowany pomyślnie'); // Wysyła potwierdzenie udanej rejestracji
            });
        } catch (error) {
            console.error('Błąd podczas hashowania hasła:', error);
            res.status(500).send('Błąd serwera');
        }
    });
});

// Endpoint do logowania użytkownika
app.post('/login', (req, res) => {
    const { username, password } = req.body; // Pobiera dane logowania z żądania

    db.query('SELECT * FROM users WHERE nazwa = ?', [username], async (err, results) => { // Szuka użytkownika o danej nazwie
        if (err) {
            console.error('Błąd podczas logowania:', err);
            return res.status(500).send('Błąd serwera');
        }

        if (results.length > 0) { // Jeśli użytkownik istnieje
            const user = results[0];
            const isPasswordCorrect = await bcrypt.compare(password, user.haslo); // Porównuje hasło z zaszyfrowaną wersją w bazie

            if (isPasswordCorrect) {
                res.json({ message: 'Zalogowano pomyślnie', userId: user.id }); // Sukces logowania
            } else {
                res.status(401).send('Nieprawidłowa nazwa użytkownika lub hasło'); // Błąd, gdy hasło jest niepoprawne
            }
        } else {
            res.status(401).send('Nieprawidłowa nazwa użytkownika lub hasło'); // Błąd, gdy użytkownik nie istnieje
        }
    });
});

// Endpoint do wypożyczania książki
app.post('/borrow', (req, res) => {
    const { userId, bookId } = req.body; // Pobiera ID użytkownika i książki z żądania

    console.log("User ID:", userId); // Wyświetla userId dla celów diagnostycznych
    console.log("Book ID:", bookId); // Wyświetla bookId dla celów diagnostycznych

    if (!userId || !bookId) { // Sprawdza, czy dane są kompletne
        return res.status(400).send('Nieprawidłowe dane: brak userId lub bookId');
    }

    // Sprawdza, czy książka jest już wypożyczona
    db.query('SELECT * FROM wypozyczenia WHERE book_id = ?', [bookId], (err, results) => {
        if (err) {
            console.error('Błąd podczas sprawdzania statusu wypożyczenia:', err);
            return res.status(500).send('Błąd serwera');
        }

        if (results.length > 0) { // Jeśli książka jest już wypożyczona, zwraca błąd
            return res.status(400).send('Książka jest już wypożyczona');
        }

        // Jeśli książka jest dostępna, dodaje nowy wpis wypożyczenia
        db.query('INSERT INTO wypozyczenia (user_id, book_id) VALUES (?, ?)', [userId, bookId], (err, results) => {
            if (err) {
                console.error('Błąd podczas dodawania wypożyczenia:', err);
                return res.status(500).send('Błąd serwera');
            }
            res.send('Książka została wypożyczona'); // Potwierdza udane wypożyczenie
        });
    });
});

// Endpoint do sprawdzania statusu wypożyczenia danej książki
app.get('/borrow/status', (req, res) => {
    const { bookId } = req.query; // Pobiera ID książki z parametrów zapytania

    db.query('SELECT * FROM wypozyczenia WHERE book_id = ?', [bookId], (err, results) => { // Sprawdza status wypożyczenia książki
        if (err) {
            console.error('Błąd podczas sprawdzania statusu wypożyczenia:', err);
            return res.status(500).send('Błąd serwera');
        }

        if (results.length > 0) {
            res.json({ borrowed: true, userId: results[0].user_id }); // Zwraca informację, że książka jest wypożyczona
        } else {
            res.json({ borrowed: false }); // Zwraca informację, że książka jest dostępna
        }
    });
});

// Uruchomienie serwera na porcie 3000
app.listen(3000, () => {
    console.log('Serwer działa na http://localhost:3000'); // Informuje, że serwer jest gotowy do obsługi żądań
});
