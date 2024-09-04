import React from 'react';
import { Tilt } from 'react-tilt';
import { motion } from 'framer-motion';
import { fadeIn } from '../utils/motion';

const ServiceCard = ({
  index,
  id,
  name,
  description,
  price,
  brand,
  stock, // Changed from stock_quantity to stock
  thumbnailUrl, // Changed from thumbnail_url to thumbnailUrl
  handleClick
}) => {
    const getStockDisplay = () =>{
        if(typeof stock != 'number'){
            return { text: 'Stock information unavailable', color: 'text-gray-500' };
        }

        if(stock <= 10){
            return { text: `Limited Stock available: ${stock}`, color: 'text-red-500' };
        } 
        else{
            return { text: 'In Stock', color: 'text-green-500' };
        }
          
    }

    const stockInfo = getStockDisplay();

  return (
    <Tilt className="xs:w-[250px] w-full" options={{ max: 15, scale: 1.02, speed: 450 }}>
      <motion.div
        variants={fadeIn("right", "spring", 0.5 * index, 0.75)}
        className="w-full p-[1px] rounded-[20px] shadow-card hover:shadow-lg transition-shadow duration-300"
      >
        <div
          className="bg-white rounded-[20px] py-5 px-12 h-[420px] min-h-[280px] flex justify-evenly items-center flex-col"
        >
          <img src={thumbnailUrl} alt={name} className="w-full h-40 object-cover mb-4 rounded-lg"/>
          <h3 className="text-black text-[20px] font-bold text-center">
            {name}
          </h3>
          <p className="text-gray-600 mb-2 text-sm">{description}</p>
          <p className="text-gray-800 font-semibold mb-2">Price: ${price}</p>
          <p className="text-gray-600 mb-2 text-sm">Brand: {brand}</p>
          <p className={`mb-2 text-sm font-semibold ${stockInfo.color}`}>
            {stockInfo.text}
          </p>
          <button
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            onClick={() => handleClick(id)}
          >
            View Details
          </button>
        </div>
      </motion.div>
    </Tilt>
  );
};

export default ServiceCard;