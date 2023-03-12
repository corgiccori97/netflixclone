import { getMovies, IGetMoviesResult } from './../api';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { makeImagePath } from '../utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const Wrapper = styled.div`
background: black;
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
    gap: 10px;
    grid-template-columns: repeat(6, 1fr);
    width: 100%;
    position: absolute;
`;

const Box = styled(motion.div)`
    background-color: white;
    height: 150px;
    font-size: 66px;
`;

const Title = styled.h2`
font-size: 68px;
margin-bottom: 20px; 
`;

const Overview = styled.p`
font-size: 30px;
width: 50%;
`;

const rowVariants = {
    hidden: {
        x: window.outerWidth + 10,
    },
    visible: {
        x: 0,
    },
    exit: {
        x: -(window.outerWidth) - 10,
    }
}

function Home() {
    const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", "nowplaying"], getMovies);
    const [index, setIndex] = useState(0);
    const increaseIndex = () => setIndex((prev) => prev + 1);
    console.log(data, isLoading);
    return (
        <Wrapper>
            {isLoading? <Loader></Loader>:(
                <>
                <Banner onClick={increaseIndex} bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
                    <Title>{data?.results[0].title}</Title>
                    <Overview>{data?.results[0].title}</Overview>
                </Banner>
                <AnimatePresence>
                    <Slider>
                        <Row 
                            variants={rowVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            key={index}
                            transition={{type: "tween", duration: 3}}
                        >
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <Box key={i}>{i}</Box>
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