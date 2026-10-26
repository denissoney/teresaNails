import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";

const CORES = {
  fundo: "#F7F0EC", rosa: "#F2C5B7", rosaCard: "#F9D8D0", rosaBotao: "#E8AFA0",
  texto: "#171514", secundario: "#756963", dourado: "#C9A96E", branco: "#FFFFFF", borda: "#E9DCD5",
};

export default function EditarPerfil() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email || "");
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setNome(data.nome || "");
        setTelefone(data.telefone || "");
      }
      setLoading(false);
    }
    load();
  }, []);

  async function salvar() {
    if (!nome.trim() || !telefone.trim()) {
      Alert.alert("Campos obrigatórios", "Preencha nome e telefone");
      return;
    }
    setSalvando(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sem usuário");

      const { error } = await supabase.from("profiles").update({
        nome: nome.trim(),
        telefone: telefone.trim(),
      } as any).eq("id", user.id);

      if (error) throw error;
      router.replace("/perfil-salvo");
    } catch (e: any) {
      Alert.alert("Erro", e.message);
    } finally {
      setSalvando(false);
    }
  }

  if (loading) return <View style={[styles.container, { paddingTop: insets.top, flex:1, justifyContent:"center"}]}><ActivityIndicator color={CORES.dourado} /></View>;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 28 }]}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.btnBack} onPress={() => router.back()}><Ionicons name="arrow-back" size={22} color={CORES.texto} /></TouchableOpacity>
            <Text style={styles.titulo}>Editar perfil</Text>
            <View style={styles.headerEspaco} />
          </View>

          <View style={styles.formCard}>
            <Text style={styles.label}>Nome completo</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={19} color={CORES.secundario} />
              <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Seu nome" />
            </View>

            <Text style={styles.label}>Telefone</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={19} color={CORES.secundario} />
              <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
            </View>

            <Text style={styles.label}>E-mail (não editável)</Text>
            <View style={[styles.inputWrapper, { opacity: 0.6 }]}>
              <Ionicons name="mail-outline" size={19} color={CORES.secundario} />
              <TextInput style={styles.input} value={email} editable={false} />
            </View>

            <TouchableOpacity style={styles.btnSalvar} onPress={salvar} disabled={salvando}>
              {salvando ? <ActivityIndicator color="#fff" /> : <><Ionicons name="checkmark-circle-outline" size={21} color={CORES.branco}/><Text style={styles.btnSalvarText}>Salvar alterações</Text></>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnCancelar} onPress={() => router.back()}><Text style={styles.btnCancelarText}>Cancelar</Text></TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CORES.fundo },
  keyboard: { flex: 1 },
  scrollContent: { paddingBottom: 28 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 18, paddingVertical: 10 },
  btnBack: { width: 42, height: 42, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  titulo: { fontSize: 17, fontWeight: "800", color: CORES.texto },
  headerEspaco: { width: 42 },
  formCard: { marginHorizontal: 16, marginTop: 24, padding: 17, backgroundColor: CORES.branco, borderRadius: 22, borderWidth: 1, borderColor: CORES.borda },
  label: { fontSize: 12, fontWeight: "700", color: CORES.texto, marginTop: 14, marginBottom: 7 },
  inputWrapper: { flexDirection: "row", alignItems: "center", minHeight: 49, backgroundColor: "#f7c5d8", borderRadius: 13, borderWidth: 1, borderColor: CORES.borda, paddingHorizontal: 13 },
  input: { flex: 1, minWidth: 0, paddingVertical: 12, paddingHorizontal: 10, fontSize: 13, color: CORES.texto },
  btnSalvar: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, backgroundColor: "#dc4881", borderRadius: 14, paddingVertical: 15, marginTop: 28 },
  btnSalvarText: { color: CORES.branco, fontSize: 14, fontWeight: "800" },
  btnCancelar: { alignItems: "center", justifyContent: "center", paddingVertical: 13, marginTop: 4 },
  btnCancelarText: { color: CORES.secundario, fontSize: 13, fontWeight: "700" },
});