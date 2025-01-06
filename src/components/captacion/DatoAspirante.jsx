export const DatoAspirante = ({ titulo, campos, link = false }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const handleLinkClick = async (url) => {
    if (url == '/') {
      window.open("about:blank");
    }
    else {
      try {
        const token = JSON.parse(localStorage.getItem('access-token'))
        const response = await fetch(`${API_URL}/captacion/url-sas/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        })

        if (!response.ok) {
          throw new Error("Error en la solicitud");
        }


        const data = await response.json();
        const newLink = data.url_sas; // Suponiendo que el nuevo enlace está en `data.link`

        if (newLink) {
          window.open(newLink, "_blank"); // Abre el nuevo enlace en una nueva pestaña
        } else {
          console.error("El enlace no fue proporcionado en la respuesta");
        }
      } catch (error) {
        console.error("Error en la petición:", error.message);
      }
    }
  };

  return (
    <>
      <h4
        style={{
          background: "#cae6fc",
          height: "60px",
          lineHeight: "60px",
          textAlign: "center",
        }}
      >
        {titulo}
      </h4>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          columnGap: "25px",
        }}
      >
        {campos.map((campo, index) => (
          <p key={index}>
            <strong>{campo.campo}: </strong>
            {link ? (
              <button
                style={{
                  background: "none",
                  color: "blue",
                  textDecoration: "underline",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => handleLinkClick(campo.valor)}
              >
                Ver
              </button>
            ) : (
              campo.valor
            )}
          </p>
        ))}
      </div>
    </>
  );
};

// export const DatoAspirante = ({titulo, campos, link = false}) => {
//   return (
//     <>
//       <h4 style={{
//         background: '#cae6fc', 
//         height: '60px', 
//         lineHeight: '60px', 
//         textAlign: 'center'
//       }}>
//         {titulo}
//       </h4>
//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '25px' }}>
//         {campos.map((campo, index) => (
//           <p key={index}>
//             <strong>{campo.campo}: </strong>
//             {link ? <a href={campo.valor} target="_blank">Ver</a> : campo.valor}
//           </p>
//         ))}
//       </div>
//     </>
//   )
// }