import React from 'react';

const LandingPage = () => {
    const handleLogin = () => {
        window.location.href = '/login';
    };

    const handleRegister = () => {
        window.location.href = '/register';
    };

    return (
        <div style={styles.container}>
            {/* Contenido central */}
            <div style={styles.content}>
                <img
                    src="src/assets/Logo_SIGEFE.png"
                    alt="Logo SIGEFE"
                    style={styles.logo}
                />
                <h1 style={styles.title}>Bienvenido a SIGEFE</h1>
                <p style={styles.description}>
                    El Sistema Integral de Gestión Educativa para Figuras Educativas (SIGEFE) es una 
                    plataforma diseñada para apoyar a las figuras educativas en la administración, 
                    seguimiento y optimización de los procesos relacionados con la educación comunitaria.
                </p>
                <p style={styles.description}>
                    SIGEFE está respaldado por CONAFE, el Consejo Nacional de Fomento Educativo, con el 
                    objetivo de fortalecer la educación en las comunidades más vulnerables, promoviendo 
                    el desarrollo social y la igualdad de oportunidades educativas en México.
                </p>
            </div>

            {/* Sidebar derecho */}
            <div style={styles.sidebar}>
                <img
                    src="src/assets/CU001.png"
                    alt="Imagen Educativa"
                    style={styles.sidebarImage}
                />
                <h2 style={styles.sidebarTitle}>¡Accede a tu cuenta!</h2>
                <p style={styles.sidebarText}>
                    Gestiona tus actividades educativas de manera eficiente con SIGEFE.
                </p>
                <button onClick={handleLogin} style={styles.button}>
                    Iniciar Sesión
                </button>
                <button onClick={handleRegister} style={styles.registerButton}>
                    Registrar
                </button>
                <div style={styles.iconsContainer}>
                    <img
                        src="src/assets/Logo_gobierno.png"
                        alt="Ícono 1"
                        style={styles.icon}
                    />
                    <img
                        src="src/assets/Logo_SIGEFE.png"
                        alt="Ícono 2"
                        style={styles.icon}
                    />
                    <img
                        src="src/assets/Logo_CONAFE.png"
                        alt="Ícono 3"
                        style={styles.icon}
                    />
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
        backgroundColor: '#f9f9f9',
        fontFamily: "'Roboto', sans-serif",
        flexWrap: 'wrap', // Permitir que los elementos envuelvan en pantallas pequeñas
    },
    content: {
        flex: 3,
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        minWidth: '300px',
    },
    logo: {
        width: '20%', // Ajusta el tamaño de la imagen de manera relativa
        marginBottom: '20px',
    },
    title: {
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '20px',
    },
    description: {
        fontSize: '18px',
        lineHeight: '1.6',
        color: '#555',
        maxWidth: '600px',
        marginBottom: '20px',
    },
    sidebar: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#007BFF',
        color: '#fff',
        padding: '20px',
        boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.1)',
        minWidth: '300px',
    },
    sidebarImage: {
        width: '100%',
        borderRadius: '15px',
        marginBottom: '20px',
    },
    sidebarTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    sidebarText: {
        fontSize: '16px',
        lineHeight: '1.4',
        textAlign: 'center',
        marginBottom: '20px',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#fff',
        color: '#007BFF',
        border: 'none',
        borderRadius: '5px',
        marginBottom: '10px',
    },
    registerButton: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#f44336',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
    },
    iconsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: '20px',
        width: '100%',
    },
    icon: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#fff',
        padding: '5px',
        margin: '5px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    },
};

export default LandingPage;
