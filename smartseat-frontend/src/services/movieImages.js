const posterMap = {
    interstellar: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    inception: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    'the dark knight': 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    dune: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    oppenheimer: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    avatar: 'https://image.tmdb.org/t/p/w500/kadL4Jf9vR4yE9w3A6YlG3M8yYH.jpg',
    'avengers: endgame': 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    'spider-man: no way home': 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
};

export function getMoviePoster(movie) {
    return posterMap[movie?.title?.trim().toLowerCase()] || movie?.posterUrl || null;
}

export function getMovieBackdrop(movie) {
    return getMoviePoster(movie);
}
