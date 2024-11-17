import { useState } from "react";

function App() {
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({ date: "", distance: "" });
  const [editIndex, setEditIndex] = useState(null);

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0"); // Получить день с ведущим нулём
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы начинаются с 0
    const year = date.getFullYear(); // Получить год

    return `${day}.${month}.${year}`; // Сформировать строку
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const { date, distance } = formData;

    if (!date || !distance) return;

    const inputDate = new Date(date);
    const formattedDate = formatDate(inputDate);

    const newEntry = {
      date: formattedDate,
      distance: parseFloat(distance),
    };

    if (editIndex !== null) {
      // Редактирование существующей записи
      const updatedEntries = [...entries];
      updatedEntries[editIndex] = newEntry;
      setEntries(sortAndMergeEntries(updatedEntries));
      setEditIndex(null);
    } else {
      // Добавление новой записи
      const existingIndex = entries.findIndex((entry) => entry.date === formattedDate);

      if (existingIndex !== -1) {
        // Если дата уже существует, обновляем запись
        entries[existingIndex].distance += newEntry.distance;
        setEntries(sortAndMergeEntries(entries));
      } else {
        // Добавляем новую запись
        setEntries(sortAndMergeEntries([...entries, newEntry]));
      }
    }

    setFormData({ date: "", distance: "" });
  };

  const sortAndMergeEntries = (data) =>
    data.slice().sort((a, b) => {
      // Преобразуем даты из формата DD.MM.YYYY в формат YYYY-MM-DD
      const dateA = new Date(a.date.split(".").reverse().join("-"));
      const dateB = new Date(b.date.split(".").reverse().join("-"));

      return dateB.getTime() - dateA.getTime();
    });

  const handleDelete = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    const entry = entries[index];
    const [day, month, year] = entry.date.split(".");
    const formattedDate = `${year}-${month}-${day}`;
    setFormData({ date: formattedDate, distance: entry.distance.toString() });
    setEditIndex(index);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <form onSubmit={handleFormSubmit} style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex" }}>
          <div style={{ margin: "10px" }}>
            <label>
              Дата:
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <div style={{ margin: "10px" }}>
            <label>
              Километры:
              <input
                type="number"
                name="distance"
                value={formData.distance}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <button type="submit">OK</button>
        </div>
      </form>
      <table border="1" cellPadding="5" cellSpacing="0" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Дата (ДД.ММ.ГГ)</th>
            <th>Пройдено км</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index}>
              <td>{entry.date}</td>
              <td>{entry.distance.toFixed(1)} км</td>
              <td>
                <button onClick={() => handleEdit(index)}>✎</button>
                <button onClick={() => handleDelete(index)}>✘</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
