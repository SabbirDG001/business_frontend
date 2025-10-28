import React from 'react';
import { motion } from 'framer-motion';

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const ChatWidget: React.FC = () => {
    // This component now links directly to a Facebook Messenger page.
    // The placeholder URL 'shrain.luxury' should be replaced with the actual Facebook page username.
    const facebookMessengerUrl = 'https://m.me/shrain.luxury';

    return (
        <div className="fixed bottom-5 right-5 z-40">
            <motion.a
                href={facebookMessengerUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-shrain-purple text-white p-4 rounded-full shadow-lg flex items-center justify-center"
                aria-label="Message us on Facebook"
            >
                <ChatIcon />
            </motion.a>
        </div>
    );
};

export default ChatWidget;