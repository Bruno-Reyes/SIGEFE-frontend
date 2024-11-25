import { Card } from 'primereact/card';

const InfoCard = ({ title, value, icon }) => {
    return (
        <Card className="p-card" style={{ textAlign: 'center' }}>
            <i className={`pi ${icon}`} style={{ fontSize: '2em', color: 'red' }}></i>
            <h3>{value}</h3>
            <p>{title}</p>
        </Card>
    );
};
