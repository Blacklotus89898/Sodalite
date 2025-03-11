import React, { useState, useEffect } from 'react';
import { useTheme } from '../stores/hooks';

interface VanishingModalProps {
    text: string; // Text to display in the modal
    type?: 'success' | 'error'; // Type of modal (success or error)
    duration?: number; // How long the modal stays visible (in milliseconds)
    onClose?: () => void; // Callback when the modal disappears
}

export const VanishingModal: React.FC<VanishingModalProps> = ({ text, type, duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [shouldRender, setShouldRender] = useState(true); // Determines if the modal is still in the DOM
    const { theme } = useTheme();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false); // Start fade-out animation
            setTimeout(() => {
                setShouldRender(false); // Remove from DOM after animation
                if (onClose) onClose();
            }, 500); // Delay matches the CSS fade-out duration
        }, duration);

        // Cleanup the timer when the component unmounts
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!shouldRender) return null; // Do not render if modal should be removed

    // Add `opacity` transition effect
    const modalStyle = {
        ...modalStyles.modal(type),
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s ease', // Smooth fade-out effect
    };

    return (
        <div style={modalStyles.container}>
            <div style={modalStyle}>
                <p>{text}</p>
            </div>
        </div>
    );
};

export default VanishingModal;

const ModalTrigger: React.FC = () => {
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => {
        setShowModal(true); // Show the modal when the button is clicked
    };

    const handleCloseModal = () => {
        setShowModal(false); // Hide the modal after it vanishes
    };

    return (
        <div>
            <button onClick={handleShowModal} style={buttonStyles}>
                Show Modal
            </button>
            {showModal && (
                <VanishingModal
                    text="This is a dynamic vanishing modal!"
                    type="success" // Can be 'success' or 'error'
                    duration={3000}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

// export default ModalTrigger;

// Styles for the modal
const modalStyles = {
    container: {
        position: 'fixed' as const,
        bottom: '10px', // Bottom-right corner
        right: '10px',
        width: 'auto',
        height: 'auto',
        zIndex: 1000, // Ensure it stays above other content
    },
    modal: (type: 'success' | 'error' | undefined) => ({
        backgroundColor: type === 'success' ? 'green' : type === 'error' ? 'red' : 'white',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'left' as const,
        fontSize: '14px',
    }),
};

const buttonStyles = {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: '#007bff',
    color: 'white',
};

