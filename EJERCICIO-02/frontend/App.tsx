import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";

type Pelicula = {
  favorito: boolean;
  id: number;
  titulo: string;
  genero: string;
  anio: number;
  puntuacion: number;
};

const API_URL = "http://172.22.26.108:3000";

export default function App() {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);

  async function cambiarFavorita(id: number) {
    await fetch(API_URL + "/peliculas/" + id + "/favorita", {
      method: "PATCH",
    });
    const respuesta = await fetch(API_URL + "/peliculas");
    setPeliculas(await respuesta.json());
  }

  useEffect(() => {
    fetch(API_URL + "/peliculas")
      .then((respuesta) => respuesta.json())
      .then((datos: Pelicula[]) => setPeliculas(datos));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>ðŸŽ¬ CineBox</Text>
      <FlatList
        data={peliculas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.movie}>{item.titulo}</Text>
            <Text>
              {item.genero} Â· {item.anio}
            </Text>
            <Text onPress={() => cambiarFavorita(item.id)}>
              Cambiar favorita
            </Text>
            <Text>â­ {Number(item.puntuacion).toFixed(1)}</Text>
            <Text>{item.favorito ? "â™¥" : "â™¡"}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 20 },
  title: { fontSize: 30, fontWeight: "800", marginBottom: 16 },
  card: {
    backgroundColor: "#FFF",
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
  },
  movie: { fontSize: 18, fontWeight: "700" },
});
