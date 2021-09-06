import { TaskItem } from './';
import { Alert, Spinner, Button } from 'react-bootstrap';

export function TaskList({ ...props }) {
    const { tasksList, selectTaskToEdit, removeTask, setTaskCompleted, filter, loading, error, filterLoading } = props;

    const tasks = [...tasksList].map( (task, key) => <TaskItem key={key} {...task} setTaskCompleted={setTaskCompleted} removeTask={removeTask} selectTaskToEdit={selectTaskToEdit} />);
    return (
        <div className="col-lg-8 pt-3">
            <div className="d-flex justify-content-center align-items-center">
                <h1 className="d-flex justify-content-center">{filter || 'All'}</h1> {filterLoading && <span className="ml-4"><Spinner animation="border" role="status" variant="warning" /> </span>}
            </div>
            
            {loading ? 
                <div className="d-flex justify-content-center align-items-center">
                    <Button variant="primary" size="lg" disabled><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/>Loading...</Button>
                </div>
                :
            <>
                {error && <Alert variant={'warning'}>{error}</Alert>}
                <table className="table">
                    <thead>
                        <tr className="d-flex">
                            <th className="col-1 d-flex align-items-center justify-content-center" scope="col">Done</th>
                            <th className="col-4 col-sm-5 col-md-6 col-lg-5 col-xl-6 d-flex flex-column align-items-center" scope="col">Description</th>
                            <th className="col-2 col-sm-1 d-flex align-items-center justify-content-center" scope="col">Auth</th>
                            <th className="col-3 col-sm-4 col-md-3 col-lg-4 col-xl-3 d-flex align-items-center justify-content-center" scope="col">Date</th>
                            <th className="col-2 col-sm-1 d-flex align-items-center justify-content-center" scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks}
                    </tbody>
                </table>
            </>
            }
        </div>
    );
}

export default TaskList;