import { getMovies, IGetMoviesResult } from './../api';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { makeImagePath } from '../utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

const Wrapper = styled.div`
background: black;
padding-bottom: 100px;
`;

const Loader = styled.div`
height: 20vh;
display: flex;
justify-content: center;
align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
height: 100vh;
display: flex;
flex-direction: column;
justify-content: center;
padding: 60px;
background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
url(${(props) => props.bgPhoto});
background-size: cover;
`;

const Slider = styled.div`
    position: relative;
    top: -10vh;
`;

const Row = styled(motion.div)`
    display: grid;
    gap: 5px;
    grid-template-columns: repeat(5, 1fr);
    width: 100%;
    position: absolute;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
    background-color: white;
    background-image: url(${props => props.bgPhoto});
    background-size: cover;
    background-position: center center;
    height: 180px;
    font-size: 66px;
    cursor: pointer;
    &:first-child {
        transform-origin: center left;
    }
    &:last-child {
        transform-origin: center right;
    }
`;

const Title = styled.h2`
font-size: 50px;
margin-bottom: 20px; 
color: white;
`;

const Overview = styled.p`
font-size: 30px;
width: 50%;
color: white;
`;

const Info = styled(motion.div)`
padding: 10px;
background-color: ${props => props.theme.black.lighter};
opacity: 0;
bottom: 0;
width: 100%;
position: absolute;
h4 {
    text-align: center;
    font-size: 14px;
}
`;

const Overlay = styled.div`
position: fixed;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.5);
`;

const BigMovie = styled(motion.div)`
position: fixed;
width: 60vw;
height: 70vh;
top: 0;
bottom: 0;
left: 0;
right: 0;
margin: auto;
`;


const InfoVariants = {
    hover: {
        opacity: 1,
        transition: {
            delay: 0.5,
            duaration: 0.1,
            type: "tween",
        },
    },
}

const rowVariants = {
    hidden: {
        x: window.outerWidth + 5,
    },
    visible: {
        x: 0,
    },
    exit: {
        x: -window.outerWidth - 5,
    }
}

const BoxVariants = {
    hover: {
        scale: 1.3,
        y: -50,
        transition: {
            delay: 0.5,
            duration: 0.3,
            type: "tween",
        },
    },
};

const OverlayVariants = {
    hidden: {opacity: 0},
    visible: {opacity: 0.7},
    exit: {opacity: 0},
};

const offset = 5;

function Home() {
    const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", "nowplaying"], getMovies);
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const history = useHistory();
    const movieClickedMatch = useRouteMatch<{movieId:string}>("/movies/:movieId");
    const onOverlayClick = () => history.goBack();

    const increaseIndex = () => {
        if (data) {
            toggleLeaving();
            const totalMovies = data.results.length - 1;
            const maxIndex = Math.ceil(totalMovies / offset) - 1;
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1)); 
        }
    };
    const toggleLeaving = () => setLeaving((prev) => !prev);

    // 영화이미지 클릭했을 때 상세페이지로 이동
    const onBoxClicked = (movieId:number) => {
        history.push(`/movies/${movieId}`);
    };
    return (
        <Wrapper>
            {isLoading? <Loader></Loader>:(
                <>
                <Banner onClick={increaseIndex} bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
                    <Title>{data?.results[0].title}</Title>
                    <Overview>{data?.results[0].title}</Overview>
                </Banner>
                {/* <AnimatePresence initial={false} onExitComplete={toggleLeaving}> */}
                <AnimatePresence initial={false}>
                    <Slider>
                        <Row 
                            variants={rowVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            key={index}
                            transition={{type: "tween", duration: 1}}
                        >
                            {data?.results
                            .slice(1)
                            .slice(offset * index, offset * index + offset)
                            .map((movie) => (
                                <Box 
                                // layoutId는 string이어야 함
                                layoutId={movie.id+""}
                                variants={BoxVariants} 
                                onClick={() => onBoxClicked(movie.id)}
                                key={movie.id} 
                                bgPhoto={makeImagePath(movie.backdrop_path, "w500")} 
                                whileHover="hover" 
                                transition={{type: "tween"}}>
                                    <Info variants={InfoVariants}>
                                        <h4>
                                        {movie.title}
                                        </h4>
                                    </Info>
                                </Box>
                            ))}
                        </Row>
                    </Slider>
                </AnimatePresence>
                <AnimatePresence>
                    {movieClickedMatch ? (
                        <>
                        <Overlay 
                        onClick={onOverlayClick}
                        />
                        <BigMovie
                        layoutId={movieClickedMatch.params.movieId}
                        />
                        </>
                    ) : null}
                </AnimatePresence>
                </>
            )}
        </Wrapper>
    );
}

export default Home;