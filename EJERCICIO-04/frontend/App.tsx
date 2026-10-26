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
  tipo: string;
  ciudad: string;
  precioMedio: number;
};
const API_URL = "http://172.22.26.108:3000";
export default function App() {
  const [lista, setLista] = useState<Registro[]>([]);
  const [form, setForm] = useState<Record<string, string>>({
    nombre: "",
    tipo: "",
    ciudad: "",
    precioMedio: "",
  });
  const [id, setId] = useState("");
  const [mensaje, setMensaje] = useState("");
  async function cargar() {
    try {
      const r = await fetch(API_URL + "/restaurantes");
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
        nombre: form.nombre,
        tipo: form.tipo,
        ciudad: form.ciudad,
        precioMedio: Number(form.precioMedio),
      };
      const editando = id !== "";
      const r = await fetch(
        API_URL + "/restaurantes" + (editando ? "/" + id : ""),
        {
          method: editando ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        },
      );
      if (!r.ok) throw new Error();
      setId("");
      setForm({ nombre: "", tipo: "", ciudad: "", precioMedio: "" });
      await cargar();
    } catch {
      setMensaje("No se pudo guardar el registro.");
    }
  }
  async function borrar(registroId: number) {
    await fetch(API_URL + "/restaurantes/" + registroId, { method: "DELETE" });
    await cargar();
  }
  function editar(item: Registro) {
    setId(String(item.id));
    setForm({
      nombre: String(item.nombre),
      tipo: String(item.tipo),
      ciudad: String(item.ciudad),
      precioMedio: String(item.precioMedio),
    });
  }
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Restaurante Â· Ejercicio 04</Text>
      <Text style={styles.subtitle}>Datos guardados en PostgreSQL</Text>
      {mensaje !== "" && <Text style={styles.error}>{mensaje}</Text>}

      <TextInput
        placeholder="nombre"
        value={form.nombre}
        onChangeText={(valor) => setForm({ ...form, nombre: valor })}
        style={styles.input}
      />
      <TextInput
        placeholder="tipo"
        value={form.tipo}
        onChangeText={(valor) => setForm({ ...form, tipo: valor })}
        style={styles.input}
      />
      <TextInput
        placeholder="ciudad"
        value={form.ciudad}
        onChangeText={(valor) => setForm({ ...form, ciudad: valor })}
        style={styles.input}
      />
      <TextInput
        placeholder="precioMedio"
        value={form.precioMedio}
        onChangeText={(valor) => setForm({ ...form, precioMedio: valor })}
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
              {String(item.nombre)} Â· {String(item.tipo)} Â·{" "}
              {String(item.ciudad)} Â· {String(item.precioMedio)}
            </Text>
            <Text style={styles.detail}>ID: {item.id}</Text>
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
