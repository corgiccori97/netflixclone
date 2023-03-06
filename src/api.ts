const API_KEY = "aa33a897bf3e30adf7eaf07f28d9fa85";
const BASE_URL = "https://api.themoviedb.org/3";

export function getMovies() {
    return fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`).then((response) => response.json());
}