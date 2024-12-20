// Get elements from the DOM
const searchBar = document.getElementById("search-bar");
const movieList = document.getElementById("movie-list");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("error-message");
const movieDetails = document.getElementById("movie-details");
const backButton = document.getElementById("back-button");
const favoriteButton = document.getElementById("favorite-button");
const commentInput = document.getElementById("comment-input");
const submitComment = document.getElementById("submit-comment");
const commentsList = document.getElementById("comments-list");

// API settings
import { apiKey, apiUrl } from './config.js';

// Definition of the query
const query = 'movie/popular'; 
const url = `${apiUrl}/${query}?api_key=${apiKey}`;

// Fetch data from the API
fetch(url)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

fetch(`${apiUrl}/search/movie?api_key=${apiKey}&query=${query}`);

// Variables
let selectedMovie = null;
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Debounce for search bar
searchBar.addEventListener('input', debounce(fetchMovies, 500));

// Fetch movies based on the search query
function fetchMovies() {
  const query = searchBar.value.trim();
  if (!query) return;

  loading.style.display = 'block';
  movieList.innerHTML = '';
  errorMessage.style.display = 'none';

  fetch(`${apiUrl}/search/movie?api_key=${apiKey}&query=${query}`)
    .then(response => response.json())
    .then(data => {
      loading.style.display = 'none';
      if (!data.results || data.results.length === 0) {
        errorMessage.style.display = 'block';
      } else {
        data.results.forEach(movie => displayMovie(movie));
      }
    })
    .catch(error => {
      loading.style.display = 'none';
      errorMessage.style.display = 'block';
      console.error(error);
    });
}

// Fetch and display popular movies for the landing page
function fetchPopularMovies() {
  loading.style.display = 'block';
  movieList.innerHTML = '';

  fetch(`${apiUrl}/movie/popular?api_key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      loading.style.display = 'none';
      if (data.results.length === 0) {
        errorMessage.style.display = 'block';
      } else {
        data.results.forEach(movie => displayMovie(movie));
      }
    })
    .catch(error => {
      loading.style.display = 'none';
      errorMessage.style.display = 'block';
      console.error(error);
    });
}

// Call fetchPopularMovies on page load
window.addEventListener('load', fetchPopularMovies);

// Display each movie in the search results
function displayMovie(movie) {
  const movieItem = document.createElement('div');
  movieItem.classList.add('movie-item');
  const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'default-poster.png';
  movieItem.innerHTML = `
    <img src="${posterPath}" alt="${movie.title}">
    <h3 class="movie-title">${movie.title}</h3>
  `;
  movieItem.addEventListener('click', () => showMovieDetails(movie));
  movieList.appendChild(movieItem);
}

function showMovieDetails(movie) {
  selectedMovie = movie;

  movieDetails.classList.remove("hidden");
  movieList.classList.add("hidden");

  document.getElementById("movie-title").textContent = movie.title;
  document.getElementById("movie-poster").src = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : 'default-poster.png';
  document.getElementById("movie-overview").textContent = movie.overview || 'No description available.';
  document.getElementById("movie-release-date").textContent = movie.release_date || 'Unknown';
  document.getElementById("movie-rating").textContent = movie.vote_average || 'N/A';

  // Fetch "watch providers" using TMDB API (if available)
  fetch(`${apiUrl}/movie/${movie.id}/watch/providers?api_key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      const providers = data.results && data.results.US; // Adjust region as needed
      if (providers && providers.link) {
        document.getElementById("watch-link").innerHTML = `
          <a href="${providers.link}" target="_blank" class="watch-button">Watch Now</a>
        `;
      } else {
        document.getElementById("watch-link").innerHTML = 'Watch options not available.';
      }
    })
    .catch(error => {
      console.error('Error fetching watch providers:', error);
      document.getElementById("watch-link").innerHTML = 'Error loading watch options.';
    });

  displayComments();
  fetch(`${apiUrl}/movie/${movie.id}/videos?api_key=${apiKey}`)
  .then(response => response.json())
  .then(data => {
    const trailer = data.results.find(video => video.type === "Trailer" && video.site === "YouTube");
    if (trailer) {
      document.getElementById("movie-trailer").innerHTML = `
        <iframe width="100%" height="315" 
          src="https://www.youtube.com/embed/${trailer.key}" 
          title="YouTube video player" frameborder="0" allowfullscreen>
        </iframe>`;
    } else {
      document.getElementById("movie-trailer").innerHTML = 'Trailer not available.';
    }
  })
  .catch(error => {
    console.error('Error fetching trailers:', error);
    document.getElementById("movie-trailer").innerHTML = 'Error loading trailer.';
  });

}

// Get the title element
const pageTitle = document.getElementById("page-title");

// Add a click event to the title
pageTitle.addEventListener("click", () => {
  // Reset views
  movieDetails.classList.add("hidden");
  movieList.classList.remove("hidden");
  errorMessage.style.display = "none";
  searchBar.value = ""; // Clear the search bar input

  // Fetch and display popular movies
  fetchPopularMovies();
});


// Display comments for the selected movie
function displayComments() {
  commentsList.innerHTML = '';
  const comments = JSON.parse(localStorage.getItem(`comments-${selectedMovie.id}`)) || [];
  comments.forEach(comment => {
    const commentDiv = document.createElement('div');
    commentDiv.textContent = comment;
    commentsList.appendChild(commentDiv);
  });
}

// Handle comment submission
submitComment.addEventListener('click', () => {
  const comment = commentInput.value.trim();
  if (comment) {
    const comments = JSON.parse(localStorage.getItem(`comments-${selectedMovie.id}`)) || [];
    comments.push(comment);
    localStorage.setItem(`comments-${selectedMovie.id}`, JSON.stringify(comments));
    commentInput.value = '';
    displayComments();
  }
});

// Making the enter key able to submit comment
commentInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent default form submission behavior
    const comment = commentInput.value.trim();
    if (comment) {
      const comments = JSON.parse(localStorage.getItem(`comments-${selectedMovie.id}`)) || [];
      comments.push(comment);
      localStorage.setItem(`comments-${selectedMovie.id}`, JSON.stringify(comments));
      commentInput.value = '';
      displayComments();
    }
  }
});

// Handle favorite button click
favoriteButton.addEventListener('click', () => {
  if (!favorites.includes(selectedMovie.id)) {
    favorites.push(selectedMovie.id);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    favoriteButton.textContent = 'Added to Favorites';
  }
});

// Add event listener for the Enter key on the search bar
searchBar.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent default behavior

    // Reset the view for search
    loading.style.display = 'block'; // Show loading spinner
    errorMessage.style.display = 'none'; // Hide error message
    movieList.innerHTML = ''; // Clear previous search results

    // Switch back to the movie list view if in movie details view
    if (!movieList.classList.contains('hidden')) {
      movieList.classList.remove('hidden');
    }
    movieDetails.classList.add('hidden');

    // Trigger the search
    fetchMovies();
  }
});


// Handle back button click
backButton.addEventListener('click', () => {
  movieDetails.classList.add('hidden');
  movieList.classList.remove('hidden');
});

// Debounce function to limit API calls
function debounce(func, delay) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, arguments), delay);
  };
}
