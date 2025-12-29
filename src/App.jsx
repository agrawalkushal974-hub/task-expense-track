import { useState, useEffect } from "react";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");

  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  // Load saved data
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    const savedExpenses = localStorage.getItem("expenses");

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addTask = () => {
    if (taskText.trim() === "") return;
    setTasks([...tasks, { text: taskText, done: false }]);
    setTaskText("");
  };

  const toggleTask = (index) => {
    const copy = [...tasks];
    copy[index].done = !copy[index].done;
    setTasks(copy);
  };

  const addExpense = () => {
    if (!amount || !category) return;
    setExpenses([
      ...expenses,
      {
        amount: Number(amount),
        category,
        date: new Date().toLocaleDateString(),
      },
    ]);
    setAmount("");
    setCategory("");
  };

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div style={{ fontFamily: "Arial", padding: "20px" }}>
      <h1>Daily Task & Expense Tracker</h1>

      <hr />

      <h2>Daily Tasks</h2>
      <input
        placeholder="Enter task"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
      />
      <button onClick={addTask} style={{ marginLeft: "10px" }}>
        Add Task
      </button>

      <ul>
        {tasks.map((task, i) => (
          <li key={i}>
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTask(i)}
            />{" "}
            <span
              style={{
                textDecoration: task.done ? "line-through" : "none",
              }}
            >
              {task.text}
            </span>
          </li>
        ))}
      </ul>

      <hr />

      <h2>Expense Tracker</h2>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ marginLeft: "10px" }}
      />
      <button onClick={addExpense} style={{ marginLeft: "10px" }}>
        Add Expense
      </button>

      <p>Total Expense: ₹{totalExpense}</p>
      <p>Total Entries: {expenses.length}</p>
    </div>
  );
}
