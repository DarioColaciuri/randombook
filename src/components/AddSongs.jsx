import { useEffect } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, getDocs } from "firebase/firestore";

const AddSongs = () => {
  useEffect(() => {
    const addSongsToFirebase = async () => {
      const songs = [
        "A los jóvenes de ayer",
        "a puro dolor",
        "A rodar mi vida",
        "al vacio",
        "algo contigo",
        "Alma de diamante",
        "Amarte así",
        "amor narcotico",
        "Amores como el nuestro",
        "Azul",
        "bamboleo",
        "Barro tal vez",
        "Bastara",
        "bicho de ciudad",
        "Buenos Aires",
        "Bésame mucho",
        "Cactus",
        "Cadaver exquisito",
        "Campanas en la noche",
        "Canción de Alicia en el país",
        "caraluna",
        "Chipi chipi",
        "Cinema verite",
        "clandestino",
        "clara",
        "como eran las cosas",
        "Como es posible",
        "Como un cuento",
        "corazon partio",
        "Crazy",
        "Crímenes perfectos",
        "Culpable o no",
        "Dame",
        "Dame un limon",
        "De mi",
        "Deja de llorar",
        "desconfio",
        "Después de ti",
        "Dia de enero",
        "Donde manda marinero",
        "Dont stop me now",
        "Dont you worry about a thing",
        "Dos días en la vida",
        "Durazno sangrando",
        "El arriero",
        "El loco",
        "Entrégate",
        "Esa estrella era mi lujo",
        "esta saliendo el sol",
        "Estadio azteca",
        "Falling",
        "Filosofía barata y zapatos de goma",
        "Fría como el viento",
        "Fuiste",
        "Giros",
        "Hasta que me olvides",
        "How deep is your love",
        "I will survive",
        "If i aint got you",
        "Inevitable",
        "Influencia",
        "Isnt she lovely",
        "Juntos para siempre",
        "Killing me softly",
        "la bilirrubina",
        "La incondicional",
        "La media vuelta",
        "La parte de adelante",
        "La rueda mágica",
        "la vida es una moneda",
        "Las oportunidades",
        "Limon y sal",
        "Lloviendo estrellas",
        "Loco",
        "Los aviones",
        "Love of my life",
        "Marchate ahora",
        "Me arde",
        "Me gusta ese tajo",
        "Me quedo aquí",
        "Me siento mejor",
        "Mentirosa",
        "Michelle",
        "Mil horas",
        "No hace falta que lo digas",
        "No me arrepiento de este amor",
        "No podrás",
        "No te alejes tanto de mi",
        "No te creas tan importante",
        "No voy a llorar",
        "No voy en tren",
        "Nunca me faltes",
        "Nunca quise",
        "Ojos de videotape",
        "Paloma",
        "Parte del aire",
        "Peperina",
        "Persiana americana",
        "Petalo de sal",
        "Por amarte así",
        "Por mil noches",
        "Procura",
        "Promesas sobre el bidet",
        "Que ves",
        "Rehab",
        "Rumba del piano",
        "Secretos",
        "Seguir viviendo sin tu amor",
        "si tu no estas",
        "Solo dios sabe",
        "Somebody to love",
        "Stand by me",
        "Strawberry fields",
        "Suave",
        "Tan lejos",
        "Te para tres",
        "Te quiero igual",
        "tengo la camisa negra",
        "Tengo todo excepto a ti",
        "Till there was you",
        "Todo a pulmón",
        "Todo se transforma",
        "todo sigue igual",
        "Tu amor",
        "Tu vida mi vida",
        "Un hombre busca a una mujer",
        "Un vestido y un amor",
        "Un ángel para tu soledad",
        "Una calle me separa",
        "Una piba con la remera de greenpeace",
        "Valerie",
        "Virtual insanity",
        "volare",
        "Vuelos",
        "Wapo traketero",
        "We are the champions",
        "Yo tomo licor"
      ];

      // Convertir a minúsculas y eliminar duplicados
      const uniqueSongs = Array.from(new Set(songs.map(song => song.toLowerCase())));

      try {
        const collectionRef = collection(db, "canciones");
        const querySnapshot = await getDocs(collectionRef);
        const existingSongs = querySnapshot.docs.map(doc => doc.data().name.toLowerCase());

        for (const name of uniqueSongs) {
          if (!existingSongs.includes(name)) {
            await addDoc(collectionRef, {
              name,
              composer: '',
              transcription: 'daro',
              status: 'incomplete',
            });
            console.log(`Added song: ${name}`);
          }
        }
        console.log('All songs added successfully!');
      } catch (error) {
        console.error('Error adding songs: ', error);
      }
    };

    addSongsToFirebase();
  }, []);

  return <div>Adding songs...</div>;
};

export default AddSongs;