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
  pais: string;
  prioridad: string;
  visitado: boolean;
  notas: string;
};
const API_URL = "http://172.22.26.108:3000";
export default function App() {
  const [lista, setLista] = useState<Registro[]>([]);
  const [form, setForm] = useState<Record<string, string>>({
    nombre: "",
    pais: "",
    prioridad: "",
    visitado: "",
    notas: "",
  });
  const [id, setId] = useState("");
  const [mensaje, setMensaje] = useState("");
  async function cargar() {
    try {
      const r = await fetch(API_URL + "/destinos");
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
        pais: form.pais,
        prioridad: form.prioridad,
        visitado: form.visitado.toLowerCase() === "true",
        notas: form.notas,
      };
      const editando = id !== "";
      const r = await fetch(
        API_URL + "/destinos" + (editando ? "/" + id : ""),
        {
          method: editando ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        },
      );
      if (!r.ok) throw new Error();
      setId("");
      setForm({ nombre: "", pais: "", prioridad: "", visitado: "", notas: "" });
      await cargar();
    } catch {
      setMensaje("No se pudo guardar el registro.");
    }
  }
  async function borrar(registroId: number) {
    await fetch(API_URL + "/destinos/" + registroId, { method: "DELETE" });
    await cargar();
  }
  function editar(item: Registro) {
    setId(String(item.id));
    setForm({
      nombre: String(item.nombre),
      pais: String(item.pais),
      prioridad: String(item.prioridad),
      visitado: String(item.visitado),
      notas: String(item.notas),
    });
  }
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Destino Â· Ejercicio 10</Text>
      <Text style={styles.subtitle}>Datos guardados en PostgreSQL</Text>
      {mensaje !== "" && <Text style={styles.error}>{mensaje}</Text>}

      <TextInput
        placeholder="nombre"
        value={form.nombre}
        onChangeText={(valor) => setForm({ ...form, nombre: valor })}
        style={styles.input}
      />
      <TextInput
        placeholder="pais"
        value={form.pais}
        onChangeText={(valor) => setForm({ ...form, pais: valor })}
        style={styles.input}
      />
      <TextInput
        placeholder="prioridad"
        value={form.prioridad}
        onChangeText={(valor) => setForm({ ...form, prioridad: valor })}
        style={styles.input}
      />
      <TextInput
        placeholder="notas (mejora propia)"
        value={form.notas}
        onChangeText={(valor) => setForm({ ...form, notas: valor })}
        style={styles.input}
      />
      <TextInput
        placeholder="visitado"
        value={form.visitado}
        onChangeText={(valor) => setForm({ ...form, visitado: valor })}
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
              {String(item.nombre)} Â· {String(item.pais)} Â·{" "}
              {String(item.prioridad)} Â·{" "}
              {item.visitado ? "Visitado" : "Pendiente"}
            </Text>
            <Text style={styles.detail}>ID: {item.id}</Text>
            <Text style={styles.detail}>{item.notas}</Text>
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
