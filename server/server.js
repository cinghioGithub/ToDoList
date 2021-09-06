const express = require("express");
const morgan = require("morgan"); //logging middleware
const passport = require("passport"); // middleware
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const { check, param, body, validationResult } = require("express-validator"); // validation middleware
const db = require("./db.js");
const users = require("./users.js")
const dayjs = require("dayjs");


/***********************************
 * SERVER CONFIGURATION
***********************************/

// EXPRESS SERVER INIT
const BASE_URL = 'http://localhost'
const BASE_API = '/api/';
const SESSION = 'sessions';
const TASKS = 'tasks';
const PORT = 3001;
const app = express();

// AUTHENTICATION
passport.use(
  new LocalStrategy(function (username, password, done) {
    users.getUser(username, password).then((user) => {
      //console.log(`{username: ${username}, password: ${password}}`);
      if (!user)
        return done(null, false, {
          message: "Incorrect username and/or password",
        });
      return done(null, user);
    })
    .catch( err => {
      console.log("AUTHENTICATION ERROR: ", err);
      return done(err, false, err.Error);
    });
  })
);

// SERIALIZER FOR A NEW SESSION
passport.serializeUser((user, done) => {
  console.log("SERIALIZEUSER - USER: ", user);
  done(null, user.id);
});

// DESERIALIZER FROM AN EXISTING SESSION
passport.deserializeUser((id, done) => {
  console.log("DESERIALIZEUSER - USERID: ", id);
  users.getUserById(id)
    .then((user) => {
      console.log("DESERIALIZEUSER [DONE] - USER: ", user);
      done(null, user); // this will be available in req.user
    })
    .catch((err) => {
      console.log("DESERIALIZEUSER [ERROR] - USER: ", err);
      done(err, null);
    });
});

// MIDDLEWARE INITIALIZATION
app.use(morgan("dev"));
app.use(express.json());
app.use(
  session({
    secret: "tre Uomini e un Array",
    resave: false,
    saveUninitialized: false,
  })
);

// MIDDLEWARES CUSTOM
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ error: "Not Authenticated" });
};

// PASSPORT INITIALIZAZION
app.use(passport.initialize());
app.use(passport.session());

/***********************************
 *	List of SESSION API
 ***********************************/

// POST /session
// Login
app.post(BASE_API+SESSION, function (req, res, next) {
  console.log("AUTHENTICATE SESSION SERVER API [START]");
  passport.authenticate("local", (err, user, info) => {
    if (err){
      console.log("AUTHENTICATE SESSION SERVER API [ERROR]", err);
      return next(err.Error);
    } 
    if (!user) {
      console.log("AUTHENTICATE SESSION SERVER API [FAILED]", info);
      // display wrong login messages
      return res.status(401).json(info);
    }
    console.log("AUTHENTICATE SESSION SERVER API [SUCCESS]", user);
    // success, perform the login
    req.login(user, (err) => {
      if (err) return next(err);
      console.log("AUTHENTICATE SESSION SERVER API [LOGIN]");
      // req.user contains the authenticated user, we send all the user info back
      // this is coming from db.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});


// DELETE /sessions/current 
// logout
app.delete(BASE_API+SESSION + "/current", (req, res) => {
  console.log("LOGOUT SERVER API");
  req.logout();
  res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get(BASE_API+SESSION + "/current", (req, res) => {
  console.log("CHECKSESSION SERVER API [START]");
  if (req.isAuthenticated()) {
    console.log("CHECKSESSION SERVER API [OK]: ", req.user);
    return res.status(200).json(req.user);
  } else {
    error = {error: "Unauthenticated user!"}
    console.log('CHECKSESSION SERVER API [ERROR]: ', error.error);
    return res.status(401).json(error);
  }
});

/***********************************
 *	LIST OF DATABASE API
 ***********************************/

/* Retrieve complete Tasklist or a filtered one */
app.get(BASE_API + TASKS, isLoggedIn, async (req, res) => {
  try {
    if (req.query.filter) {
      const result = await db.getTasksByFilter(req.query.filter, req.user.id);
      if (result.error) {
        return res.status(404).json(result);
      } else {
        setTimeout(() => res.status(200).json(result), 1000);
      }
    } else {
      const result = await db.getAllTasks(req.user.id);
      //console.log("SERVER API GetAllTasks", result);
      if (result.error) {
        return res.status(404).json(result);
      } else {
        setTimeout(() => res.status(200).json(result), 1000);
      }
    }
  } catch (err) {
    return res.status(500).json({ error: "500 - Internal Server Error" });
  }
});

/* Get Task by ID */
app.get("/api/tasks/:id", async (req, res) => {
    try{
        const result = await db.getTaskById(req.params.id);
        if (result.error){
            return res.status(404).json(result.error);
        } else {
            return res.status(200).json(result);
        }
    } catch(err) {
        return res.status(500).json(err);
    }
});

const checkIsDate = (date) => {
  if (date) return dayjs(date).isValid();
  else return true;
};

/* Create a new Task */
app.post(
  BASE_API + TASKS,
  [
    body("private").isInt({ min: 0, max: 1 }),
    body("important").isInt({ min: 0, max: 1 }),
    body("deadline").custom((deadline) => checkIsDate(deadline)),
    body("description").isString(),
    body("completed").isInt({ min: 0, max: 1 }),
    body("user").isInt(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw res.status(422).json({ error: errors.array() });
    }
    const task = {
      description: req.body.description,
      private_: req.body.private,
      urgent: req.body.important,
      deadline: req.body.deadline,
      completed: req.body.completed,
      user: req.body.user,
    };
    try {
      const result = await db.createTask(task);
      return res.status(201).json(result);
    } catch (err) {
      throw res.status(503).json({
        error: `Database error during the creation of task "${task.description}".`,
      });
    }
  }
);

/* Update Task Completed or Info by ID */
app.put(
  BASE_API + TASKS + "/:id",
  [
    param("id").isInt(),
    body("private").optional().isInt({ min: 0, max: 1 }),
    body("important").optional().isInt({ min: 0, max: 1 }),
    body("deadline").optional().custom((deadline) => checkIsDate(deadline)),
    body("description").optional().isString(),
    body("completed").isInt({ min: 0, max: 1 }),
    body("user").optional().isInt(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("EDIT TASK SERVER API [VALDATION ERROR]", errors);
      return res.status(422).json({ errors: errors.array() });
    }
    if (req.body.description) {
      const task = {
        description: req.body.description,
        private_: req.body.private,
        urgent: req.body.important,
        deadline: req.body.deadline,
        user: req.body.user,
      };
      console.log("EDIT TASK SERVER API [START]", task);
      try {
        const result = await db.updateTask(req.params.id, task);
        console.log("EDIT TASK SERVER API [TRY]", result);
        return res.status(201).json(result.id);
      } catch (err) {
        console.log("EDIT TASK SERVER API [CATCH]", err);
        return res.status(503).json({
          error: `Database error during update of task ${req.params.id}.`,
        });
      }
    } else {
      console.log("SETCOMPLETED TASK SERVER API [START]");
      try {
        const result = await db.updateTaskCompleted(
          req.params.id,
          req.body.completed
        );
        console.log("SETCOMPLETED TASK SERVER API [TRY]", result);
        return res.status(201).json(result.id);
      } catch (err) {
        console.log("SETCOMPLETED TASK SERVER API [CATCH]", err);
        return res.status(503).json({
          error: `Database error during update of task ${req.params.id}.`,
        });
      }
    }
  }
);

/* delete a task */
app.delete(BASE_API + TASKS + "/:id", async (req, res) => {
  try {
    result = await db.deleteTask(req.params.id);
    return res.status(201).json(result.id);
  } catch (err) {
    return res.status(503).json({
      error: `Database error during the delete of task ${res.params.id}.`,
    });
  }
});


/***********************************
 * SERVER STARTING
***********************************/

app.listen(PORT, () =>
  console.log(`Server running on ${BASE_URL}:${PORT}/`)
);
