import { useState, useEffect } from 'react';
import { Calendar, User, Bell, CheckSquare, Plus, Trash, Edit } from 'lucide-react';
import './App.css';

// ---------------- Sidebar ----------------
function Sidebar({ items = [], activeItem, onClick }) {
  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-logo">
        <img
          src="https://cdn-icons-png.flaticon.com/512/906/906334.png"
          alt="Condo Net"
        />
        <span>Tarefas</span>
      </div>

      <nav>
        {items.map((item) => (
          <div
            key={item.label}
            className={`sidebar-item ${activeItem === item.label ? 'active' : ''}`}
            onClick={() => onClick(item.label)}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
}

// ---------------- Dashboard ----------------
function Dashboard() {
  const [activeTab, setActiveTab] = useState('Minhas Tarefas');

  const sidebarItems = [
    { label: 'Minhas Tarefas', icon: CheckSquare },
    { label: 'Medicamentos', icon: Bell },
    { label: 'Agenda', icon: Calendar },
    { label: 'Aniversários', icon: User },
  ];

  // Inicialização com LocalStorage para não perder dados ao atualizar
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('tasks')) || []);
  const [medications, setMedications] = useState(() => JSON.parse(localStorage.getItem('meds')) || []);
  const [agenda, setAgenda] = useState(() => JSON.parse(localStorage.getItem('agenda')) || []);
  const [birthdays, setBirthdays] = useState(() => JSON.parse(localStorage.getItem('birthdays')) || []);

  // Efeitos para salvar automaticamente
  useEffect(() => localStorage.setItem('tasks', JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem('meds', JSON.stringify(medications)), [medications]);
  useEffect(() => localStorage.setItem('agenda', JSON.stringify(agenda)), [agenda]);
  useEffect(() => localStorage.setItem('birthdays', JSON.stringify(birthdays)), [birthdays]);

  // Estados de input
  const [newTask, setNewTask] = useState('');
  const [newMedication, setNewMedication] = useState({ name: '', time: '' });
  const [newAgenda, setNewAgenda] = useState({ event: '', time: '' });
  const [newBirthday, setNewBirthday] = useState({ name: '', date: '' });

  // Para controle de edição
  const [editing, setEditing] = useState(null);

  const handleAdd = (e) => {
    if (e) e.preventDefault(); // Previne reload se estiver num <form>

    switch (activeTab) {
      case 'Minhas Tarefas':
        if (!newTask.trim()) return;
        setTasks([...tasks, { title: newTask, done: false }]);
        setNewTask('');
        break;
      case 'Medicamentos':
        if (!newMedication.name || !newMedication.time) return;
        setMedications([...medications, { ...newMedication }]);
        setNewMedication({ name: '', time: '' });
        break;
      case 'Agenda':
        if (!newAgenda.event || !newAgenda.time) return;
        setAgenda([...agenda, { ...newAgenda }]);
        setNewAgenda({ event: '', time: '' });
        break;
      case 'Aniversários':
        if (!newBirthday.name || !newBirthday.date) return;
        setBirthdays([...birthdays, { ...newBirthday }]);
        setNewBirthday({ name: '', date: '' });
        break;
      default: break;
    }
  };

  const handleDelete = (index, category) => {
    if (category === 'tasks') setTasks(tasks.filter((_, i) => i !== index));
    if (category === 'meds') setMedications(medications.filter((_, i) => i !== index));
    if (category === 'agenda') setAgenda(agenda.filter((_, i) => i !== index));
    if (category === 'birthdays') setBirthdays(birthdays.filter((_, i) => i !== index));
  };

  const handleEdit = (index, category) => {
    if (category === 'tasks') {
      setNewTask(tasks[index].title);
      setEditing({ index, category });
    } else if (category === 'meds') {
      setNewMedication(medications[index]);
      setEditing({ index, category });
    } else if (category === 'agenda') {
      setNewAgenda(agenda[index]);
      setEditing({ index, category });
    } else if (category === 'birthdays') {
      setNewBirthday(birthdays[index]);
      setEditing({ index, category });
    }
  };

  const handleUpdate = (e) => {
    if (e) e.preventDefault();

    if (editing) {
      const { index, category } = editing;
      switch (category) {
        case 'tasks':
          if (!newTask.trim()) return;
          tasks[index].title = newTask;
          setTasks([...tasks]);
          break;
        case 'meds':
          if (!newMedication.name || !newMedication.time) return;
          medications[index] = { ...newMedication };
          setMedications([...medications]);
          break;
        case 'agenda':
          if (!newAgenda.event || !newAgenda.time) return;
          agenda[index] = { ...newAgenda };
          setAgenda([...agenda]);
          break;
        case 'birthdays':
          if (!newBirthday.name || !newBirthday.date) return;
          birthdays[index] = { ...newBirthday };
          setBirthdays([...birthdays]);
          break;
        default: break;
      }
      setEditing(null);
    }
  };

  const toggleTaskDone = (index) => {
    const updated = [...tasks];
    updated[index].done = !updated[index].done;
    setTasks(updated);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Minhas Tarefas':
        return (
          <>
            <div className="input-group">
              <input
                type="text"
                placeholder="Nova tarefa... (Enter para salvar)"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (editing ? handleUpdate() : handleAdd())}
              />
              <button onClick={editing ? handleUpdate : handleAdd}>
                {editing ? <Edit size={16} /> : <Plus size={16} />}
              </button>
            </div>
            <ul className="dashboard-list">
              {tasks.map((t, i) => (
                <li key={i} className={t.done ? 'done' : ''} onClick={() => toggleTaskDone(i)}>
                  <span>{t.title}</span>
                  <button className="delete-btn" onClick={() => handleDelete(i, 'tasks')}>
                    <Trash size={16} />
                  </button>
                  <button className="edit-btn" onClick={() => handleEdit(i, 'tasks')}>
                    <Edit size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </>
        );
      case 'Medicamentos':
        return (
          <>
            <div className="input-group">
              <input
                type="text"
                placeholder="Remédio"
                value={newMedication.name}
                onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
              />
              <input
                type="time"
                value={newMedication.time}
                onChange={(e) => setNewMedication({ ...newMedication, time: e.target.value })}
              />
              <button onClick={editing ? handleUpdate : handleAdd}>
                {editing ? <Edit size={16} /> : <Plus size={16} />}
              </button>
            </div>
            <ul className="dashboard-list">
              {medications.map((m, i) => (
                <li key={i} className="no-click">
                  {m.name} - <span className="time">{m.time}</span>
                  <button className="delete-btn" onClick={() => handleDelete(i, 'meds')}>
                    <Trash size={16} />
                  </button>
                  <button className="edit-btn" onClick={() => handleEdit(i, 'meds')}>
                    <Edit size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </>
        );
      case 'Agenda':
        return (
          <>
            <div className="input-group">
              <input
                type="text"
                placeholder="Evento"
                value={newAgenda.event}
                onChange={(e) => setNewAgenda({ ...newAgenda, event: e.target.value })}
              />
              <input
                type="time"
                value={newAgenda.time}
                onChange={(e) => setNewAgenda({ ...newAgenda, time: e.target.value })}
              />
              <button onClick={editing ? handleUpdate : handleAdd}>
                {editing ? <Edit size={16} /> : <Plus size={16} />}
              </button>
            </div>
            <ul className="dashboard-list">
              {agenda.map((a, i) => (
                <li key={i} className="no-click">
                  {a.event} - <span className="time">{a.time}</span>
                  <button className="delete-btn" onClick={() => handleDelete(i, 'agenda')}>
                    <Trash size={16} />
                  </button>
                  <button className="edit-btn" onClick={() => handleEdit(i, 'agenda')}>
                    <Edit size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </>
        );
      case 'Aniversários':
        return (
          <>
            <div className="input-group">
              <input
                type="text"
                placeholder="Nome"
                value={newBirthday.name}
                onChange={(e) => setNewBirthday({ ...newBirthday, name: e.target.value })}
              />
              <input
                type="date"
                name="date"
                value={newBirthday.date}
                onChange={(e) => setNewBirthday({ ...newBirthday, date: e.target.value })}
              />
              <button onClick={editing ? handleUpdate : handleAdd}>
                {editing ? <Edit size={16} /> : <Plus size={16} />}
              </button>
            </div>
            <ul className="dashboard-list">
              {birthdays.map((b, i) => (
                <li key={i} className="no-click">
                  {b.name} - <span className="time">{b.date ? new Date(b.date + 'T00:00:00').toLocaleDateString('pt-BR') : ''}</span>
                  <button className="delete-btn" onClick={() => handleDelete(i, 'birthdays')}>
                    <Trash size={16} />
                  </button>
                  <button className="edit-btn" onClick={() => handleEdit(i, 'birthdays')}>
                    <Edit size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </>
        );
      default: return null;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar items={sidebarItems} activeItem={activeTab} onClick={setActiveTab} />
      <main className="dashboard-content">
        <h1>{activeTab}</h1>
        {renderContent()}
      </main>
    </div>
  );
}

export default Dashboard;