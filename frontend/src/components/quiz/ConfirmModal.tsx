import React from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    children: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
                                                       isOpen,
                                                       onClose,
                                                       onConfirm,
                                                       title,
                                                       children,
                                                       confirmText = 'Confirm',
                                                       cancelText = 'Cancel'
                                                   }) => {
    return (
        <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box">
                <h3 className="font-bold text-lg">{title}</h3>
                <div className="py-4">
                    {children}
                </div>
                <div className="modal-action">
                    <button
                        className="btn btn-ghost"
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default ConfirmModal;