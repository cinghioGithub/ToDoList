"use strict";

const sqlite = require("sqlite3");
const dayjs = require("dayjs");
const db = new sqlite.Database("tasks.db", (err) => {
  if (err) throw err;
});

/* retrive all tasks */
exports.getAllTasks = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * from tasks WHERE user=?";
    db.all(sql, [id], (err, rows) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        if (rows === undefined) {
          resolve({ error: "Database Error" });
        } else {
          const tasklist = rows.map((row) => {
            return {
              id: row.id,
              description: row.description,
              private_: row.private,
              urgent: row.important,
              deadline: row.deadline,
              completed: row.completed,
              user: row.user,
            };
          });
          resolve(tasklist);
        }
      }
    });
  });
};

/* retrive tasks with filter */
exports.getTasksByFilter = (filter, id) => {
  return new Promise((resolve, reject) => {
    const sql = "select * from tasks WHERE user=?";
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        if (rows !== undefined) {
          let tasklist = rows.map((row) => {
            return {
              id: row.id,
              description: row.description,
              private_: row.private,
              urgent: row.important,
              deadline: row.deadline,
              completed: row.completed,
              user: row.user,
            };
          });
          const today = dayjs();
          const endDay = dayjs().add(8, "day");
          switch (filter) {
            case "Important":
              tasklist = tasklist.filter((val) => val.urgent);
              break;
            case "Today":
              tasklist = tasklist.filter((e) =>
                e.deadline
                  ? dayjs(e.deadline).format("DD/MM/YYYY") ===
                    today.format("DD/MM/YYYY")
                  : false
              );
              break;
            case "Private":
              tasklist = tasklist.filter((e) => e.private_);
              break;
            case "Next 7 Days":
              tasklist = tasklist.filter((e) =>
                e.deadline
                  ? dayjs(e.deadline).isAfter(today) &&
                    dayjs(e.deadline).isBefore(endDay)
                  : false
              );
              break;
            default:
              break;
          }
          resolve(tasklist);
        } else {
          resolve({ error: "Database Error" });
        }
      }
    });
  });
};

exports.getTaskById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "select * from tasks where id=?";
    db.all(sql, [id], (err, row) => {
      if (err) reject(err);
      else {
        if (row) {
          let tasklist = row.map((row) => {
            return {
              id: row.id,
              description: row.description,
              private_: row.private,
              urgent: row.important,
              deadline: row.deadline,
              completed: row.completed,
              user: row.user,
            };
          });
          resolve(tasklist);
        } else {
          resolve({ error: `Task ${id} not found` });
        }
      }
    });
  });
};

const getMaxId = () => {
  return new Promise((resolve, reject) => {
    const sql = "select max(id) as maxId from tasks";
    db.get(sql, [], (err, row) => {
      if (err) reject(err);
      else resolve(row.maxId);
    });
  });
};

exports.createTask = async (task) => {
  let id = await getMaxId();
  if (!id) id = -1;
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO tasks(id,description,important,private,deadline,completed,user) VALUES(?,?,?,?,?,?,?)";
    db.run(
      sql,
      [
        id + 1,
        task.description,
        task.urgent,
        task.private_,
        task.deadline,
        task.completed,
        task.user,
      ],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({ id: id + 1 });
        }
      }
    );
  });
};

exports.deleteTask = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "delete from tasks where id=?";
    db.run(sql, [id], (err) => {
      if (err) reject(err);
      else resolve({ id: id });
    });
  });
};

exports.updateTask = (id, task) => {
  return new Promise((resolve, reject) => {
    const sql =
      "update tasks set description=?, important=?, private=?, deadline=?, user=? where id=?";
    db.run(
      sql,
      [
        task.description,
        task.urgent,
        task.private_,
        task.deadline,
        task.user,
        id,
      ],
      (err) => {
        if (err) reject(err);
        else resolve({ id: id });
      }
    );
  });
};

exports.updateTaskCompleted = (id, completed) => {
  return new Promise((resolve, reject) => {
    const sql = "update tasks set completed=? where id=?";
    db.run(sql, [completed, id], (err) => {
      if (err) reject(err);
      else resolve({ id: id });
    });
  });
};
