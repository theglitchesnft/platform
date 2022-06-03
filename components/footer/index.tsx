import { motion, Variants } from 'framer-motion';

const officialNavigation = {
  main: [
    { name: 'Twitter', href: 'https://twitter.com/theglitches_' },
    { name: 'Discord', href: 'https://discord.gg/deup5HEAQg' },
    { name: 'Github', href: 'https://github.com/theglitchesnft' },
  ],
};

const cardVariants: Variants = {
  offscreen: {
    y: 100,
    opacity: 0,
  },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      bounce: 0.4,
      duration: 1,
    },
  },
};

export function Footer() {
  return (
    <motion.footer
      initial="offscreen"
      whileInView="onscreen"
      className="relative"
      viewport={{ once: true, amount: 0.8 }}
    >
      <motion.div
        className="px-4 py-12 mx-auto overflow-hidden max-w-7xl sm:px-6 lg:px-8"
        variants={cardVariants}
      >
        <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-widest text-gray-200">
          Official Links
        </p>
        <nav
          className="flex flex-wrap justify-center -mx-5 -my-2"
          aria-label="Footer Official Links"
        >
          {officialNavigation.main.map((item) => (
            <div key={item.name} className="px-5 py-2">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={item.href}
                className="text-sm tracking-wide text-amber-400 hover:text-amber-200"
              >
                {item.name}
              </a>
            </div>
          ))}
        </nav>
        <div
          id="disclaimer"
          className="flex flex-col items-center justify-center mt-6 text-xs "
        >
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-200">
            Disclaimer
          </div>
          <div className="max-w-xl text-center text-amber-400">
            web3 products are unregulated and can be highly risky. As such, The
            Glitches makes no representations, warranties, or assurances as to
            the security, currency or accuracy of the features contained on this
            website or any sites linked to or from this website.
          </div>
        </div>
        <div
          id="of-note"
          className="flex flex-col items-center justify-center mt-6 text-xs "
        >
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-200">
            Of Note
          </div>
          <div className="max-w-xl text-center text-amber-400">
            The Glitches does not condone any violence, threats or defamatory
            comments made towards any members of our community. Any such member
            participating in this behavior in the The Glitches channels or in
            any other public channels will not be permitted to participate in
            our community.
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mt-6 text-xs ">
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-200">
            Git Commit Hash
          </div>
          <div className="text-amber-400">
            {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}
          </div>
        </div>
      </motion.div>
    </motion.footer>
  );
}
