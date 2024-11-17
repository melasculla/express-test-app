// Importowanie wymaganych modułów
import express from 'express'; // Importuje Express - framework do tworzenia serwera HTTP
import bodyParser from 'body-parser'; // Umożliwia przetwarzanie treści JSON i URL-encoded w żądaniach
import cors from 'cors'; // Umożliwia CORS (Cross-Origin Resource Sharing), by API było dostępne z innych domen
// Routes
import authRoutes from './routes/auth.js';

// Tworzenie instancji aplikacji Express
const app = express();

// Dodanie middleware (środków pośredniczących)
app.use(bodyParser.json()); // Automatycznie przetwarza żądania z treścią JSON
app.use(cors()); // Włącza CORS dla wszystkich żądań HTTP, aby API było dostępne z dowolnej domeny
app.use(express.urlencoded({ extended: true })); // Przetwarza żądania z treścią typu application/x-www-form-urlencoded
// app.use(express.static(path.join(__dirname, 'public'))); // Ustawia katalog 'public' jako publiczny, aby serwować statyczne pliki (np. CSS, JS)


app.use('/api/auth', authRoutes);

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
