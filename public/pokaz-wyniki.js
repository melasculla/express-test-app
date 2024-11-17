document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    const subject = urlParams.get('subject');

    const wynikiContainer = document.getElementById('wyniki');
    wynikiContainer.innerHTML = '';

    try {
        let data;
        if (subject) {
            // Zapytanie bez limitu, aby pobrać wszystkie książki z kategorii
            const response = await fetch(`https://openlibrary.org/subjects/${subject}.json?sort=rating`);
            data = await response.json();
            data = data.works;  // w API tematu dane są w `works`
        } else if (query) {
            const response = await fetch(`https://openlibrary.org/search.json?title=${query}&sort=rating`);
            data = await response.json();
            data = data.docs;  // w API wyszukiwania dane są w `docs`
        }

        if (data && data.length > 0) {
            data.forEach(book => {
                const coverId = book.cover_id || book.cover_i;
                const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : 'zdj/brak.png';

                const rating = book.ratings_average || 0; // domyślnie 0, jeśli brak oceny
                let ratingImage = 'zdj/05.png'; // Domyślny obraz oceny

                if (rating > 0.5 && rating <= 1) ratingImage = 'zdj/1.png';
                else if (rating > 1 && rating <= 1.5) ratingImage = 'zdj/15.png';
                else if (rating > 1.5 && rating <= 2) ratingImage = 'zdj/2.png';
                else if (rating > 2 && rating <= 2.5) ratingImage = 'zdj/25.png';
                else if (rating > 2.5 && rating <= 3) ratingImage = 'zdj/3.png';
                else if (rating > 3 && rating <= 3.5) ratingImage = 'zdj/35.png';
                else if (rating > 3.5 && rating <= 4) ratingImage = 'zdj/4.png';
                else if (rating > 4 && rating <= 4.5) ratingImage = 'zdj/45.png';
                else if (rating > 4.5 && rating <= 5) ratingImage = 'zdj/5.png';

                const bookElement = document.createElement('div');
                bookElement.innerHTML = `
                    <a href="ksiazka.html?id=${book.key}">
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
