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
  destino: string;
  pais: string;
  estado: string;
  fecha: string;
};
const API_URL = "http://172.22.26.108:3000";
export default function App() {
  const [lista, setLista] = useState<Registro[]>([]);
  const [form, setForm] = useState<Record<string, string>>({
    destino: "",
    pais: "",
    estado: "",
    fecha: "",
  });
  const [id, setId] = useState("");
  const [mensaje, setMensaje] = useState("");
  async function cargar() {
    try {
      const r = await fetch(API_URL + "/viajes");
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
        destino: form.destino,
        pais: form.pais,
        estado: form.estado,
        fecha: form.fecha,
      };
      const editando = id !== "";
      const r = await fetch(API_URL + "/viajes" + (editando ? "/" + id : ""), {
        method: editando ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      if (!r.ok) throw new Error();
      setId("");
      setForm({ destino: "", pais: "", estado: "", fecha: "" });
      await cargar();
    } catch {
      setMensaje("No se pudo guardar el registro.");
    }
  }
  async function borrar(registroId: number) {
    await fetch(API_URL + "/viajes/" + registroId, { method: "DELETE" });
    await cargar();
  }
  function editar(item: Registro) {
    setId(String(item.id));
    setForm({
      destino: String(item.destino),
      pais: String(item.pais),
      estado: String(item.estado),
      fecha: String(item.fecha),
    });
  }
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Viaje Â· Ejercicio 05</Text>
      <Text style={styles.subtitle}>Datos guardados en PostgreSQL</Text>
      {mensaje !== "" && <Text style={styles.error}>{mensaje}</Text>}

      <TextInput
        placeholder="destino"
        value={form.destino}
        onChangeText={(valor) => setForm({ ...form, destino: valor })}
        style={styles.input}
      />
      <TextInput
        placeholder="pais"
        value={form.pais}
        onChangeText={(valor) => setForm({ ...form, pais: valor })}
        style={styles.input}
      />
      <TextInput
        placeholder="estado"
        value={form.estado}
        onChangeText={(valor) => setForm({ ...form, estado: valor })}
        style={styles.input}
      />
      <TextInput
        placeholder="fecha"
        value={form.fecha}
        onChangeText={(valor) => setForm({ ...form, fecha: valor })}
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
              {String(item.destino)} Â· {String(item.pais)} Â·{" "}
              {String(item.estado)} Â· {String(item.fecha)}
            </Text>
            <Text style={styles.detail}>ID: {item.id}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => editar(item)}>
                <Text style={styles.action}>Editar</Text>
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
