import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Checkbox,
  Stack,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CssBaseline,
  AppBar,
  Toolbar,
  GlobalStyles,
  Tooltip,
} from "@mui/material";

// 🔽 ADD THIS IMPORT (nothing else)
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

import { useEffect, useState, useRef } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { db, auth } from "./firebase";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [snackbar, setSnackbar] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [user, setUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");


  // 👉 NEW (UI ONLY – SAFE)
  const [hoveredTodoId, setHoveredTodoId] = useState(null);

  const inputRef = useRef(null);

  // 🔐 Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      setSnackbar("Signed in successfully");
    } catch {
      setSnackbar("Login failed");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setSnackbar("Signed out");
  };

  // 🌙 THEME (unchanged)
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#4f9ea0" },
      background: darkMode
        ? {}
        : {
            default: "#eaf6f8",
            paper: "rgba(255,255,255,0.75)",
          },
    },
    shape: { borderRadius: 16 },
  });

  // 🔥 Realtime todos
  useEffect(() => {
    const q = query(collection(db, "todos"), orderBy("createdAt", "asc"));
    return onSnapshot(q, (snap) =>
      setTodos(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
  }, []);

  // ⌨️ Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === "/") inputRef.current?.focus();
      if (e.ctrlKey && e.key.toLowerCase() === "d")
        setDarkMode((p) => !p);
      if (e.key === "Escape") setText("");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleAdd = async () => {
    if (!text.trim()) return;
    await addDoc(collection(db, "todos"), {
      text,
      done: false,
      createdAt: Date.now(),
    });
    setText("");
    setSnackbar("Todo added");
  };

  const toggleTodo = async (todo) =>
    updateDoc(doc(db, "todos", todo.id), { done: !todo.done });

  const confirmDelete = async () => {
    await deleteDoc(doc(db, "todos", deleteTarget.id));
    setDeleteTarget(null);
    setSnackbar("Todo deleted");
  };

  const clearCompleted = async () => {
    await Promise.all(
      todos.filter((t) => t.done).map((t) =>
        deleteDoc(doc(db, "todos", t.id))
      )
    );
    setSnackbar("Completed todos cleared");
  };

  const filteredTodos = todos.filter((t) =>
    filter === "active" ? !t.done : filter === "completed" ? t.done : true
  );

  const remaining = todos.filter((t) => !t.done).length;

  // 🔐 UI GATE
  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper sx={{ p: 5, textAlign: "center", maxWidth: 420 }}>
            <Typography variant="h5" fontWeight={700}>
              Welcome to MyTodo
            </Typography>
            <Typography color="text.secondary" mb={3}>
              Please sign in to continue
            </Typography>
            <Button
              variant="contained"
              startIcon={<AccountCircleIcon />}
              onClick={handleGoogleLogin}
            >
              Sign in with Google
            </Button>
          </Paper>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <GlobalStyles
        styles={{
          "*": {
            transition:
              "background-color 300ms ease, color 200ms ease, border-color 300ms ease",
          },
        }}
      />

      {/* TOP BAR */}
      <AppBar position="static" elevation={0} color="transparent">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography fontWeight={700}>MyTodo</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="Keyboard shortcuts">
              <IconButton onClick={() => setShowShortcuts(true)}>
                <KeyboardIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={user.email}>
              <AccountCircleIcon />
            </Tooltip>
            <IconButton onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
            <IconButton onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* DASHBOARD */}
      <Box sx={{ minHeight: "100vh", py: 6 }}>
        <Container maxWidth="md">
          <Paper sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight="bold">
              Focus Tasks
            </Typography>

            <Stack direction="row" spacing={2} mb={2}>
              <TextField
                fullWidth
                inputRef={inputRef}
                label="Add a new task..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAdd}
              >
                Add
              </Button>
            </Stack>

            <Tabs value={filter} onChange={(e, v) => setFilter(v)}>
              <Tab label="All" value="all" />
              <Tab label="Active" value="active" />
              <Tab label="Completed" value="completed" />
            </Tabs>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              my={2}
            >
              <Typography color="text.secondary">
                {remaining} task{remaining !== 1 && "s"} remaining
              </Typography>
              <Button
                startIcon={<ClearAllIcon />}
                onClick={clearCompleted}
                disabled={!todos.some((t) => t.done)}
              >
                Clear completed
              </Button>
            </Stack>

            {/* TODOS WITH HOVER EFFECT */}
            <Stack spacing={2}>
              {filteredTodos.map((todo) => {
                const isHovered = hoveredTodoId === todo.id;
                const isDimmed =
                  hoveredTodoId && hoveredTodoId !== todo.id;

                return (
                  <Paper
                    key={todo.id}
                    onMouseEnter={() => setHoveredTodoId(todo.id)}
                    onMouseLeave={() => setHoveredTodoId(null)}
                    sx={{
                      p: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transform: isHovered ? "scale(1.03)" : "scale(1)",
                      boxShadow: isHovered
                        ? darkMode
                          ? 8
                          : "0 24px 60px rgba(20,60,80,0.25)"
                        : undefined,
                      filter: isDimmed ? "blur(2px)" : "none",
                      opacity: isDimmed ? 0.55 : 1,
                      transition: "all 220ms ease",
                    }}>

                    <Box display="flex" alignItems="center" gap={2} flex={1}>
                      <Checkbox
                        checked={todo.done}
                        onChange={() => toggleTodo(todo)}
                      />

                      {editingId === todo.id ? (
                        <TextField
                          fullWidth
                          size="small"
                          value={editText}
                          autoFocus
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={async (e) => {
                            if (e.key === "Enter" && editText.trim()) {
                              await updateDoc(doc(db, "todos", todo.id), {
                                text: editText,
                              });
                              setEditingId(null);
                              setSnackbar("Todo updated");
                            }
                            if (e.key === "Escape") {
                              setEditingId(null);
                            }
                          }}
                        />
                      ) : (
                        <Typography
                          sx={{
                            textDecoration: todo.done ? "line-through" : "none",
                          }}
                        >
                          {todo.text}
                        </Typography>
                      )}
                    </Box>

                    <Stack direction="row" spacing={0.5}>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setEditingId(todo.id);
                          setEditText(todo.text);
                        }}
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        color="error"
                        onClick={() => setDeleteTarget(todo)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>
          </Paper>
        </Container>
      </Box>

      {/* DELETE CONFIRM */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete task?</DialogTitle>
        <DialogContent>Are you sure?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* SHORTCUTS */}
      <Dialog open={showShortcuts} onClose={() => setShowShortcuts(false)}>
        <DialogTitle>Keyboard Shortcuts</DialogTitle>
        <DialogContent>
          <Typography>Enter — Add todo</Typography>
          <Typography>Ctrl + / — Focus input</Typography>
          <Typography>Ctrl + D — Toggle theme</Typography>
          <Typography>Esc — Clear input</Typography>
        </DialogContent>
      </Dialog>

      {/* SNACKBAR */}
      <Snackbar
        open={!!snackbar}
        autoHideDuration={2500}
        onClose={() => setSnackbar("")}
      >
        <Alert severity="success">{snackbar}</Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
