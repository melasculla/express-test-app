import mysql from 'mysql'

export const db = mysql.createConnection({
   host: process.env.MYSQL_HOST || 'localhost', // Adres bazy danych MySQL
   user: process.env.MYSQL_USER || 'root', // Nazwa użytkownika MySQL
   password: process.env.MYSQL_PASSWORD || '', // Hasło do MySQL (w tym przypadku puste)
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