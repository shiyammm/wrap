import React from "react";
import Hero from "./Hero";
import BestGiftsSection from "./BestGifts";

const HomePage = () => {
    return (
        <div className="container mx-auto">
            <Hero />
            <BestGiftsSection />
        </div>
    );
};

export default HomePage;
