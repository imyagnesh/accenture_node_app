const express = require("express");
const app = express();
const Joi = require("joi");

const { json, urlencoded } = require("body-parser");

app.use(json());
app.use(urlencoded());

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
  try {
    const schema = Joi.object({
      todoText: Joi.string().min(3).required(),
      isDone: Joi.boolean(),
    });
    const { error } = schema.validate(req.body);

    if (error) {
      res.status(401).send({ message: error.details });
    }
    const index = todos.findIndex((x) => x.id === Number(req.params.id));
    console.log(req.params.id);
    if (index === -1)
      return res.status(404).send({ message: "record not found" });

    // TODO: use splice for update record as well
    todos.splice(index, 1);
    const updatedTodo = {
      ...req.body,
      id: +req.params.id,
    };
    todos.push(updatedTodo);

    return res.status(201).send(updatedTodo);
  } catch (error) {
    res.status(500).send({ message: "some error occured" });
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
