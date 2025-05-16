import { motion, AnimatePresence } from "framer-motion";

const ScaleDiv = ({ children }: any) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="mb-[100px]"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default ScaleDiv;
