import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPeopleGroup, faChartColumn } from '@fortawesome/free-solid-svg-icons';
import "./Electives.css";

function Electives() {
  const cards = [
    { title: "Ingresar Listas", icon: faPlus },
    { title: "Consultar inscripciones", icon: faPeopleGroup },
    { title: "Verificar duplicados", icon: faChartColumn },
  ];


  return (
    <div className="electives">
      <h4>Gestión de Electivas</h4>
      <p>Administre las inscripciones de cursos electivos</p>
      <p>Seleccione una acción para gestionar las electivas académicas</p>
      <div className='cards-container'>
        {cards.map((card, index) => (
          <div key={index} className="cards">
            <FontAwesomeIcon icon={card.icon} size="2x" className="cards-icono" />
            <h6>{card.title}</h6>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Electives;
