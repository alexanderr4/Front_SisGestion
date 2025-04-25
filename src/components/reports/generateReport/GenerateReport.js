import FormGenerateReport from "./FormGenerateReport";
import { useNavigate } from "react-router-dom";

function GenerateReport() {
    const navigate = useNavigate();

    const hadleButtonClickBack = () => {
        navigate(-1)
    }
    return (
        <FormGenerateReport
            hadleButtonClickBack={hadleButtonClickBack}
         />
    );
}

export default GenerateReport;