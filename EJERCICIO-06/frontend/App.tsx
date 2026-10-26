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
type Registro = { id: number; titulo: string; autor: string; leido: boolean };
const API_URL = "http://172.22.26.108:3000";
export default function App() {
  const [lista, setLista] = useState<Registro[]>([]);
  const [form, setForm] = useState<Record<string, string>>({
    titulo: "",
    autor: "",
    leido: "",
  });
  const [id, setId] = useState("");
  const [mensaje, setMensaje] = useState("");
  async function cargar() {
    try {
      const r = await fetch(API_URL + "/libros");
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
      const datos = {
        titulo: form.titulo,
        autor: form.autor,
        leido: form.leido.toLowerCase() === "true",
      };
      const editando = id !== "";
      const r = await fetch(API_URL + "/libros" + (editando ? "/" + id : ""), {
        method: editando ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      if (!r.ok) throw new Error();
      setId("");
      setForm({ titulo: "", autor: "", leido: "" });
      await cargar();
    } catch {
      setMensaje("No se pudo guardar el registro.");
    }
  }
  async function borrar(registroId: number) {
    await fetch(API_URL + "/libros/" + registroId, { method: "DELETE" });
    await cargar();
  }
  function editar(item: Registro) {
    setId(String(item.id));
    setForm({
      titulo: String(item.titulo),
      autor: String(item.autor),
      leido: String(item.leido),
    });
  }
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Libro Â· Ejercicio 06</Text>
      <Text style={styles.subtitle}>Datos guardados en PostgreSQL</Text>
      {mensaje !== "" && <Text style={styles.error}>{mensaje}</Text>}

      <TextInput
        placeholder="titulo"
        value={form.titulo}
        onChangeText={(valor) => setForm({ ...form, titulo: valor })}
        style={styles.input}
      />
      <TextInput
        placeholder="autor"
        value={form.autor}
        onChangeText={(valor) => setForm({ ...form, autor: valor })}
        style={styles.input}
      />
      <TextInput
        placeholder="leido"
        value={form.leido}
        onChangeText={(valor) => setForm({ ...form, leido: valor })}
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
            <Text style={styles.itemTitle}>
              {String(item.titulo)} Â· {String(item.autor)} Â·{" "}
              {item.leido ? "LeÃ­do" : "Pendiente"}
            </Text>
            <Text style={styles.detail}>ID: {item.id}</Text>
            <TouchableOpacity
              onPress={async () => {
                await fetch(API_URL + "/libros/" + item.id + "/leido", {
                  method: "PATCH",
                });
                await cargar();
              }}
            >
              <Text style={styles.action}>Marcar como leÃ­do / pendiente</Text>
            </TouchableOpacity>
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
