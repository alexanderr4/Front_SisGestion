import { useEffect, useRef, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { getCancellations } from '../../../api/Cancellations';
import HistoryApproved from './HistoryApproved';
import HistoryRejected from './HistoryRejected';
import "./CancellationHistory.css";

function CancellationHistory() {
    const navigate = useNavigate();
    const data = useRef([]);
    const [loading, setLoading] = useState(false);
    const [activeTabSubject, setActiveTabSubject] = useState('approved');

    useEffect(() => {
        const fetch = async () => {
            await dataCancellations();
        }
        fetch();
    }, []);

    const dataCancellations = async () => {
        setLoading(current => { return true });
        getCancellations()
            .then((response) => {
                data.current = response.data.data;
                setLoading(false);
            }).catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    const hadleButtonClickBack = () => {
        navigate(-1)
    }
    return (
        <div className='container-cancellationHistory'>
            <div className='content-title'>
                <button onClick={() => hadleButtonClickBack()}> <FontAwesomeIcon className="icon-faArrowLeft" icon={faArrowLeft} /> </button>
                <h3>Historial de Cancelaciones</h3>
            </div>
            <div className='conatiner-sub-menu-cancellation-history'>
                <div className='content-sub-menu-cancellation-history'>
                    <Nav className='custom-sub-menu-cancellation-history' variant="tabs" activeKey={activeTabSubject} onSelect={(selectedKey) => setActiveTabSubject(selectedKey)}>
                        <Nav.Item>
                            <Nav.Link eventKey="approved" >Aprovadas</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="rejected">Rechazadas</Nav.Link>
                        </Nav.Item>
                    </Nav>

                </div>
            </div>


            < div className='container-content-history'>
                {activeTabSubject === 'approved' &&  <HistoryApproved data={data.current} loading={loading} />}
                {activeTabSubject === 'rejected' && <HistoryRejected data={data.current} loading={loading} />}	
            </div>
        </div>
    );
}

export default CancellationHistory;