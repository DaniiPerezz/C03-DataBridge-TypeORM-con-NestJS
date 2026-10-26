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
type Registro = { id: number; modelo: string; marca: string; stock: number };
const API_URL = "http://172.22.26.108:3000";
export default function App() {
  const [lista, setLista] = useState<Registro[]>([]);
  const [form, setForm] = useState<Record<string, string>>({
    modelo: "",
    marca: "",
    stock: "",
  });
  const [id, setId] = useState("");
  const [mensaje, setMensaje] = useState("");
  async function cargar() {
    try {
      const r = await fetch(API_URL + "/sneakers");
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
        modelo: form.modelo,
        marca: form.marca,
        stock: Number(form.stock),
      };
      const editando = id !== "";
      const r = await fetch(
        API_URL + "/sneakers" + (editando ? "/" + id : ""),
        {
          method: editando ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        },
      );
      if (!r.ok) throw new Error();
      setId("");
      setForm({ modelo: "", marca: "", stock: "" });
      await cargar();
    } catch {
      setMensaje("No se pudo guardar el registro.");
    }
  }
  async function borrar(registroId: number) {
    await fetch(API_URL + "/sneakers/" + registroId, { method: "DELETE" });
    await cargar();
  }
  function editar(item: Registro) {
    setId(String(item.id));
    setForm({
      modelo: String(item.modelo),
      marca: String(item.marca),
      stock: String(item.stock),
    });
  }
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sneaker Â· Ejercicio 07</Text>
      <Text style={styles.subtitle}>Datos guardados en PostgreSQL</Text>
      {mensaje !== "" && <Text style={styles.error}>{mensaje}</Text>}

      <TextInput
        placeholder="modelo"
        value={form.modelo}
        onChangeText={(valor) => setForm({ ...form, modelo: valor })}
        style={styles.input}
      />
      <TextInput
        placeholder="marca"
        value={form.marca}
        onChangeText={(valor) => setForm({ ...form, marca: valor })}
        style={styles.input}
      />
      <TextInput
        placeholder="stock"
        value={form.stock}
        onChangeText={(valor) => setForm({ ...form, stock: valor })}
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
              {String(item.modelo)} Â· {String(item.marca)}
            </Text>
            <Text style={styles.detail}>
              {item.stock === 0 ? "AGOTADO" : "Stock: " + item.stock}
            </Text>
            <Text style={styles.detail}>ID: {item.id}</Text>
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
