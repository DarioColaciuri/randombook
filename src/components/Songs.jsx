import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, query, getDocs, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import './CSS/Songs.css';

const Songs = () => {
  const [songs, setSongs] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [newSong, setNewSong] = useState({
    name: '',
    composer: '',
    transcription: '',
    status: 'incomplete',
  });

  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const statusOptions = ['complete', 'incomplete', 'ongoing'];
  const transcriptionOptions = ['daro', 'diego', 'ale'];

  const getSongs = async () => {
    const q = query(collection(db, "canciones"));
    const querySnapshot = await getDocs(q);
    const songsList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setSongs(sortSongs(songsList));
  };

  const sortSongs = (songsList) => {
    const sortedSongs = [...songsList];
    sortedSongs.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sortedSongs;
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    const sortedSongs = sortSongs(songs);
    setSongs(sortedSongs);
  };

  const handleEditChange = (e, id, field) => {
    const newSongs = songs.map(song => {
      if (song.id === id) {
        return { ...song, [field]: e.target.value };
      }
      return song;
    });
    setSongs(newSongs);
  };

  const saveChanges = async (id) => {
    const songToUpdate = songs.find(song => song.id === id);
    const songRef = doc(db, "canciones", id);
    await updateDoc(songRef, songToUpdate);
    setEditMode(null);
  };

  const handleNewSongChange = (e) => {
    setNewSong({ ...newSong, [e.target.name]: e.target.value });
  };

  const addNewSong = async () => {
    const collectionRef = collection(db, "canciones");
    await addDoc(collectionRef, newSong);
    setNewSong({
      name: '',
      composer: '',
      transcription: '',
      status: 'incomplete',
      isAdding: false,
    });
    getSongs();  // Actualiza la lista de canciones después de agregar una nueva
  };

  const deleteSong = async (id) => {
    const songRef = doc(db, "canciones", id);
    await deleteDoc(songRef);
    getSongs();  // Actualiza la lista de canciones después de eliminar una canción
  };

  useEffect(() => {
    getSongs();
  }, [sortConfig]);

  // Determina la clase según el valor de status
  const getStatusClass = (status) => {
    switch (status) {
      case 'complete':
        return 'complete';
      case 'incomplete':
        return 'incomplete';
      case 'ongoing':
        return 'ongoing';
      default:
        return '';
    }
  };

  return (
    <>
      <h1>Aca van las canciones</h1>
      <button onClick={() => setNewSong({ ...newSong, isAdding: true })}>+</button>
      {newSong.isAdding && (
        <div className="new-song-form">
          <h2>Agregar Nueva Canción</h2>
          <input
            type="text"
            name="name"
            placeholder="Nombre de canción"
            value={newSong.name}
            onChange={handleNewSongChange}
          />
          <input
            type="text"
            name="composer"
            placeholder="Compositor"
            value={newSong.composer}
            onChange={handleNewSongChange}
          />
          <select
            name="transcription"
            value={newSong.transcription}
            onChange={handleNewSongChange}
          >
            <option value="" disabled>Seleccione Transcription</option>
            {transcriptionOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <select
            name="status"
            value={newSong.status}
            onChange={handleNewSongChange}
          >
            <option value="" disabled>Seleccione Status</option>
            {statusOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <button onClick={addNewSong}>Agregar</button>
          <button onClick={() => setNewSong({ ...newSong, isAdding: false })}>Cancelar</button>
        </div>
      )}
      <table className="songs-table">
        <thead>
          <tr>
            <th className="sort" onClick={() => handleSort('name')}>Nombre de canción ⬍</th>
            <th className="sort" onClick={() => handleSort('composer')}>Compositor ⬍</th>
            <th className="sort" onClick={() => handleSort('transcription')}>Transcripción ⬍</th>
            <th className="sort" onClick={() => handleSort('status')}>Status ⬍</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {songs.map(song => (
            <tr key={song.id} className={getStatusClass(song.status)}>
              {editMode === song.id ? (
                <>
                  <td><input type="text" value={song.name} onChange={(e) => handleEditChange(e, song.id, 'name')} /></td>
                  <td><input type="text" value={song.composer} onChange={(e) => handleEditChange(e, song.id, 'composer')} /></td>
                  <td>
                    <select
                      value={song.transcription}
                      onChange={(e) => handleEditChange(e, song.id, 'transcription')}
                    >
                      <option value="" disabled>Seleccione Transcription</option>
                      {transcriptionOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={song.status}
                      onChange={(e) => handleEditChange(e, song.id, 'status')}
                    >
                      <option value="" disabled>Seleccione Status</option>
                      {statusOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button onClick={() => saveChanges(song.id)}>Guardar</button>
                    <button onClick={() => setEditMode(null)}>Cancelar</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{song.name}</td>
                  <td>{song.composer}</td>
                  <td>{song.transcription}</td>
                  <td>{song.status}</td>
                  <td>
                    <button onClick={() => setEditMode(song.id)}>Editar</button>
                    <button onClick={() => deleteSong(song.id)}>Eliminar</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Songs;