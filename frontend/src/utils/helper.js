export const prettifyError = (error) => {
    if (error.msg) {
        const messages = Object.entries(error.msg).map(([key, value]) => `${key}: ${value}`);
        return messages.length > 1 ? messages : messages[0];
    }
    return 'An unknown error occurred.';
};
