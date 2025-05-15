import { Spinner } from 'react-bootstrap';
import DataTable from 'react-data-table-component';

function HistoryApproved({ data, loading }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        return formattedDate;
    }

    const columns = [
        {
            name: 'ID',
            selector: row => row.id,
            sortable: true,
            grow: 0.09
        },
        {
            name: 'Estudinate',
            selector: row => row.student.name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            sortable: true,
        },
        {
            name: 'Asignatura',
            selector: row => row.subject.name,
            sortable: true,
        },
        {
            name: 'Fecha de solicitud',
            selector: row => formatDate(row.created_at),
            sortable: true,
        },
        {
            name: 'Fecha de aprobación',
            selector: row => formatDate(row.updated_at),
            sortable: true,
        },
    ]

    const customStyles = {
        table: {
            style: {
                border: 'none', // Borde exterior de toda la tabla
                borderRadius: '5px',
                padding: '1px',
                marginBottom: '2px',
                borderCollapse: 'separate',
                borderBottom: 'solid 1px #000000',
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
        <>
            <h3>Historial de solicitudes aprovadas</h3>
            <div className='content-table'>
                <DataTable
                    data={data.filter(item => item.status === 'approved')}
                    columns={columns}
                    customStyles={customStyles}
                    fixedHeader
                    fixedHeaderScrollHeight={window.innerHeight < 428 ? "calc(100vh - 237px)" : "calc(100vh - 330px)"}
                    noDataComponent={<><br /> No hay datos para mostrar  <br /> <br /></>}
                    progressPending={loading}
                    progressComponent={(
                        <div className="loading-overlay-table">
                            <Spinner animation="border" size="lg" />
                        </div>
                    )}
                />
            </div>
        </>
    );
}

export default HistoryApproved;