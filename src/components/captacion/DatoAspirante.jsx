export const DatoAspirante = ({titulo, campos}) => {
    return (
        <>
            <h4 style={{
                background: '#cae6fc', 
                height: '60px', 
                lineHeight: '60px', 
                textAlign: 'center'
            }}>
                {titulo}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '25px' }}>
                {campos.map((campo, index) => (
                    <p key={index}><strong>{campo.campo}: </strong>{campo.valor}</p>
                ))}
            </div>
        </>
    )
}