import { getMovies, IGetMoviesResult } from './../api';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { makeImagePath } from '../utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';


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
    top: -100px;
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
    height: 150px;
    font-size: 66px;
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

const offset = 5;

function Home() {
    const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", "nowplaying"], getMovies);
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const increaseIndex = () => {
        if (data) {
            toggleLeaving();
            const totalMovies = data.results.length - 1;
            const maxIndex = Math.ceil(totalMovies / offset) - 1;
            console.log(totalMovies, maxIndex);
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1)); 
        }
    };
    const toggleLeaving = () => setLeaving((prev) => !prev);
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
                            .slice(offset * index, offset * index + offset).
                            map((movie) => (
                                <Box variants={BoxVariants} 
                                key={movie.id} 
                                bgPhoto={makeImagePath(movie.backdrop_path, "w500")} 
                                whileHover="hover" 
                                transition={{type: "tween"}} />
                            ))}
                        </Row>
                    </Slider>
                </AnimatePresence>
                </>
            )}
        </Wrapper>
    );
}

export default Home;