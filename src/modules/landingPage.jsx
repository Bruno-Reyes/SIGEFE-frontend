import React from 'react';

const LandingPage = () => {
    const handleLogin = () => {
        // Envía al usuario a la página de inicio de sesión
        window.location.href = '/login';
        
    };

    return (
        <div style={styles.container}>
            <h1>Bienvenido a SIGEFE</h1>
            <button onClick={handleLogin} style={styles.button}>
                Iniciar Sesión
            </button>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '20px',
    },
};

export default LandingPage;