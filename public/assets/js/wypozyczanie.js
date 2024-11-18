document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');
    const userId = localStorage.getItem('userId');

    const response = await fetch(`https://openlibrary.org/works/${bookId}.json`);
    const book = await response.json();

    const szczegolyContainer = document.getElementById('szczegoly');
    const coverUrl = `https://covers.openlibrary.org/b/id/${book.covers ? book.covers[0] : 'placeholder'}-L.jpg`;
    let description = 'Brak opisu';
    if (book.description) {
        typeof book.description === 'string' ?
            description = book.description :
            description = book.description.value
    }

    szczegolyContainer.innerHTML = `
        <img src="${coverUrl}" alt="Okładka książki" />
        <h1>${book.title}</h1>
        <p>${description}</p>
        <p>Autor: ${book.authors ? book.authors.map(a => a.name).join(', ') : 'Nieznany'}</p>
    `;

    const wypozyczBtn = document.getElementById('wypozyczBtn');

    if (!userId) {
        wypozyczBtn.disabled = true;
        wypozyczBtn.textContent = 'Zaloguj się, aby wypożyczyć';
    }

    // Sprawdzanie statusu wypożyczenia książki
    const statusResponse = await fetch(`http://localhost:3000/api/borrow/status/${bookId}`);
    const statusData = await statusResponse.json();

    if (statusData.borrowed) {
        wypozyczBtn.textContent = 'Książka jest wypożyczona';
        wypozyczBtn.disabled = true;
    } else {
        wypozyczBtn.addEventListener('click', async () => {
            try {
                const borrowResponse = await fetch(`http://localhost:3000/api/borrow/${bookId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId })
                });

                if (borrowResponse.ok) {
                    wypozyczBtn.textContent = 'Książka jest wypożyczona';
                    wypozyczBtn.disabled = true;
                    alert('Książka jest wypożyczona');
                } else {
                    const errorText = await borrowResponse.text();
                    alert(`Błąd: ${errorText}`);
                }
            } catch (error) {
                console.error('Błąd wypożyczania książki:', error);
            }
        });
    }
});