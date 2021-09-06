/* import dayjs from 'dayjs'; */

const getTasksByFilter = async (selectedFilter) => {
  const response = await fetch(`/api/tasks?filter=${selectedFilter}`);
  const body = await response.json();
  if (response.ok) {
    return body;
  } else {
    throw body.error;
  }
};

const getAllTasks = async () => {
  const response = await fetch("/api/tasks");
  const body = await response.json();
  if (response.ok) {
    return body;
  } else {
    throw body.error;
  }
};

const addTask = async (task) => {
  const response = await fetch(`/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  const body = await response.json();
  if (response.ok) {
    return body;
  } else {
    throw body.error;
  }
};

const deleteTask = async (id) => {
  const response = await fetch(`/api/tasks/${id}`, {
    method: "DELETE",
  });
  const body = await response.json();
  if (response.ok) {
    return body;
  } else {
    throw body.error;
  }
};

const editTask = async (task) => {
  console.log("EDIT TASK CLIENT API [START]", task);
  const response = await fetch(`/api/tasks/${task.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  const body = await response.json();
  if (response.ok) {
    console.log("EDIT TASK CLIENT API [OK] - Task Id: ", body);
    return body;
  } else {
    console.log("EDIT TASK CLIENT API [ERROR]", body);
    throw body.error;
  }
};

const setTaskCompleted = async (task) => {
  console.log("SET TASK COMPLETED CLIENT API [START]", task);
  const response = await fetch(`/api/tasks/${task.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  const body = await response.json();
  if (response.ok) {
    console.log("SET TASK COMPLETED CLIENT API [OK] - Task Id: ", body);
    return body;
  } else {
    console.log("SET TASK COMPLETED CLIENT API [ERROR]", body);
    throw body.error;
  }
};

async function logIn(credentials) {
  console.log("LOGIN CLIENT API [credential] : ", credentials);
  let response = await fetch("/api/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
		if (response.status !== 401) {
			const error = {
				message:
					"Database error"
			};
			throw error;
		} else {
			const responseBody = await response.json();
			console.log(responseBody);
			if(responseBody.message) throw responseBody;
		}
  }
}

async function logOut() {
  await fetch("/api/sessions/current", {method: "DELETE"});
}

async function checkSession() {
  console.log("CHECK SESSION CLIENT API [START]");
  const response = await fetch("/api/sessions/current");
	const userInfo = await response.json();
  if (response.ok) {
    console.log("CHECK SESSION CLIENT API [OK]", userInfo);
    return userInfo;
  } else {
		throw userInfo;
  }
}

const API = {
  getTasksByFilter,
  getAllTasks,
  addTask,
  deleteTask,
  editTask,
  setTaskCompleted,
  logIn,
  logOut,
  checkSession,
};
export default API;
