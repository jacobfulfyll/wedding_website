"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  index: number
  frontImage: string
  backImage: string
  frontText: string
  backText: string
  link: string
  buttonText: string
}

const Card: React.FC<CardProps> = ({ index, frontImage, backImage, frontText, backText, link, buttonText }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="w-80 h-[60vh] cursor-pointer perspective border border-black rounded-lg"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="w-full h-full relative"
      >
        <motion.div
          className="absolute w-full h-full bg-white rounded-lg shadow-lg flex flex-col justify-between"
          initial={{ opacity: 1 }}
          animate={{ opacity: isHovered ? 0 : 1 }}
          transition={{ duration: 0.2 }}  // Adjusted duration
        >
          <div className="relative w-full h-[80%]">
            <img
              src={frontImage}
              alt={`Photo ${index + 1}`}
              className="rounded-t-lg w-full h-full object-cover"
            />
          </div>
          <h5 className="text-3xl font-semibold mt-2 flex items-center justify-center h-[20%]">{frontText}</h5>
        </motion.div>
        <motion.div
          className="absolute w-full h-full bg-white rounded-lg shadow-lg flex flex-col justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4, delay: isHovered ? 0.2 : 0 }}  // Adjusted duration and delay
        >
          <div className="relative w-full h-[70%]">
            <img
              src={backImage}
              alt={`Thank you photo ${index + 1}`}
              className="rounded-t-lg w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col items-center justify-center h-[30%]">
            <div className="text-xl font-bold">{backText}</div>
            <a href={link} className="elegant-button-primary mt-2 text-md py-3 px-3">
              {buttonText}
            </a>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

interface ComponentProps {
  numberOfCards: number
  frontImages: string[]
  backImages: string[]
  frontTexts: string[]
  backTexts: string[]
  links: string[]
  buttonTexts: string[]
}

export default function Component({ numberOfCards, frontImages, backImages, frontTexts, backTexts, links, buttonTexts }: ComponentProps) {
  return (
    <div className="flex flex-wrap justify-center gap-8">
      {[...Array(numberOfCards)].map((_, index) => (
        <Card 
          key={index} 
          index={index} 
          frontImage={frontImages[index]} 
          backImage={backImages[index]} 
          frontText={frontTexts[index]} 
          backText={backTexts[index]} 
          link={links[index]} 
          buttonText={buttonTexts[index]} 
        />
      ))}
    </div>
  )
}