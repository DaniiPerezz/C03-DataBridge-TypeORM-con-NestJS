import { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
type Registro = {
  id: number;
  nombre: string;
  canciones?: { id: number; nombre: string; artista: string }[];
};
const API_URL = "http://172.22.26.108:3000";
export default function App() {
  const [lista, setLista] = useState<Registro[]>([]);
  const [form, setForm] = useState<Record<string, string>>({ nombre: "" });
  const [id, setId] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cancion, setCancion] = useState("");
  const [artista, setArtista] = useState("");
  const [playlistId, setPlaylistId] = useState("1");
  async function cargar() {
    try {
      const r = await fetch(API_URL + "/playlists");
      if (!r.ok) throw new Error();
      setLista(await r.json());
      setMensaje("");
    } catch {
      setMensaje(
        "No se pudo conectar. Revisa PostgreSQL, NestJS y la IP local.",
      );
    }
  }
  useEffect(() => {
    cargar();
  }, []);
  async function guardar() {
    try {
      const datos = { nombre: form.nombre };
      const editando = id !== "";
      const r = await fetch(
        API_URL + "/playlists" + (editando ? "/" + id : ""),
        {
          method: editando ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        },
      );
      if (!r.ok) throw new Error();
      setId("");
      setForm({ nombre: "" });
      await cargar();
    } catch {
      setMensaje("No se pudo guardar el registro.");
    }
  }
  async function borrar(registroId: number) {
    await fetch(API_URL + "/playlists/" + registroId, { method: "DELETE" });
    await cargar();
  }
  async function anadirCancion() {
    const respuesta = await fetch(
      API_URL + "/playlists/" + playlistId + "/canciones",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: cancion, artista }),
      },
    );
    if (respuesta.ok) {
      setCancion("");
      setArtista("");
      await cargar();
    }
  }
  function editar(item: Registro) {
    setId(String(item.id));
    setForm({ nombre: String(item.nombre) });
  }
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Playlist Â· Ejercicio 08</Text>
      <Text style={styles.subtitle}>Datos guardados en PostgreSQL</Text>
      {mensaje !== "" && <Text style={styles.error}>{mensaje}</Text>}
      <Text style={styles.subtitle}>AÃ±adir canciÃ³n a la playlist indicada</Text>
      <TextInput
        placeholder="ID de playlist"
        value={playlistId}
        onChangeText={setPlaylistId}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Nombre de canciÃ³n"
        value={cancion}
        onChangeText={setCancion}
        style={styles.input}
      />
      <TextInput
        placeholder="Artista"
        value={artista}
        onChangeText={setArtista}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={anadirCancion}>
        <Text style={styles.buttonText}>AÃ±adir canciÃ³n</Text>
      </TouchableOpacity>
      <TextInput
        placeholder="nombre"
        value={form.nombre}
        onChangeText={(valor) => setForm({ ...form, nombre: valor })}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={guardar}>
        <Text style={styles.buttonText}>
          {id ? "Guardar cambios" : "AÃ±adir"}
        </Text>
      </TouchableOpacity>
      <FlatList
        data={lista}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.itemTitle}>{String(item.nombre)}</Text>
            <Text style={styles.detail}>ID: {item.id}</Text>
            {item.canciones?.map((c) => (
              <Text key={c.id} style={styles.detail}>
                {c.nombre} Â· {c.artista}
              </Text>
            ))}
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => editar(item)}>
                <Text style={styles.action}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => borrar(item.id)}>
                <Text style={styles.delete}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A", padding: 20 },
  title: { fontSize: 26, fontWeight: "800", color: "#FFF", marginVertical: 12 },
  subtitle: { color: "#94A3B8", marginBottom: 14 },
  input: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#0F766E",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: { color: "#FFF", fontWeight: "800" },
  card: {
    backgroundColor: "#1E293B",
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
  },
  itemTitle: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  detail: { color: "#94A3B8", marginTop: 5 },
  actions: { flexDirection: "row", gap: 20, marginTop: 12 },
  action: { color: "#38BDF8", fontWeight: "700" },
  delete: { color: "#FCA5A5", fontWeight: "700" },
  error: { color: "#FCA5A5", marginBottom: 10 },
});
