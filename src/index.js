let selectedFilm = null;

    // Fetch and display movie titles with delete buttons
    fetch('http://localhost:3000/films')
      .then(response => response.json())
      .then(films => {
        const filmList = document.getElementById('films');
        filmList.innerHTML = '';

        films.forEach(film => {
          // Create a list item for each movie
          const li = document.createElement('li');
          li.className = 'film item';
          li.textContent = film.title;

          // Add a delete button
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.style.marginLeft = '10px';
          deleteButton.addEventListener('click', () => deleteFilm(film.id, li));

          // Append the delete button to the film item
          li.appendChild(deleteButton);
          filmList.appendChild(li);

          // Add click event listener to display movie details
          li.addEventListener('click', () => displayFilmDetails(film));

          // Check if the movie is sold out and update UI
          if (film.capacity - film.tickets_sold <= 0) {
            li.classList.add('sold-out'); // Add sold-out class
            deleteButton.disabled = true; // Disable delete button for sold-out movies
          }
        });
      })
      .catch(error => console.error('Error fetching films:', error));

    // Function to display selected film's details in the card
    function displayFilmDetails(film) {
      selectedFilm = film;

      document.getElementById('title').textContent = film.title;
      document.getElementById('runtime').textContent = `${film.runtime} minutes`;
      document.getElementById('film-info').textContent = film.description;
      document.getElementById('showtime').textContent = film.showtime;
      const remainingTickets = film.capacity - film.tickets_sold;
      document.getElementById('ticket-num').textContent = remainingTickets;

      const poster = document.getElementById('poster');
      poster.src = film.poster;
      poster.alt = film.title;

      const buyButton = document.getElementById('buy-ticket');
      buyButton.disabled = remainingTickets <= 0; // Disable if sold out
      buyButton.textContent = remainingTickets > 0 ? 'Buy Ticket' : 'Sold Out'; // Update button text
    }

    // Function to delete a film
    function deleteFilm(filmId, filmElement) {
      fetch(`http://localhost:3000/films/${filmId}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            // Remove the film element from the list
            filmElement.remove();
          } else {
            console.error('Failed to delete the film from the server.');
          }
        })
        .catch(error => console.error('Error deleting film:', error));
    }

    // Add event listener for the "Buy Ticket" button
    document.getElementById('buy-ticket').addEventListener('click', () => {
      if (!selectedFilm) return;

      const remainingTickets = selectedFilm.capacity - selectedFilm.tickets_sold;

      if (remainingTickets > 0) {
        selectedFilm.tickets_sold++;
        document.getElementById('ticket-num').textContent = selectedFilm.capacity - selectedFilm.tickets_sold;

        // Disable the button and mark the movie as sold out if no tickets remain
        if (selectedFilm.capacity - selectedFilm.tickets_sold <= 0) {
          document.getElementById('buy-ticket').disabled = true;
          document.getElementById('buy-ticket').textContent = 'Sold Out';

          // Mark the film as sold out in the films list
          const filmItems = document.querySelectorAll('.film.item');
          filmItems.forEach(item => {
            if (item.textContent.includes(selectedFilm.title)) {
              item.classList.add('sold-out');
            }
          });
        }
      } else {
        alert('Sold out! No more tickets available.');
      }
    });