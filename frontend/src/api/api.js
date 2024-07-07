const apiHost = process.env.REACT_APP_API_HOST || 'http://localhost:8080';

const createNote = async (payload) => {
    try {
        const response = await fetch(`${apiHost}/note/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw errorData;
        }

        const result = await response.json();
        return result.id;
    } catch (error) {
        throw error;
    }
};

const retrieveNote = async (noteId) => {
    try {
        const response = await fetch(`${apiHost}/note/${noteId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw errorData;
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export { createNote, retrieveNote };