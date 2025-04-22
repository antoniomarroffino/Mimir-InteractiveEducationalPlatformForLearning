import React from "react";
import {QRCodeSVG} from "qrcode.react";
import {AnimatePresence, motion} from "framer-motion";
import {XMarkIcon} from "@heroicons/react/24/solid";

interface QRCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({isOpen, onClose, url}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                >
                    <motion.div
                        className="bg-base-100 rounded-2xl shadow-2xl max-w-lg w-full p-6 text-center relative border-4 border-primary/20"
                        initial={{scale: 0.9, opacity: 0}}
                        animate={{scale: 1, opacity: 1}}
                        exit={{scale: 0.9, opacity: 0}}
                        transition={{duration: 0.3}}
                    >
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 text-base-content/60 hover:text-error"
                        >
                            <XMarkIcon className="h-5 w-5"/>
                        </button>

                        <h3 className="text-2xl font-bold mb-4 text-primary">Scan the QR Code</h3>

                        <div className="flex flex-col items-center gap-6">
                            <div className="p-4 bg-white rounded-xl shadow-lg">
                                <QRCodeSVG value={url} size={300} className="rounded-md"/>
                            </div>

                            <div className="text-center">
                                <p className="text-sm text-base-content/70 mb-2">
                                    Scan with your mobile device or copy the link below
                                </p>
                                <p className="text-xs font-mono bg-base-200 p-3 rounded-lg break-all">
                                    {url}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default QRCodeModal;
