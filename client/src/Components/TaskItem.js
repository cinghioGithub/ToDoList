import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser , faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import dayjs from 'dayjs';

export function TaskItem({...props}) {
    const { id, description, urgent, completed, setTaskCompleted, deadline, private_, removeTask, selectTaskToEdit, deleted, edited, isNew} = props;
    return (
        <tr className={`d-flex ${deleted? 'table-danger' : ''} ${ edited? 'table-warning' : ''} ${ isNew ? 'table-success' : ''}`} >
            <td className="col-1 d-flex align-items-center justify-content-center">
                <div className="custom-control custom-checkbox ml-2">
                    <input onChange={() => setTaskCompleted(id, completed)} className="custom-control-input" type="checkbox" id={`checkbox-${id}`} checked={completed} />
                    <label className="custom-control-label" htmlFor={`checkbox-${id}`}><span className="sr-only"></span></label>
                </div>
            </td>
            <td className={`col-4 col-sm-5 col-md-6 col-lg-5 col-xl-6 d-flex align-items-center${urgent ? ' urgent' : ''}`}>{description}</td>
            <td className="col-2 col-sm-1 d-flex align-items-center justify-content-center">{private_ ? <FontAwesomeIcon icon={faUser}/> : ""}</td>
            <td className="col-3 col-sm-4 col-md-3 col-lg-4 col-xl-3 d-flex align-items-center justify-content-end text-right">{deadline ? dayjs(deadline).format('ddd DD MMM YYYY HH:mm') : ''}</td>
            <td className="col-2 col-sm-1 d-flex align-items-center justify-content-center">
                <FontAwesomeIcon className="text-warning mr-1" icon={faPencilAlt} onClick={() => selectTaskToEdit(id)} />
                <FontAwesomeIcon className="text-danger ml-1" icon={faTrash} onClick={() => removeTask(id)} />
            </td>
        </tr>
    );
}

export default TaskItem;