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
  especie: string;
  edad: number;
  nivelEnergia: string;
};
const API_URL = "http://172.22.26.108:3000";
export default function App() {
  const [lista, setLista] = useState<Registro[]>([]);
  const [form, setForm] = useState<Record<string, string>>({
    nombre: "",
    especie: "",
    edad: "",
    nivelEnergia: "",
  });
  const [id, setId] = useState("");
  const [mensaje, setMensaje] = useState("");
  async function cargar() {
    try {
      const r = await fetch(API_URL + "/mascotas");
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
        especie: form.especie,
        edad: Number(form.edad),
        nivelEnergia: form.nivelEnergia,
      };
      const editando = id !== "";
      const r = await fetch(
        API_URL + "/mascotas" + (editando ? "/" + id : ""),
        {
          method: editando ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        },
      );
      if (!r.ok) throw new Error();
      setId("");
      setForm({ nombre: "", especie: "", edad: "", nivelEnergia: "" });
      await cargar();
    } catch {
      setMensaje("No se pudo guardar el registro.");
    }
  }
  async function borrar(registroId: number) {
    await fetch(API_URL + "/mascotas/" + registroId, { method: "DELETE" });
    await cargar();
  }
  function editar(item: Registro) {
    setId(String(item.id));
    setForm({
      nombre: String(item.nombre),
      especie: String(item.especie),
      edad: String(item.edad),
      nivelEnergia: String(item.nivelEnergia),
    });
  }
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Mascota Â· Ejercicio 03</Text>
      <Text style={styles.subtitle}>Datos guardados en PostgreSQL</Text>
      {mensaje !== "" && <Text style={styles.error}>{mensaje}</Text>}

      <TextInput
        placeholder="ID de la mascota"
        value={id}
        onChangeText={setId}
        style={styles.input}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          fetch(API_URL + "/mascotas/" + id)
            .then((r) => r.json())
            .then((x) => setLista(x.id ? [x] : []))
            .catch(() => setMensaje("No se encontrÃ³ la mascota."))
        }
      >
        <Text style={styles.buttonText}>Buscar mascota</Text>
      </TouchableOpacity>
      <FlatList
        data={lista}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.itemTitle}>
              {String(item.nombre)} Â· {String(item.especie)} Â·{" "}
              {String(item.edad)} Â· {String(item.nivelEnergia)}
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
