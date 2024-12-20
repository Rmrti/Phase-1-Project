##Mutuma's Movie Database
Overview

Mutuma's Movie Database is a web application that allows users to search for movies, view detailed information about them, watch trailers, and leave comments. It also includes a feature to add movies to a favorites list.
Features

    Movie Search: Search for movies using the search bar in the header.
    Movie Details: View detailed information about a selected movie, including its poster, overview, release date, rating, trailer, and watch options.
    Comments: Add comments to movies and view others' comments.
    Favorites: Mark movies as favorites to keep track of them.

Project Structure

/Phase-1-Project
├── index.html        # The main HTML file
├── style.css         # The stylesheet for styling the application
├── index.js          # The main JavaScript file for handling application logic
└── README.md         # Project documentation

Technologies Used

    HTML5: Markup for structuring the application.
    CSS3: Styling the user interface for a modern, clean design.
    JavaScript (ES6): Handles all dynamic functionality, including movie search, fetching details, and managing user interactions.

How to Use

    Clone the repository:

git clone git@github.com:Rmrti/Phase-1-Project.git
cd Phase-1-Project

    Open the Project:

        Open the project folder in Visual Studio Code (or your preferred editor).

    Run a Local Server:

    In Visual Studio Code:
        Right-click on index.html and select "Open with Live Server" (requires the Live Server extension).

    Use the search bar to find movies. A list of matching movies will appear.
d
    Click on a movie to view its details:
        Trailer: A YouTube trailer will be displayed (if available).
        Watch Now: Links to platforms where the movie can be streamed.
        Comments: Add and view comments for the movie.

    Use the "Add to Favorites" button to save the movie to your favorites list.

Key Components
HTML Structure

    Header: Contains the app title and search bar.
    Main Content:
        #movie-list: Displays the list of movies.
        #movie-details: Shows detailed information about a selected movie.

CSS Styling

    Clean, responsive design.
    Styling for movie cards, buttons, and input fields.

JavaScript Functionality

    Dynamic Data Loading: Fetches movie data using an API.
    Event Handling: Handles user actions like searching, viewing details, and adding comments.

Customization

You can modify the following files to customize the app:

    style.css: Update colors, fonts, and layout.
    index.js: Add new features or modify existing ones, such as integrating additional APIs or enhancing user interactions.

Known Issues

    Error Handling: Limited handling for network issues.
    Trailer Availability: Not all movies may have trailers.

Future Improvements

    Add a favorites management page.
    Enhance the UI with animations for a more interactive experience.
    Implement user authentication to save favorites across devices.

License

This project is free to use and edit .
