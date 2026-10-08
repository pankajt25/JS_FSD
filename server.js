const express = require("express");
const app = express();
const PORT = 3002;
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

let employees = [
    {
        id: 1,
        name: "Rahul",
        department: "IT",
        salary: 40000
    },
    {
        id: 2,
        name: "Priya",
        department: "HR",
        salary: 35000
    }
];

function validateEmployee(req, res, next) {
    const { name, department } = req.body;

    if (!name || !department) {
        return res.status(400).json({
            message: "Name and department are required"
        });
    }

    next();
}

function checkAuth(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            message: "Authentication required"
        });
    }

    next();
}

app.get("/employees", (req, res) => {
    let result = employees;

    if (req.query.department) {
        result = result.filter(
            e => e.department === req.query.department
        );
    }

    if (req.query.name) {
        result = result.filter(
            e => e.name.toLowerCase().includes(req.query.name.toLowerCase())
        );
    }

    res.status(200).json(result);
});

app.get("/employees/:id", (req, res) => {
    const id = Number(req.params.id);

    const employee = employees.find(e => e.id === id);

    if (!employee) {
        return res.status(404).json({
            message: "Employee not found"
        });
    }

    res.json(employee);
});

app.post("/employees", validateEmployee, (req, res) => {
    const employee = {
        id: employees.length + 1,
        ...req.body
    };

    employees.push(employee);

    res.status(201).json(employee);
});

app.put("/employees/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = employees.findIndex(e => e.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Employee not found"
        });
    }

    employees[index] = {
        id,
        ...req.body
    };

    res.json(employees[index]);
});

app.patch("/employees/:id", (req, res) => {
    const id = Number(req.params.id);

    const employee = employees.find(e => e.id === id);

    if (!employee) {
        return res.status(404).json({
            message: "Employee not found"
        });
    }

    Object.assign(employee, req.body);

    res.json(employee);
});

app.delete("/employees/:id", (req, res) => {
    const id = Number(req.params.id);

    const oldLength = employees.length;

    employees = employees.filter(e => e.id !== id);

    if (employees.length === oldLength) {
        return res.status(404).json({
            message: "Employee not found"
        });
    }

    res.json({
        message: "Employee deleted"
    });
});

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        message: "Something went wrong"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});