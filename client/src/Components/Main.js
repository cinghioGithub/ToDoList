import { Container, Row, Collapse } from "react-bootstrap";
import { Sidebar, TaskList, AddEditTask, ButtonRounded } from "./";
import { useState, useEffect } from "react";
import API from "../API";
import { useRouteMatch } from "react-router-dom";

export function Main({ ...props }) {
  const { menuFilters, toggle, user } = props;
  const filter = useRouteMatch().params.filter;

  const [tasksList, setTasksList] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(filter ? false : true);
  const [filterLoading, setFilterLoading] = useState(filter ? true : false);
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [taskToEdit, setTaskToEdit] = useState();

  useEffect(() => {
    const getTasks = async () => {
      try {
        let list = [];
        if (!filter) {
          list = await API.getAllTasks();
          setLoading(false);
        } else {
          if (menuFilters.find((item) => item.name === filter)) {
            list = await API.getTasksByFilter(filter);
          } else {
            list = await API.getTasksByFilter("All");
          }
        }
        setTasksList(list);
        if (filterLoading) {
          setFilterLoading(false);
        }
      } catch (err) {
        setError(err.error);
      }
    };
    if (refresh) {
      getTasks();
      setRefresh(false);
    }
  }, [refresh, filter]);

  const selectTaskToEdit = (taskId) => {
    const list = [...tasksList];
    setTaskToEdit(list.filter((task) => task.id === taskId)[0]);
    handleShowNewTask();
  };

  const setTaskCompleted = async (taskId, completed) => {
		setTasksList((tasksList) =>
      tasksList.map((task) =>
        task.id === taskId
          ? Object.assign({}, task, { completed: !completed, edited: true })
          : task
      )
    );
		await API.setTaskCompleted({
			id: taskId,
			completed: completed ? 0 : 1,
		})
    
		setRefresh(true);
  };

  const removeTask = async (id) => {
    setTasksList((taskList) =>
      taskList.map((task) => {
        if (task.id === id) return { ...task, deleted: true };
        else return task;
      })
    );
    await API.deleteTask(id);
    setRefresh(true);
  };

  /* Modal View Handler */
  const handleCloseNewTask = () => {
    setShowModal(false);
    setTaskToEdit();
  };
  const handleShowNewTask = () => {
    setShowModal(true);
  };

  /* TaskList Add/Remove/Edit Handler */
  const editTask = (taskEdit) => {
    setTasksList((tasksList) =>
      tasksList.map((task) =>
        task.id === taskEdit.id ? Object.assign({}, taskEdit) : task
      )
    );
  };

  const addTask = (taskNew) => {
    setTasksList((tasksList) => [...tasksList, taskNew]);
  };

  //const tasks = API.getTasks(filter);
  return (
    <main>
      <Container fluid>
        <Row>
          <Collapse in={toggle}>
            <nav id="toggleMenu" className="col-lg-4 d-lg-block sidebar pt-3">
              <Sidebar
                menuFilters={menuFilters}
                setRefresh={setRefresh}
                filter={filter}
                setFilterLoading={setFilterLoading}
              />
            </nav>
          </Collapse>
          <TaskList
            tasksList={tasksList}
            selectTaskToEdit={selectTaskToEdit}
            removeTask={removeTask}
            setTaskCompleted={setTaskCompleted}
            filter={filter}
            loading={loading}
            error={error}
            filterLoading={filterLoading}
          />
          <ButtonRounded addTaskFunc={handleShowNewTask} />
          <AddEditTask
            user={user}
            editTask={editTask}
            addTask={addTask}
            setRefresh={setRefresh}
            taskToEdit={taskToEdit}
            show={showModal}
            onHide={handleCloseNewTask}
          />
        </Row>
      </Container>
    </main>
  );
}

export default Main;
