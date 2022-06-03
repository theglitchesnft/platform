import { motion } from 'framer-motion';
import * as React from 'react';

const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

const colors = ['#b0e8be', '#9dc4ee', '#baabdc', '#dcabab', '#abbbdc'];

export const MenuItem = ({ item, index }: any) => {
  const style = { background: `${colors[index]}` };
  return (
    <motion.li
      className="nav-li"
      variants={variants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <a
        href={item.href}
        rel={item?.openInNewPage ? 'noopener noreferrer' : ''}
        target={item?.openInNewPage ? '_blank' : ''}
        className="flex items-center w-full"
      >
        <img className="icon-placeholder" src={item.img} style={style} />
        <div
          className="flex justify-center w-full p-1 text-black rounded-lg"
          style={style}
        >
          {item?.text}
        </div>
      </a>
    </motion.li>
  );
};
