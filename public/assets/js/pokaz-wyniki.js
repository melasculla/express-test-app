document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    const subject = urlParams.get('subject');

    const wynikiContainer = document.getElementById('wyniki');
    wynikiContainer.innerHTML = '';

    try {
        if (!subject && !query)
            return

        // Zapytanie bez limitu, aby pobrać wszystkie książki z kategorii
        const url =
        (subject && `https://openlibrary.org/subjects/${subject}.json?sort=rating&limit=32`) ||
        (query && `https://openlibrary.org/search.json?title=${query}&sort=rating&limit=32`)    

        const response = await fetch(url);
        data = await response.json();
        data = subject ? data.works : data.docs;
        // w API tematu dane są w `works`
        // w API wyszukiwania dane są w `docs`

        if (data && data.length > 0) {
            data.forEach(book => {
                const coverId = book.cover_id || book.cover_i;
                const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : '/assets/images/brak.png';
                const bookId = book.key.includes('/works/') ? book.key.replace('/works/', '') : book.key;

                const rating = book.ratings_average || 0; // domyślnie 0, jeśli brak oceny
                let ratingImage = '/assets/images/05.png'; // Domyślny obraz oceny

                if (rating > 0.5 && rating <= 1) ratingImage = '/assets/images/1.png';
                else if (rating > 1 && rating <= 1.5) ratingImage = '/assets/images/15.png';
                else if (rating > 1.5 && rating <= 2) ratingImage = '/assets/images/2.png';
                else if (rating > 2 && rating <= 2.5) ratingImage = '/assets/images/25.png';
                else if (rating > 2.5 && rating <= 3) ratingImage = '/assets/images/3.png';
                else if (rating > 3 && rating <= 3.5) ratingImage = '/assets/images/35.png';
                else if (rating > 3.5 && rating <= 4) ratingImage = '/assets/images/4.png';
                else if (rating > 4 && rating <= 4.5) ratingImage = '/assets/images/45.png';
                else if (rating > 4.5 && rating <= 5) ratingImage = '/assets/images/5.png';

                const bookElement = document.createElement('div');
                bookElement.innerHTML = `
                    <a href="/ksiazka?id=${bookId}">
                        <img src="${coverUrl}" class="okladka-search" style="min-width:180px; max-width:180px; min-height:271px; max-height:271px;" alt="Okładka książki" />
                        <h2>${book.title}</h2>
                        <p>${book.author_name ? book.author_name.join(', ') : 'Autor nieznany'}</p>
                        <img class='ocena' src="${ratingImage}" alt="Ocena graficzna" />  
                    </a>
                `;
                wynikiContainer.appendChild(bookElement);
            });
        } else {
            wynikiContainer.innerHTML = '<p>Brak wyników do wyświetlenia.</p>';
        }
    } catch (error) {
        console.error('Błąd pobierania wyników:', error);
        wynikiContainer.innerHTML = '<p>Wystąpił błąd podczas pobierania danych.</p>';
    }
});
