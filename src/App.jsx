import { useState } from 'react';
import { Calendar, User, Bell, CheckSquare, Plus, Trash } from 'lucide-react'; // Adicionando ícone de lixeira
import './App.css';

// ---------------- Sidebar ----------------
function Sidebar({ items = [], activeItem, onClick }) {
  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-logo">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/CondoNet_Logo.svg/1200px-CondoNet_Logo.svg.png" 
          alt="Condo Net"
        />
        <span>Condo Net</span>
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

  const [tasks, setTasks] = useState([]);
  const [medications, setMedications] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [birthdays, setBirthdays] = useState([]);

  // Estados de input
  const [newTask, setNewTask] = useState('');
  const [newMedication, setNewMedication] = useState({ name: '', time: '' });
  const [newAgenda, setNewAgenda] = useState({ event: '', time: '' });
  const [newBirthday, setNewBirthday] = useState({ name: '', date: '' });

  const handleAdd = () => {
    switch (activeTab) {
      case 'Minhas Tarefas':
        if (newTask.trim() === '') return;
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
      default:
        break;
    }
  };

  const handleDelete = (index) => {
    switch (activeTab) {
      case 'Minhas Tarefas':
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
        break;
      case 'Medicamentos':
        const updatedMedications = medications.filter((_, i) => i !== index);
        setMedications(updatedMedications);
        break;
      case 'Agenda':
        const updatedAgenda = agenda.filter((_, i) => i !== index);
        setAgenda(updatedAgenda);
        break;
      case 'Aniversários':
        const updatedBirthdays = birthdays.filter((_, i) => i !== index);
        setBirthdays(updatedBirthdays);
        break;
      default:
        break;
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
                placeholder="Nova tarefa"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
              <button onClick={handleAdd}><Plus size={16} /></button>
            </div>
            <ul className="dashboard-list">
              {tasks.map((t, i) => (
                <li
                  key={i}
                  className={t.done ? 'done' : ''}
                  onClick={() => toggleTaskDone(i)}
                >
                  {t.title}
                  <button className="delete-btn" onClick={() => handleDelete(i)}>
                    <Trash size={16} />
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
                placeholder="Nome do medicamento"
                value={newMedication.name}
                onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
              />
              <input
                type="time"
                value={newMedication.time}
                onChange={(e) => setNewMedication({ ...newMedication, time: e.target.value })}
              />
              <button onClick={handleAdd}><Plus size={16} /></button>
            </div>
            <ul className="dashboard-list">
              {medications.map((m, i) => (
                <li key={i}>
                  {m.name} - <span className="time">{m.time}</span>
                  <button className="delete-btn" onClick={() => handleDelete(i)}>
                    <Trash size={16} />
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
              <button onClick={handleAdd}><Plus size={16} /></button>
            </div>
            <ul className="dashboard-list">
              {agenda.map((a, i) => (
                <li key={i}>
                  {a.event} - <span className="time">{a.time}</span>
                  <button className="delete-btn" onClick={() => handleDelete(i)}>
                    <Trash size={16} />
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
                value={newBirthday.date}
                onChange={(e) => setNewBirthday({ ...newBirthday, date: e.target.value })}
              />
              <button onClick={handleAdd}><Plus size={16} /></button>
            </div>
            <ul className="dashboard-list">
              {birthdays.map((b, i) => {
                const formattedDate = b.date ? new Date(b.date).toLocaleDateString('pt-BR') : '';
                return (
                  <li key={i}>
                    {b.name} - <span className="time">{formattedDate}</span>
                    <button className="delete-btn" onClick={() => handleDelete(i)}>
                      <Trash size={16} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        );
      default:
        return null;
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