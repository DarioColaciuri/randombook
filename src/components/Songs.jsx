import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import Loader from "./Loader";
import {
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import "./CSS/Songs.css";

const Songs = () => {
  const [songs, setSongs] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [newSong, setNewSong] = useState({
    name: "",
    composer: "",
    transcription: "",
    status: "incomplete",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const statusOptions = ["complete", "incomplete", "ongoing"];
  const transcriptionOptions = ["daro", "diego", "ale"];

  const getSongs = async () => {
    setIsLoading(true);
    const q = query(collection(db, "canciones"));
    const querySnapshot = await getDocs(q);
    const songsList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSongs(sortSongs(songsList));
    setIsLoading(false);
  };

  const sortSongs = (songsList) => {
    const sortedSongs = [...songsList];
    sortedSongs.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    return sortedSongs;
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    const sortedSongs = sortSongs(songs);
    setSongs(sortedSongs);
  };

  const handleEditChange = (e, id, field) => {
    const newSongs = songs.map((song) => {
      if (song.id === id) {
        return { ...song, [field]: field === "name" ? e.target.value.toLowerCase() : e.target.value };
      }
      return song;
    });
    setSongs(newSongs);
  };

  const cancelChanges = () => {
    Toastify({
      text: "Cambios no guardados",
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #b00000, #c93d3d)",
      },
    }).showToast();
  };

  const saveChanges = async (id) => {
    setShowLoader(true);
    const songToUpdate = songs.find((song) => song.id === id);
    const songRef = doc(db, "canciones", id);
    await updateDoc(songRef, songToUpdate);
    setEditMode(null);
    setShowLoader(false);

    Toastify({
      text: "Cancion guardada correctamente",
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #00b06d, #96c93d)",
      },
    }).showToast();
  };

  const handleNewSongChange = (e) => {
    setNewSong({ 
      ...newSong, 
      [e.target.name]: e.target.name === "name" ? e.target.value.toLowerCase() : e.target.value 
    });
  };

  const addNewSong = async () => {
    setShowLoader(true);
    const collectionRef = collection(db, "canciones");
    await addDoc(collectionRef, newSong);
    setNewSong({
      name: "",
      composer: "",
      transcription: "",
      status: "incomplete",
      isAdding: false,
    });
    Toastify({
      text: "Cancion creada correctamente",
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #1a00b0, #573dc9)",
      },
    }).showToast();
    getSongs();
    setShowLoader(false);
  };

  const deleteSong = async (id) => {
    Swal.fire({
      title: "Estas seguro de que queres borrar la canción?",
      text: "Alejandro, no podras revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, borrala pa."
    }).then(async (result) => {
      if (result.isConfirmed) {
        setShowLoader(true);
        const songRef = doc(db, "canciones", id);
        await deleteDoc(songRef);
        getSongs();
        setShowLoader(false);
        Swal.fire({
          title: "Cancion eliminada",
          text: "Espero que no te hayas confundido",
          icon: "success"
        });
      }
    });
  };

  useEffect(() => {
    getSongs();
  }, [sortConfig]);

  const getStatusClass = (status) => {
    switch (status) {
      case "complete":
        return "complete";
      case "incomplete":
        return "incomplete";
      case "ongoing":
        return "ongoing";
      default:
        return "";
    }
  };

  return (
    <>
      {showLoader && <Loader />}
      <button
        className="new-song-button"
        onClick={() => setNewSong({ ...newSong, isAdding: true })}
      >
        <i className="bi bi-plus-circle"></i>
      </button>
      {newSong.isAdding && (
        <div className="new-song-form">
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
            <option value="" disabled>
              transcriptor
            </option>
            {transcriptionOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            name="status"
            value={newSong.status}
            onChange={handleNewSongChange}
          >
            <option value="" disabled>
              Seleccione Status
            </option>
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button className="edit" onClick={addNewSong}>
            <i className="bi bi-plus-circle"></i>
          </button>
          <button
            className="delete"
            onClick={() => {
              setNewSong({ ...newSong, isAdding: false });
              cancelChanges();
            }}
          >
            <i className="bi bi-x-circle"></i>
          </button>
        </div>
      )}
      <table className="songs-table">
        <thead>
          <tr>
            <th className="sort" onClick={() => handleSort("name")}>
              Nombre de canción ⬍
            </th>
            <th className="sort" onClick={() => handleSort("composer")}>
              Compositor ⬍
            </th>
            <th className="sort" onClick={() => handleSort("transcription")}>
              Transcripción ⬍
            </th>
            <th className="sort" onClick={() => handleSort("status")}>
              Status ⬍
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="5" className="loading">
                Cargando... <Loader />
              </td>
            </tr>
          ) : (
            songs.map((song) => (
              <tr key={song.id} className={getStatusClass(song.status)}>
                {editMode === song.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={song.name}
                        onChange={(e) => handleEditChange(e, song.id, "name")}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={song.composer}
                        onChange={(e) => handleEditChange(e, song.id, "composer")}
                      />
                    </td>
                    <td>
                      <select
                        value={song.transcription}
                        onChange={(e) => handleEditChange(e, song.id, "transcription")}
                      >
                        <option value="" disabled>
                          Seleccione Transcription
                        </option>
                        {transcriptionOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={song.status}
                        onChange={(e) => handleEditChange(e, song.id, "status")}
                      >
                        <option value="" disabled>
                          Seleccione Status
                        </option>
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="actions">
                      <button
                        className="save"
                        onClick={() => saveChanges(song.id)}
                      >
                        <i className="bi bi-floppy"></i>
                      </button>
                      <button
                        className="cancel"
                        onClick={() => {
                          setEditMode(null);
                          cancelChanges();
                        }}
                      >
                        <i className="bi bi-x-circle"></i>
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{song.name}</td>
                    <td>{song.composer}</td>
                    <td>{song.transcription}</td>
                    <td>{song.status}</td>
                    <td className="actions">
                      <button
                        className="edit"
                        onClick={() => setEditMode(song.id)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        className="delete"
                        onClick={() => deleteSong(song.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
};

export default Songs;