import { Modal, Button, Form, Col, Alert, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import API from "../API";

export function AddEditTask({ ...props }) {
  const { addTask, editTask, setRefresh, taskToEdit, onHide, show, user } =
    props;
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  /* Form inputs Handler */
  const [description, setDescription] = useState("");
  const [private_, setPrivate_] = useState(false);
  const [urgent, setUrgent] = useState(false);
  const [enableDeadline, setEnableDeadline] = useState(true);
  const [deadline, setDeadline] = useState("");
  const [time, setTime] = useState("00:00");

  useEffect(() => {
    if (show) {
      console.log(taskToEdit);
      setError();
      setDescription(taskToEdit ? taskToEdit.description : "");
      setPrivate_(taskToEdit ? (taskToEdit.private_ ? true : false) : false);
      setUrgent(taskToEdit ? (taskToEdit.urgent ? true : false) : false);
      setEnableDeadline(taskToEdit ? !taskToEdit.deadline : true);
      setDeadline(
        taskToEdit?.deadline ? taskToEdit.deadline.split(" ")[0] : ""
      );
      setTime(
        taskToEdit?.deadline ? taskToEdit.deadline.split(" ")[1] : "00:00"
      );
    }
  }, [show, taskToEdit]);

  const handleChangeDescription = (event) => {
    setDescription(event.target.value);
  };
  const handleChangePrivate_ = () => {
    setPrivate_((private_) => !private_);
  };
  const handleChangeUrgent = () => {
    setUrgent((urgent) => !urgent);
  };
  const handleChangeDeadline = (event) => {
    setDeadline(event.target.value);
  };
  const handleChangeTime = (event) => {
    setTime(event.target.value);
  };
  const enableDisable = () => {
    setEnableDeadline((enableDeadline) => !enableDeadline);
  };

  /* Form Actions Handler */
  const submitTask = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    setError();
    if (form.checkValidity() === true) {
      setLoading(true);
      if (taskToEdit) {
        const editedTask = {
          id: taskToEdit.id,
          description: description,
          private_: private_ ? 1 : 0,
          urgent: urgent ? 1 : 0,
          deadline: !enableDeadline ? `${deadline} ${time}` : undefined,
          completed: taskToEdit.completed,
          user: user.id,
          edited: true,
        };
        editTask(editedTask);
        API.editTask({
          id: taskToEdit.id,
          description: description,
          private: private_ ? 1 : 0,
          important: urgent ? 1 : 0,
          deadline: !enableDeadline ? `${deadline} ${time}` : undefined,
          completed: taskToEdit.completed,
          user: user.id,
        })
          .then(() => {
            setRefresh(true);
            setLoading(false);
            onHide();
            resetTask();
          })
          .catch((error) => {
            console.log(error);
            setError(JSON.stringify(error));
            setRefresh(true);
            setLoading(false);
          });
      } else {
        const newTask = {
          description: description,
          private_: private_,
          urgent: urgent,
          deadline: !enableDeadline ? `${deadline} ${time}` : undefined,
          completed: 0,
          user: user.id,
          isNew: true,
        };
        addTask(newTask);
        API.addTask({
          description: description,
          private: private_ ? 1 : 0,
          important: urgent ? 1 : 0,
          deadline: !enableDeadline ? `${deadline} ${time}` : undefined,
          completed: 0,
          user: user.id,
        })
          .then(() => {
            setRefresh(true);
            setLoading(false);
            onHide();
            resetTask();
          })
          .catch((error) => {
            console.log(error);
            setError(JSON.stringify(error));
            setRefresh(true);
            setLoading(false);
          });
      }
    } else {
      setValidated(true);
    }
  };

  const resetTask = () => {
    setError();
    setValidated(false);
    setDescription("");
    setPrivate_(false);
    setUrgent(false);
    setEnableDeadline(true);
    setDeadline("");
    setTime("00:00");
  };

  return (
    <Modal
      onHide={onHide}
      show={show}
      size="md"
      aria-labelledby="add-new-task-title"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="add-new-task-title">
          {taskToEdit ? "Edit" : "Add new"} Task
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          noValidate
          validated={validated}
          onSubmit={(event) => submitTask(event)}
        >
          <Form.Group>
            <Form.Label>
              To Do <span className="urgent">*</span>
            </Form.Label>
            <Form.Control
              required
              type="text"
              value={description}
              placeholder="Description"
              onChange={(event) => handleChangeDescription(event)}
            />
            <Form.Control.Feedback type="invalid">
              Please fill with a valid Description.
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Insert here your todo description
            </Form.Text>
          </Form.Group>
          <Form.Row>
            <Form.Group as={Col} md="6">
              <Form.Check
                custom
                type="checkbox"
                id="formPrivate"
                label="Private"
                onChange={handleChangePrivate_}
                checked={private_}
              />
            </Form.Group>
            <Form.Group as={Col} md="6">
              <Form.Check
                custom
                type="checkbox"
                id="formUrgent"
                label="Important"
                onChange={handleChangeUrgent}
                checked={urgent}
              />
            </Form.Group>
          </Form.Row>
          <Form.Group>
            <Form.Check
              custom
              type="checkbox"
              id="formDeadline"
              label="Deadline"
              onChange={enableDisable}
              checked={!enableDeadline}
            />
          </Form.Group>
          <Form.Row>
            <Form.Group as={Col} md="6">
              <Form.Label>Date</Form.Label>
              <Form.Control
                required
                disabled={enableDeadline}
                type="date"
                name="deadline"
                value={deadline}
                placeholder="Deadline"
                onChange={(event) => handleChangeDeadline(event)}
              />
              <Form.Control.Feedback type="invalid">
                Please insert a valid date.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="6">
              <Form.Label>Time</Form.Label>
              <Form.Control
                required
                disabled={enableDeadline}
                type="time"
                name="time"
                value={time}
                placeholder="Time"
                onChange={(event) => handleChangeTime(event)}
              />
              <Form.Control.Feedback type="invalid">
                Please insert a valid hour.
              </Form.Control.Feedback>
            </Form.Group>
          </Form.Row>
          <Form.Row
            className={"d-flex justify-content-center align-items-center"}
          >
            {error && <Alert variant={"warning"}>{error}</Alert>}
          </Form.Row>
          <Modal.Footer>
            <Form.Group>
              <Button
                className="d-flex align-items-center"
                variant="warning"
                type="button"
                onClick={() => resetTask()}
								disabled={loading}
              >
                Reset
              </Button>
            </Form.Group>
            <Form.Group>
              <Button
                className="d-flex align-items-center"
                variant="success"
                type="submit"
                disabled={loading}
              >
                {loading && <Spinner animation="border" size="sm" />}
                {taskToEdit ? "Save" : "Add"}
              </Button>
            </Form.Group>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddEditTask;
