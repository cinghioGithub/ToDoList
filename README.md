# BigLab 2 - Class: 2021 AW1 A-L

## Team name: 3 Uomini E Un Array

Team members:
* Alessandro Cannarella - s290713
* Danilo D'Antoni - s276913
* Enrico Bravi - s283938

## Instructions

A general description of the BigLab 2 is avaible in the `course-materials` repository, [under _labs_](https://github.com/polito-WA1-AW1-2021/course-materials/tree/main/labs/BigLab2/BigLab2.pdf). In the same repository, you can find the [instructions for GitHub Classroom](https://github.com/polito-WA1-AW1-2021/course-materials/tree/main/labs/GH-Classroom-BigLab-Instructions.pdf), covering this and the next BigLab.

Once cloned this repository, instead, write your names in the above section.

When committing on this repository, please, do **NOT** commit the `node_modules` directory, so that it is not pushed to GitHub.
This should be already automatically excluded from the `.gitignore` file, but double-check.

When another member of the team pulls the updated project from the repository, remember to run `npm install` in the project directory to recreate all the Node.js dependencies locally, in the `node_modules` folder.

Finally, remember to add the `final` tag for the final submission, otherwise it will not be graded.

## Credentials of test user

### User1
* Username: `test@test.it`
* Password: `Password`

### User2
* Username: `test2@test.it`
* Password: `Password2`

## List of APIs offered by the server

### __List All tasks__

GET `/api/tasks`

Retrive all tasks from the database

Request body: None

Response body: An array of object, each one describing a task.
```
[{
	"id": 1,
	"description": "Go for a walk",
	"private_": 1,
	"urgent": 1,
	"deadline": "2021-04-14 08:30",
	"completed": 1,
	"user": 1
},
{
	id: 4,
	description: "Watch the Express videolecture",
	private_: 1,
	urgent: 1,
	deadline: "2021-05-24 09:00",
	completed: 1,
	user: 1
},
...
]
```

### __List tasks matching a filter__

GET `/api/tasks?filter=<filter>`

Retrive all tasks that match with the specified filter `<filter>`

Request body: None

Response body: An array of object, each one describing a tasks.

`<filter>` = Private
```
[{
	"id": 1,
	"description": "Go for a walk",
	"private_": 1,
	"urgent": 0,
	"deadline": "2021-04-14 08:30",
	"completed": 0,
	"user": 1
},
{
	id: 4,
	description: "Watch the Express videolecture",
	private_: 1,
	urgent: 1,
	deadline: "2021-05-24 09:00",
	completed: 1,
	user: 1
},
...
]
```

### __Retrive a task with a specific id__

GET `/api/tasks/<id>`

Retrive the task with tha specified id `<id>`
	
Request body: None

Response body: An object describing a task

`<id>` = 1
```
{
	"id": 1,
	"description": "Go for a walk",
	"private_": 1,
	"urgent": 0,
	"deadline": "2021-04-14 08:30",
	"completed": 0,
	"user": 1
}
```

### __Create new task__

POST `/api/tasks`

Create a new task in the databased, based on what passed in request body

Request body: An object describing a task (Content-Type: application/json)
```
{
	"description": "Go for a walk",
	"private_": 1,
	"urgent": 0,
	"deadline": "2021-04-14 08:30",
	"completed": 0,
	"user": 1
}
```

Response: 201 Created (success) or 503 Service Unavailable (generic error, e.g., when trying to insert an already existent task)

Response body: None

### __Modify a specific task__

PUT `/api/tasks/<id>`

Modify an existing task, or set as completed

Request body: An object describing a task, if editing a task (Content-Type: application/json)
```
{
	"description": "Go for a walk",
	"private_": 1,
	"urgent": 0,
	"deadline": "2021-04-14 08:30",
	"completed": 0,
	"user": 1
}
```
An object with a parameter called "completed", if setting completed/uncompleted a task (Content-Type: application/json)
```
{
	"completed": 0
}
```
Response: 201 Modified (success) or 503 Service Unavailable (generic error)

Response body: None

### __Delete a task__

DELETE `/api/tasks/<id>`

Delete a task from the database

Request body: None

Response: 201 Modified (success) or 503 Service Unavailable (generic error, e.g., when trying to delete a not existing task)

Response body: None
