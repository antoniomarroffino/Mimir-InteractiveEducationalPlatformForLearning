import {motion} from 'framer-motion';
import {BsCheckCircle, BsGraphUp} from 'react-icons/bs';

const NoPublicationsPlaceholder: React.FC = () => {
    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
            className="flex flex-col items-center justify-center min-h-screen p-8 text-center"
        >
            <div className="max-w-2xl space-y-6">
                <div className="flex justify-center">
                    <div className="p-6 bg-primary/10 rounded-full">
                        <BsGraphUp className="text-6xl text-primary"/>
                    </div>
                </div>

                <h1 className="text-4xl font-bold text-base-content">
                    No Publications Found
                </h1>

                <p className="text-lg text-base-content/80">
                    It looks like this quiz hasn't been published yet. To view detailed statistics
                    and student performance analytics, you'll need to publish your quiz first.
                </p>

                <div className="mt-8 p-6 bg-base-200 rounded-xl">
                    <h3 className="text-xl font-semibold mb-4">Why publish your quiz?</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-left">
                        <div className="flex items-start gap-3">
                            <BsGraphUp className="text-2xl text-primary mt-1"/>
                            <div>
                                <h4 className="font-semibold">Track Performance</h4>
                                <p className="text-sm opacity-80">Get detailed insights into student answers</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <BsCheckCircle className="text-2xl text-primary mt-1"/>
                            <div>
                                <h4 className="font-semibold">Identify Weaknesses</h4>
                                <p className="text-sm opacity-80">Discover which questions need improvement</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default NoPublicationsPlaceholder;