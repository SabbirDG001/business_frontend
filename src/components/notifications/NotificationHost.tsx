import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNotification } from '../../hooks/useNotification';
import { Notification } from '../../context/NotificationContext';

const SuccessIcon = () => (
    <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const NotificationToast: React.FC<{ notification: Notification; onRemove: (id: number) => void }> = ({ notification, onRemove }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="w-full max-w-sm p-4 bg-white dark:bg-shrain-dark-gray rounded-lg shadow-lg flex items-start"
        >
            <div className="flex-shrink-0">
                {notification.type === 'success' && <SuccessIcon />}
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.message}</p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
                <button
                    onClick={() => onRemove(notification.id)}
                    className="inline-flex text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300"
                >
                    <span className="sr-only">Close</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </motion.div>
    );
};


const NotificationHost: React.FC = () => {
    const { notifications, removeNotification } = useNotification();

    return (
        <div className="fixed top-5 right-5 z-[100] w-full max-w-sm space-y-3">
            <AnimatePresence>
                {notifications.map(n => (
                    <NotificationToast key={n.id} notification={n} onRemove={removeNotification} />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default NotificationHost;