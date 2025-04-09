import React from "react";
import {QRCodeSVG} from "qrcode.react";

interface QRCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, url }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-base-100 rounded-2xl p-8 max-w-2xl w-full mx-4 relative">
                <button
                    onClick={onClose}
                    className="btn btn-sm btn-circle absolute right-4 top-4"
                >
                    ✕
                </button>
                <h3 className="text-2xl font-bold mb-6 text-center">QR Code</h3>
                <div className="flex flex-col items-center gap-6">
                    <div className="p-6 bg-white rounded-xl shadow-lg">
                        <QRCodeSVG value={url} size={400} className="rounded-lg"/>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-base-content/70 mb-2">Scan with your mobile device</p>
                        <p className="text-xs font-mono bg-base-200 p-3 rounded-lg break-all">
                            {url}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRCodeModal;