import { MenuItem } from './MenuItem';
import { motion } from 'framer-motion';
import * as React from 'react';

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

export const Navigation = () => (
  <motion.ul className="z-20 nav-ul" variants={variants}>
    {itemIds.map((i, index) => (
      <MenuItem item={i} index={index} key={index} />
    ))}
  </motion.ul>
);

const itemIds = [
  {
    nextJsLink: false,
    openInNewPage: true,
    text: `Twitter`,
    href: 'https://twitter.com/theglitches_',
    img: `/glitches/1.png`,
  },
  {
    nextJsLink: false,
    openInNewPage: true,
    text: `Discord`,
    href: 'https://discord.gg/deup5HEAQg',
    img: `/glitches/2.png`,
  },
  {
    nextJsLink: false,
    openInNewPage: true,
    text: `OpenSea`,
    href: 'https://opensea.io/collection/the-glitches-nft',
    img: `/glitches/3.png`,
  },
];
