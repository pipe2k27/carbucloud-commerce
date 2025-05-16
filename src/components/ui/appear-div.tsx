import { motion, AnimatePresence } from "framer-motion";

const AppearDiv = ({ children }: any) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeIn", delay: 0.5 }}
        className="mb-[100px]"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AppearDiv;
