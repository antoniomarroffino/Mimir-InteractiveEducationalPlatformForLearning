import { motion } from 'framer-motion';

export const EmptyBadgeState = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 bg-base-100 rounded-3xl p-12 text-center"
    >
        <div className="max-w-2xl mx-auto">
            <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="text-7xl mb-6"
            >
                🚀
            </motion.div>
            <h3 className="text-3xl font-bold mb-4">Start Your Journey!</h3>
            <p className="text-xl text-base-content/70">
                Your first badge is waiting! Participate in activities and demonstrate your skills to unlock amazing achievements.
            </p>
        </div>
    </motion.div>
);
