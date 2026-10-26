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
  ciudad: string;
  categoria: string;
  fecha: string;
};
const API_URL = "http://172.22.26.108:3000";
export default function App() {
  const [lista, setLista] = useState<Registro[]>([]);
  const [form, setForm] = useState<Record<string, string>>({
    nombre: "",
    ciudad: "",
    categoria: "",
    fecha: "",
  });
  const [id, setId] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [filtroCiudad, setFiltroCiudad] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  async function cargar() {
    try {
      const r = await fetch(API_URL + "/eventos");
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
        ciudad: form.ciudad,
        categoria: form.categoria,
        fecha: form.fecha,
      };
      const editando = id !== "";
      const r = await fetch(API_URL + "/eventos" + (editando ? "/" + id : ""), {
        method: editando ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      if (!r.ok) throw new Error();
      setId("");
      setForm({ nombre: "", ciudad: "", categoria: "", fecha: "" });
      await cargar();
    } catch {
      setMensaje("No se pudo guardar el registro.");
    }
  }
  async function borrar(registroId: number) {
    await fetch(API_URL + "/eventos/" + registroId, { method: "DELETE" });
    await cargar();
  }
  async function filtrar() {
    const parametros = new URLSearchParams();
    if (filtroCiudad) parametros.set("ciudad", filtroCiudad);
    if (filtroCategoria) parametros.set("categoria", filtroCategoria);
    const respuesta = await fetch(
      API_URL + "/eventos?" + parametros.toString(),
    );
    setLista(await respuesta.json());
  }
  function editar(item: Registro) {
    setId(String(item.id));
    setForm({
      nombre: String(item.nombre),
      ciudad: String(item.ciudad),
      categoria: String(item.categoria),
      fecha: String(item.fecha),
    });
  }
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Evento Â· Ejercicio 09</Text>
      <Text style={styles.subtitle}>Datos guardados en PostgreSQL</Text>
      {mensaje !== "" && <Text style={styles.error}>{mensaje}</Text>}
      <TextInput
        placeholder="Filtrar por ciudad"
        value={filtroCiudad}
        style={styles.input}
        onChangeText={setFiltroCiudad}
      />
      <TextInput
        placeholder="Filtrar por categorÃ­a"
        value={filtroCategoria}
        style={styles.input}
        onChangeText={setFiltroCategoria}
      />
      <TouchableOpacity style={styles.button} onPress={filtrar}>
        <Text style={styles.buttonText}>Aplicar filtros</Text>
      </TouchableOpacity>
      <TextInput
        placeholder="nombre"
        value={form.nombre}
        onChangeText={(valor) => setForm({ ...form, nombre: valor })}
        style={styles.input}
      />
      <TextInput
        placeholder="ciudad"
        value={form.ciudad}
        onChangeText={(valor) => setForm({ ...form, ciudad: valor })}
        style={styles.input}
      />
      <TextInput
        placeholder="categoria"
        value={form.categoria}
        onChangeText={(valor) => setForm({ ...form, categoria: valor })}
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
              {String(item.nombre)} Â· {String(item.ciudad)} Â·{" "}
              {String(item.categoria)} Â· {String(item.fecha)}
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
