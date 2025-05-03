import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSheetPlastic, faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Outlet } from 'react-router-dom';
import "./Electives.css";

function Electives() {
  const navigate = useNavigate();
  const pathInitial = window.location.pathname;
  const [activeTab, setActiveTab] = useState(false);
  const cards = [

    { title: "Verificar duplicados", icon: faSheetPlastic },
    { title: "Consultar Electivas", icon: faBookOpen },
  ];


  useEffect(() => {
    const validPaths = ['checkDuplicates', 'consultElectives'];

    if (!validPaths.some(path => pathInitial.includes(path))) {
      setActiveTab(false);
    }
    if (validPaths.some(path => window.location.pathname.includes(path))) {
      setActiveTab(true);
    }
  }, [pathInitial]);

  const handleCardClick = (index) => {
    switch (index) {
      case 0:
        setActiveTab(true);
        navigate('/admin/electives/electiveManagement/checkDuplicates');
        break;
      case 1:
        setActiveTab(true);
        navigate('/admin/electives/electiveManagement/consultElectives');
        break;
      default:
        break;
    }

  }

  if (activeTab) {
    return (
      <>
        <Outlet />
      </>
    )
  }



  return (
    <div className="electives">
      <h4>Gestión de Electivas</h4>
      <p>Administre las inscripciones de cursos electivos</p>
      <p>Seleccione una acción para gestionar las electivas académicas</p>
      <div className='cards-container'>
        {cards.map((card, index) => (
          <div key={index} className="cards" onClick={() => handleCardClick(index)}>
            <FontAwesomeIcon icon={card.icon} size="2x" className="cards-icono" />
            <h6>{card.title}</h6>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Electives;
