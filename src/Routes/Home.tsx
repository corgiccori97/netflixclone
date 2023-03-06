import { getMovies } from './../api';
import { useQuery } from '@tanstack/react-query';

function Home() {
    const { data, isLoading } = useQuery(["movies", "nowplaying"], getMovies);
    console.log(data, isLoading);
    return (
        <div style={{ backgroundColor: "whitesmoke", height: "200vh"}}></div>
    );
}

export default Home;