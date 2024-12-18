export default async (subject, htmlContainer) => {
   if (!subject || !htmlContainer)
      return

   try {
      const response = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=8&sort=rating`);
      const data = await response.json();

      const booksSection = document.querySelector(htmlContainer);
      booksSection.innerHTML = '';

      data.works.forEach(book => {
         const coverId = book.cover_id;
         const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : 'path/to/default-cover.jpg';
         const bookId = book.key.includes('/works/') ? book.key.replace('/works/', '') : book.key;

         const bookElement = document.createElement('div');
         bookElement.classList.add('book-item');

         // Cały element objęty linkiem <a>
         const truncatedTitle = book.title.length > 15 ? book.title.slice(0, 15) + '...' : book.title;
         bookElement.innerHTML = `
               <a href="/ksiazka?id=${bookId}" class="book-link" style="text-decoration: none; color: inherit;">
                   <img src="${coverUrl}" alt="Okładka ${book.title}" class="okladka-ksiazki" style="width: 100%; height: auto; max-height: 200px;" />
                   <h2>${truncatedTitle}</h2>
                   <p>${book.authors && book.authors.length > 0 ? `Autor: ${book.authors[0].name}` : 'Autor nieznany'}</p>
               </a>
           `;
         booksSection.appendChild(bookElement);
      });
   } catch (error) {
      console.error('Błąd ładowania książek sci-fi:', error);
   }
}