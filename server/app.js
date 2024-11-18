// Importowanie wymaganych modułów
import express from 'express'; // Importuje Express - framework do tworzenia serwera HTTP
import bodyParser from 'body-parser'; // Umożliwia przetwarzanie treści JSON i URL-encoded w żądaniach
import cors from 'cors'; // Umożliwia CORS (Cross-Origin Resource Sharing), by API było dostępne z innych domen
// Import Routes
import authRoutes from './routes/auth.js';
import borrowRoutes from './routes/borrow.js';

// Tworzenie instancji aplikacji Express
const app = express();

// Dodanie middleware (środków pośredniczących)
app.use(cors()); // Włącza CORS dla wszystkich żądań HTTP, aby API było dostępne z dowolnej domeny
app.use(bodyParser.json()); // Automatycznie przetwarza żądania z treścią JSON
app.use(express.urlencoded({ extended: true })); // Przetwarza żądania z treścią typu application/x-www-form-urlencoded

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/borrow', borrowRoutes);

// Uruchomienie serwera na porcie 3000
app.listen(3000, () => {
   console.log('Serwer działa na http://localhost:3000'); // Informuje, że serwer jest gotowy do obsługi żądań
});