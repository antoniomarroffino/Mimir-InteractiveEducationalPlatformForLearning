import {FaCode, FaGithub, FaHeart, FaInstagram, FaLinkedin} from 'react-icons/fa';
import {motion} from 'framer-motion';
import supsiLogo from '../../assets/supsi-logo.png';
import mimirLogo from '../../assets/mimir-logo.png';

const Footer = () => {
    const developers = [
        {
            name: "Antonio Marroffino",
            instagram: "anto.marro",
            role: "Full Stack Developer",
            github: "https://github.com/antoniomarroffino",
            linkedin: "https://www.linkedin.com/in/antoniomarroffino",
        },
        {
            name: "Luca Fantò",
            instagram: "luca_fanto_",
            role: "Full Stack Developer",
            github: "https://github.com/lucafanto",
            linkedin: "https://www.linkedin.com/in/luca-fant%C3%B2-14197232a/",
        },
    ];

    return (
        <footer className="bg-neutral relative">
            <div
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent"></div>

            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0 bg-pattern"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-start">
                    <motion.div
                        className="flex flex-col items-center gap-6"
                        initial={{opacity: 0, y: 20}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                    >
                        <div className="p-4 bg-neutral-focus/10 rounded-2xl">
                            <img
                                src={supsiLogo}
                                alt="SUPSI Logo"
                                className="h-16 filter brightness-0 invert opacity-90 hover:opacity-100 transition-all duration-300"
                            />
                        </div>
                        <div className="text-neutral-content/70 text-sm text-center leading-relaxed">
                            Scuola Universitaria Professionale<br/>della Svizzera Italiana
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex flex-col items-center gap-8"
                        initial={{opacity: 0, y: 20}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{delay: 0.2}}
                    >
                        <motion.div
                            className="relative p-4 rounded-xl bg-neutral-focus/5 hover:bg-neutral-focus/10 transition-all duration-300"
                            whileHover={{scale: 1.05}}
                        >
                            <img
                                src={mimirLogo}
                                alt="Mimir Logo"
                                className="h-12 object-contain drop-shadow-lg"
                            />
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                        </motion.div>
                        <div className="flex items-center gap-3 text-neutral-content/70">
                            <span>Crafted with</span>
                            <motion.div
                                animate={{scale: [1, 1.2, 1]}}
                                transition={{repeat: Infinity, duration: 2}}
                            >
                                <FaHeart className="text-red-500"/>
                            </motion.div>
                            <span>and</span>
                            <FaCode className="text-primary"/>
                        </div>
                        <div className="text-neutral-content/60 text-sm">
                            &copy; {new Date().getFullYear()} Mimir. All rights reserved.
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex flex-col items-center gap-8"
                        initial={{opacity: 0, y: 20}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{delay: 0.4}}
                    >
                        <h3 className="text-neutral-content font-semibold text-xl">Meet the Team</h3>
                        <div className="flex flex-col gap-8">
                            {developers.map((dev, index) => (
                                <motion.div
                                    key={index}
                                    className="group"
                                    whileHover={{scale: 1.02}}
                                >
                                    <div className="bg-neutral-focus/10 rounded-xl p-4 text-center">
                                        <div className="text-neutral-content font-medium mb-2">{dev.name}</div>
                                        <div className="text-neutral-content/60 text-sm mb-4">{dev.role}</div>
                                        <div className="flex items-center justify-center gap-4">
                                            <a
                                                href={dev.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-neutral-content/60 hover:text-blue-400 transition-colors"
                                            >
                                                <FaLinkedin size={20}/>
                                            </a>
                                            <a
                                                href={dev.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-neutral-content/60 hover:text-white transition-colors"
                                            >
                                                <FaGithub size={20}/>
                                            </a>
                                            <a
                                                href={`https://instagram.com/${dev.instagram}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-neutral-content/60 hover:text-pink-400 transition-colors"
                                            >
                                                <FaInstagram size={20}/>
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
