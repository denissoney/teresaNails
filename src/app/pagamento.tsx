import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert, Share, StatusBar, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { supabase } from "../lib/supabase";

const FUNDO = "#F7F0EC"; const DOURADO = "#C9A86A"; const ROSA = "#DC4881"; const TEXTO = "#171514"; const BRANCO = "#FFFFFF";

export default function FormasPagamento() {
  const insets = useSafeAreaInsets(); const router = useRouter();
  const [pix, setPix] = useState(""); const [carregando, setCarregando] = useState(true); const [salvando, setSalvando] = useState(false);

  useFocusEffect(useCallback(() => { carregarPix(); }, []));

  async function carregarPix() {
    setCarregando(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("pix_chave").eq("id", user.id).single();
      if (data?.pix_chave) setPix(data.pix_chave);
    } finally { setCarregando(false); }
  }

  async function salvarPix() {
    const chave = pix.trim();
    if (!chave) { Alert.alert("Chave Pix", "Digite sua chave Pix"); return; }
    setSalvando(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sem usuário");
      const { error } = await supabase.from("profiles").update({ pix_chave: chave } as any).eq("id", user.id);
      if (error) throw error;
      Alert.alert("Sucesso", "Chave Pix salva!");
    } catch (e: any) { Alert.alert("Erro", e.message); } finally { setSalvando(false); }
  }

  async function compartilhar() {
    const chavePix = pix.trim();
    if (!chavePix) { Alert.alert("Chave Pix não informada", "Digite sua chave Pix antes de compartilhar."); return; }
    // Salva antes de compartilhar
    if (true) { const { data: { user } } = await supabase.auth.getUser(); if (user) await supabase.from("profiles").update({ pix_chave: chavePix } as any).eq("id", user.id); }
    try {
      const mensagem = "🌸 Teresa Silva | Nails Designer\n\nMinha chave Pix para pagamento:\n" + chavePix + "\n\nObrigada pela preferência! 💗";
      await Share.share({ title: "Chave Pix - Teresa Silva", message: mensagem }, { dialogTitle: "Compartilhar chave Pix" });
    } catch { Alert.alert("Não foi possível compartilhar"); }
  }

  if (carregando) return <View style={[styles.container, { paddingTop: insets.top, justifyContent: "center", alignItems: "center" }]}><ActivityIndicator color={ROSA} /></View>;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnBack} onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={TEXTO} /></TouchableOpacity>
        <Image source={require("../../assets/images/Teresa_Silva_logo_transparente.png")} style={styles.logo} resizeMode="contain" />
        <View style={styles.espacoHeader} />
      </View>

      <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView style={styles.content} contentContainerStyle={[styles.contentContainer, { paddingBottom: Math.max(insets.bottom, 20) + 20 }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.tituloContainer}><Text style={styles.titulo}>Formas de Pagamento</Text><View style={styles.linhaDourada} /><Text style={styles.descricao}>Consulte e compartilhe sua chave Pix.</Text></View>

          <View style={styles.cardPix}>
            <View style={styles.iconePixContainer}><Ionicons name="qr-code-outline" size={30} color={DOURADO} /></View>
            <Text style={styles.cardTitulo}>Pagamento via Pix</Text>
            <Text style={styles.cardDescricao}>Informe sua chave Pix para facilitar os pagamentos das suas clientes.</Text>
            <Text style={styles.label}>Sua chave Pix</Text>
            <View style={styles.inputBox}>
              <Ionicons name="key-outline" size={20} color={DOURADO} />
              <TextInput style={styles.input} placeholder="Digite sua chave Pix" placeholderTextColor="#968D87" value={pix} onChangeText={setPix} autoCapitalize="none" autoCorrect={false} />
              {pix.length > 0 && <TouchableOpacity onPress={() => setPix("")}><Ionicons name="close-circle" size={20} color="#968D87" /></TouchableOpacity>}
            </View>

            <TouchableOpacity style={styles.btnSalvar} onPress={salvarPix} disabled={salvando}>
              {salvando ? <ActivityIndicator color={BRANCO} /> : <><Ionicons name="save-outline" size={19} color={BRANCO} /><Text style={styles.compartilharTexto}>Salvar chave Pix</Text></>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnCompartilhar} onPress={compartilhar}>
              <Ionicons name="share-social-outline" size={21} color={BRANCO} /><Text style={styles.compartilharTexto}>Compartilhar chave Pix</Text>
            </TouchableOpacity>

            <View style={styles.aviso}><Ionicons name="information-circle-outline" size={19} color={DOURADO} /><Text style={styles.avisoTexto}>Chave salva no seu perfil. Aparecerá automaticamente ao abrir.</Text></View>
          </View>

          <TouchableOpacity style={styles.btnVoltar} onPress={() => router.back()}><Ionicons name="arrow-back" size={19} color={ROSA} /><Text style={styles.btnVoltarTexto}>Voltar</Text></TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: FUNDO },
  header: { height: 65, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, backgroundColor: FUNDO, margin: 35 },
  btnBack: { width: 40, height: 40, alignItems: "center", justifyContent: "center", right: 50, marginBottom: 70 },
  logo: { width: 400, height: 300, margin: -70, right: 20 },
  espacoHeader: { width: 40 },
  keyboardContainer: { flex: 1 },
  content: { flex: 1, backgroundColor: BRANCO, borderTopLeftRadius: 25, borderTopRightRadius: 25 },
  contentContainer: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 28 },
  tituloContainer: { marginBottom: 26 },
  titulo: { fontSize: 23, fontWeight: "800", color: TEXTO },
  linhaDourada: { width: 55, height: 3, backgroundColor: DOURADO, borderRadius: 5, marginTop: 10 },
  descricao: { fontSize: 14, color: "#77706B", marginTop: 12, lineHeight: 21 },
  cardPix: { backgroundColor: "#fddae7", borderRadius: 18, padding: 20, borderWidth: 1, borderColor: "#E9DCD3", elevation: 3 },
  iconePixContainer: { width: 58, height: 58, borderRadius: 29, backgroundColor: BRANCO, borderWidth: 1, borderColor: "#E9DCD3", alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 14 },
  cardTitulo: { fontSize: 19, fontWeight: "800", color: TEXTO, textAlign: "center" },
  cardDescricao: { fontSize: 13, color: "#77706B", textAlign: "center", lineHeight: 20, marginTop: 8, marginBottom: 23 },
  label: { fontSize: 14, fontWeight: "700", color: TEXTO, marginBottom: 9 },
  inputBox: { minHeight: 52, flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1, borderColor: DOURADO, borderRadius: 12, backgroundColor: BRANCO, paddingHorizontal: 13 },
  input: { flex: 1, minHeight: 50, fontSize: 14, color: TEXTO, paddingVertical: 8 },
  btnSalvar: { minHeight: 52, backgroundColor: "#fff", borderWidth: 1.5, borderColor: ROSA, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 18 },
  btnCompartilhar: { minHeight: 52, backgroundColor: ROSA, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 10 },
  compartilharTexto: { color: BRANCO, fontSize: 15, fontWeight: "700" },
  aviso: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginTop: 18 },
  avisoTexto: { flex: 1, fontSize: 12, color: "#77706B", lineHeight: 18 },
  btnVoltar: { minHeight: 50, borderRadius: 12, borderWidth: 1.5, borderColor: ROSA, backgroundColor: BRANCO, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 25 },
  btnVoltarTexto: { fontSize: 15, fontWeight: "700", color: ROSA },
});