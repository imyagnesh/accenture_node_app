const express = require("express");
const app = express();
const Joi = require("joi");

app.use(express.json());

const todos = [
  {
    id: 1,
    todoText: "Get Milk",
    isDone: false,
  },
  {
    id: 2,
    todoText: "Give Training",
    isDone: false,
  },
];

app.get("/api/todos", function (req, res) {
  const id = req.query.id;
  const todoText = req.query.todoText;
  let response = todos;
  if (id || todoText) {
    response = response.filter((x) => {
      if (id) {
        return x.id === Number(id);
      }
      if (todoText) {
        return x.todoText.includes(todoText);
      }
      return false;
    });
  }
  res.status(200).send(response);
});

app.get("/api/todos/:id", function (req, res) {
  const todo = todos.find((x) => x.id === Number(req.params.id));

  if (todo) {
    res.status(200).send(todo);
  } else {
    res.status(400).send({ message: "id is not available" });
  }
});

app.post("/api/todos", function (req, res) {
  try {
    const schema = Joi.object({
      todoText: Joi.string().min(3).required(),
      isDone: Joi.boolean(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(401).send(error.details);
    }
    const data = req.body;
    if (!data.isDone) {
      data.isDone = false;
    }

    const todo = {
      id: todos.length + 1,
      ...data,
    };
    todos.push(todo);
    res.status(201).send(todo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "something is wrong" });
  }
});

app.put("/api/todos/:id", function (req, res) {
  // TODO: use splice for update record as well
  try {
    const index = todos.findIndex((x) => x.id === Number(req.params.id));
    if (index === -1) {
      return res.status(404).send({ message: "record not found" });
    } else {
      const schema = Joi.object({
        todoText: Joi.string().min(3).required(),
        isDone: Joi.boolean(),
      });
    
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(401).send(error.details);
      } else {
        todos.splice(index, 1);
        const updatedTodo = {
          ...req.body,
          id: Number(req.params.id),
        };
        todos.push(updatedTodo);
        return res.status(201).send(updatedTodo);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "something is wrong" });
  }
});

app.delete("/api/todos/:id", function (req, res) {
  const index = todos.findIndex((x) => x.id === Number(req.params.id));
  if (index === -1)
    return res.status(404).send({ message: "record not found" });

  const deletedTodo = todos[index];
  // TODO: use splice for update record as well
  todos.splice(index, 1);

  return res.status(201).send(deletedTodo);
});

// app.get("/api/todos/:year/:month", function (req, res) {
//   // {
//   //     year: '',
//   //     month: ""
//   // }
//   res.send(req.params);
// });

var port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`${port} port is ready`);
});
