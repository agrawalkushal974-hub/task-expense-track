import { useState, useEffect } from "react";
import {
  Bar
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
    notifyTask(taskText); // Notify immediately
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

  // Prepare chart data
  const categories = {};
  expenses.forEach(e => {
    if (categories[e.category]) categories[e.category] += e.amount;
    else categories[e.category] = e.amount;
  });

  const data = {
    labels: Object.keys(categories),
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.values(categories),
        backgroundColor: "rgba(37, 99, 235, 0.7)",
      },
    ],
  };

  // Notification function
  const notifyTask = (task) => {
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification(`Reminder: ${task}`);
        }
      });
    }
  };

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

      {expenses.length > 0 && (
        <div style={{ maxWidth: "500px", marginTop: "20px" }}>
          <Bar data={data} />
        </div>
      )}
    </div>
  );
}
