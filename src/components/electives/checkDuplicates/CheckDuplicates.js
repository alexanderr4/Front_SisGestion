import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import DataElectives from "./DataElectives";
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTriangleExclamation, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { data, useNavigate } from 'react-router-dom';
import { getEnrollments } from '../../../api/Students';
import { getDatesSemester } from '../../util/Util';
import "./CheckDuplicates.css";


function CheckDuplicates({ electives }) {
  const navigate = useNavigate();
  const [dataElectives, setDataElectives] = useState([]);

  useEffect(() => {
    loadSubjects();
  }, [])

  const loadSubjects = async () => {
    await getEnrollments().then((response) => {
      const { startDate, endDate } = getDatesSemester();
      const dataFilterIsElective = response.data.data.filter(item => (item.subject.is_elective === true));
      const dataFilterActualSemester = dataFilterIsElective.filter(item => ((new Date(item.student.created_at) >= startDate && new Date(item.student.created_at) <= endDate) &&
        (new Date(item.subject.created_at) >= startDate && new Date(item.subject.created_at <= endDate))));
      // setDataElectives(dataFilterActualSemester.filter(student => {
      //   const electiveCount = student.subjects.length;
      //   return electiveCount > 1;
      // })
      //   .map(student => ({
      //     id: student.id,
      //     name: student.name,
      //     electives: student.subjects.filter(sub => sub.is_elective)
      //   })))

//       df_grouped = dataFilterActualSemester.groupby(['student_id', 'student_name'])['elective_name'].apply(list).reset_index()

// df_multiple_electives = df_grouped[df_grouped['elective_name'].apply(len) > 1]
    }).catch((error) => {
      console.error("Error validate fetching subjects:", error);
      setDataElectives([]);
    });
  }

  console.log("chequear eleectivas", dataElectives);
  const hadleButtonClickBack = () => {
    navigate(-1);
  }

  const customStyles = {
    table: {
      style: {
        border: 'none', // Borde exterior de toda la tabla
        borderRadius: '5px',
        padding: '1px',
        marginBottom: '2px',
        borderCollapse: 'separate',
        borderBottom: 'solid 1px #000000',
        width: "auto",
      },
    },

    rows: {
      style: {
        // Cambia este color al que quieras
        borderTop: '1px solid #000000',
        borderBottom: 'none', // Cambia este color al que quieras
      },
    },
  };

  return (
    <div className='content-check-duplicates-electives'>
      <div className='content-title'>
        <button onClick={() => hadleButtonClickBack()}> <FontAwesomeIcon className="icon-faArrowLeft" icon={faArrowLeft} /> </button>
        <h3>Verificación de Duplicados</h3>
      </div>
      <div className='status-check-duplicates'>
        <>
          <div className='content-status-check-duplicates'>
            <FontAwesomeIcon className="icon-status-check-duplicates" icon={faTriangleExclamation} />
            <h3>Atención</h3>
          </div>
          <p>Se han encontrado 4 estudiantes con inscripciones duplicadas de electivas del mismo semestre.</p>
        </>
        <>
          <div className='content-status-check-duplicates'>
            <FontAwesomeIcon className="icon-status-check-duplicates" icon={faCircleCheck} />
            <h3>Todo esta bien</h3>
          </div>
          <p>No se encontraron inscripciones duplicadas. Puedes continuar con tranquilidad.</p>
        </>
      </div>
      <div className='title-and-text-check-duplicates'>
        <h3>Electivas Duplicadas</h3>
        <p>Estudiantes que tienen inscritas dos o más electivas del mismo semestre</p>
        <div className={`number-check-duplicates-${1 ? 'red' : 'green'}`}>
          4 Duplicados encontrados
        </div>
        <div className='content-table-check-duplicates'>
          <DataTable
            customStyles={customStyles}
            noDataComponent={<><br /> No hay datos para mostrar  <br /> <br /></>}
          />
        </div>
      </div>
      <DataElectives />
    </div>
  );
}

export default CheckDuplicates;