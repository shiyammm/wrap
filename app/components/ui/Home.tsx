import React from "react";
import Hero from "./Hero";
import Footer from "./Footer";
import BestGiftsSection from "./BestGifts";

const HomePage = () => {
    return (
        <div className="container mx-auto" >
            <Hero />
            <BestGiftsSection />
            <Footer />
        </div>
    );
};

export default HomePage;
