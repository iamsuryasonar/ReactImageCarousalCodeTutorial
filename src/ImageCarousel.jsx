import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleChevronLeft,
    faCircleChevronRight,
} from "@fortawesome/free-solid-svg-icons";

function ImageCarousel({ images }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loadedImages, setLoadedImages] = useState([]);
    const containerRef = useRef(null);
    const [startX, setStartX] = useState(null);
    const [swipeType, setSwipeType] = useState("");
    const [direction, setDirection] = useState(null);
    // carousal handlers
    const nextImageHandler = () => {

        setDirection(1); // setting direction of item transition, in this case it is ascending order

        containerRef.current.style.justifyContent = 'flex-start';
        containerRef.current.style.transform = `translate(-100%)`;
        containerRef.current.style.transition = 'transform 700ms ease-in-out';
        setCurrentImageIndex(prev => (Math.abs(prev + 1) % images.length));
    };

    const prevImageHandler = () => {
        if (direction === 1) {

            // while direction is changed justifyContent is set to flex-end 
            // which takes the whole array of divs as it is and places the end of it to the visible viewport (ie. the carousel div)
            // But below you can see just after setting flex-end we are setting translate to 100%
            // this causes the visible viewport to shift one more time unnecessarily.
            // which could be solved by just reversing the translate operation we did, 
            // that is by appending child to end of the containerDiv

            const firstElement = containerRef.current.firstElementChild;
            containerRef.current.appendChild(firstElement);
        }

        setDirection(-1);// setting direction of item transition, in this case it is decending order

        containerRef.current.style.justifyContent = 'flex-end';
        containerRef.current.style.transform = `translate(100%)`;
        containerRef.current.style.transition = 'transform 700ms ease-in-out';
        setCurrentImageIndex(prev => (Math.abs((prev - 1 + images.length) % images.length)));
    };

    //image loading handler
    const handleImageLoad = (index) => {
        setLoadedImages((prevLoadedImages) => [...prevLoadedImages, index]);
    };

    //swipe handlers
    const handleTouchStart = (e) => {
        setStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
        console.log(e)
        if (startX === null) return;
        const currentX = e.touches[0].clientX;
        const diffX = currentX - startX;

        if (diffX > 0) {
            setSwipeType("RIGHT");
        } else if (diffX < 0) {
            setSwipeType("LEFT");
        }
    };

    const handleTouchEnd = (e) => {
        setStartX(null);
        if (swipeType === "RIGHT") {
            prevImageHandler();
        } else if (swipeType === "LEFT") {
            nextImageHandler();
        }
        setSwipeType("");
    };


    const handleTransitionEnd = () => {
        if (containerRef.current) {

            const firstElement = containerRef.current.firstElementChild;// getting the first element
            const lastElement = containerRef.current.lastElementChild;// getting the last element

            if (direction === 1 && firstElement) {
                containerRef.current.appendChild(firstElement);
            }

            if (direction === -1 && lastElement) {
                containerRef.current.prepend(lastElement);
            }

            // translate needs reset after transition but without another transition
            // which is why transition is set to none
            containerRef.current.style.transition = 'none';
            containerRef.current.style.transform = `translate(0)`;
        }
    };

    const jumpToHandler = (index) => {
        if (index < currentImageIndex) {
            prevImageHandler()
        }

        if (index > currentImageIndex) {
            nextImageHandler()
        }
    }

    return (
        <div
            className="container"
            style={{
                width: "50%",
                height: "100px",
                margin: 'auto 40px',
                border: '2px solid yellow'
            }}
        >
            <div
                className="carousel"
                style={{
                    width: "25%",
                    height: "100%",
                    border: "4px solid red",
                    borderRadius: '3px',
                    display: 'flex',
                    position: 'relative',
                }}
            >
                <div
                    className="slider"
                    ref={containerRef}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        position: "relative",
                        transition: "all 700ms",
                    }}
                    onTransitionEnd={handleTransitionEnd}
                >
                    {images?.map((image, index) => {
                        return (
                            <img
                                src={image}
                                key={index}
                                style={{
                                    flexShrink: 0,
                                    flexGrow: 0,
                                    objectFit: "cover",
                                    width: "100%",
                                }}
                                onLoad={() => handleImageLoad(index)}
                            />
                        );
                    })}
                </div>

                {!loadedImages.includes(currentImageIndex) ? (
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            translate: "-50% -50%",
                            color: "#FFFFFF",
                        }}
                    >loading...</div>
                ) : (
                    <></>
                )}

                <div className="controls">
                    <FontAwesomeIcon
                        style={{
                            textDecoration: "none",
                            color: "white",
                            backgroundColor: "transparent",
                            fontSize: "1.875rem",
                            width: "2rem",
                            height: "2rem",
                            position: "absolute",
                            top: "50%",
                            bottom: "50%",
                            left: "5px",
                            transform: "translateY(-50%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        onClick={prevImageHandler}
                        icon={faCircleChevronLeft}
                    />

                    <FontAwesomeIcon
                        style={{
                            color: "white",
                            backgroundColor: "transparent",
                            fontSize: "1.875rem",
                            width: "2rem",
                            height: "2rem",
                            position: "absolute",
                            top: "50%",
                            bottom: "50%",
                            right: "5px",
                            transform: "translateY(-50%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        onClick={nextImageHandler}
                        icon={faCircleChevronRight}
                    />
                </div>
                <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: 0,
                    left: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px'
                }}>
                    {images.map((_, index) => {
                        return (
                            <div
                                key={index}
                                style={{
                                    width: "10px",
                                    height: "10px",
                                    boxShadow: "1px 1px 2px rgba(0,0,0,.9)",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    objectFit: "cover",
                                    ...(currentImageIndex === index
                                        ? {
                                            border: "3px solid white",
                                            backgroundColor: "#ffffff",
                                        }
                                        : {
                                            border: "3px solid gray",
                                        }),
                                }}
                                onClick={() => {
                                    jumpToHandler(index);
                                }}
                            ></div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default ImageCarousel;
