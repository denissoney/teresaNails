import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Modal, KeyboardAvoidingView, Platform, Alert, Share, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../lib/supabase";

const FUNDO = "#F7F0EC";
const ROSA_CARD = "#F7C5D8";
const COR_BOTAO = "#E88F75";
const TEXTO = "#171514";
const SECUNDARIO = "#756963";
const BRANCO = "#FFFFFF";

type Servico = {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  preco: number;
  precoMin: string;
  precoMax: string;
  duracao: string;
  foto: string | null;
  user_id: string;
};

export default function Servicos() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precoMin, setPrecoMin] = useState("");
  const [precoMax, setPrecoMax] = useState("");
  const [duracao, setDuracao] = useState("");
  const [foto, setFoto] = useState<string | null>(null);

  async function carregar() {
    setCarregando(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase.from("servicos").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      if (error) throw error;
      const lista: Servico[] = (data || []).map((s: any) => ({
        id: String(s.id),
        nome: s.nome,
        descricao: s.descricao || "",
        categoria: s.categoria || "Geral",
        preco: Number(s.preco || 0),
        precoMin: String(s.preco || "0"),
        precoMax: String(s.preco || "0"),
        duracao: s.duracao || "60",
        foto: s.foto || null,
        user_id: s.user_id,
      }));
      setServicos(lista);
    } catch (e: any) {
      console.log("Erro servicos", e.message);
    } finally {
      setCarregando(false);
    }
  }

  useFocusEffect(useCallback(() => { carregar(); }, []));

  function limparFormulario() {
    setNome(""); setDescricao(""); setCategoria(""); setPrecoMin(""); setPrecoMax(""); setDuracao(""); setFoto(null); setEditandoId(null);
  }

  function abrirNovoServico() { limparFormulario(); setModalAberto(true); }

  function abrirEdicao(servico: Servico) {
    setEditandoId(servico.id);
    setNome(servico.nome); setDescricao(servico.descricao); setCategoria(servico.categoria);
    setPrecoMin(servico.precoMin); setPrecoMax(servico.precoMax); setDuracao(servico.duracao); setFoto(servico.foto);
    setModalAberto(true);
  }

  async function escolherFoto() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert("Permissão necessária", "Permita acesso à galeria");
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [4, 3], quality: 0.8 });
    if (!resultado.canceled && resultado.assets.length > 0) setFoto(resultado.assets[0].uri);
  }

  async function salvarServico() {
    if (!nome.trim() || !categoria.trim() || !precoMin.trim() || !duracao.trim()) {
      Alert.alert("Campos obrigatórios", "Preencha nome, categoria, preço e duração");
      return;
    }
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sem usuário");

      const precoNum = Number(precoMin.replace(/\./g, "").replace(",", "."));
      
      if (editandoId) {
        const { error } = await supabase.from("servicos").update({
          nome: nome.trim(),
          preco: precoNum,
          duracao: duracao.trim(),
        } as any).eq("id", Number(editandoId));
        if (error) throw error;
      } else {
        const { error } = await supabase.from("servicos").insert({
          user_id: user.id,
          nome: nome.trim(),
          preco: precoNum,
          duracao: duracao.trim(),
        } as any);
        if (error) throw error;
      }

      setModalAberto(false);
      limparFormulario();
      carregar();
    } catch (e: any) {
      Alert.alert("Erro", e.message);
    }
  }

  function excluirServico(servico: Servico) {
    Alert.alert("Excluir serviço", `Deseja excluir "${servico.nome}"?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: async () => {
        const { error } = await supabase.from("servicos").delete().eq("id", Number(servico.id));
        if (error) Alert.alert("Erro", error.message);
        else carregar();
        setModalAberto(false);
        limparFormulario();
      }},
    ]);
  }

  async function compartilharServico(servico: Servico) {
    const mensagem = [`💅 Teresa Nails`, "", servico.nome, servico.descricao, `Categoria: ${servico.categoria}`, `Valor: R$ ${servico.precoMin}`, `Duração: ${servico.duracao}`].join("\n");
    try { await Share.share({ title: servico.nome, message: mensagem }); } catch { Alert.alert("Não foi possível compartilhar"); }
  }

  function formatarDuracao(valor: string) {
    const minutos = Number(valor); const horas = Math.floor(minutos / 60); const resto = minutos % 60;
    if (horas === 0) return `${minutos} min`; if (resto === 0) return `${horas}h`; return `${horas}h ${resto}min`;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnVoltar} onPress={() => router.back()}><Ionicons name="arrow-back" size={22} color={TEXTO} /></TouchableOpacity>
        <Image source={require("../../assets/images/Teresa_Silva_logo_transparente.png")} style={styles.logo} resizeMode="contain"/>
        <View style={styles.espacoDireita} />
      </View>

      <View style={styles.content}>
        <View style={styles.tituloLinha}>
          <View style={styles.tituloInfo}>
            <Text style={styles.titulo}>Catálogo de serviços</Text>
            <Text style={styles.subtitulo}>Seus serviços, valores e detalhes</Text>
          </View>
          <View style={styles.contador}><Ionicons name="cut-outline" size={18} color={TEXTO}/><Text style={styles.contadorTexto}>{servicos.length}</Text></View>
        </View>

        <View style={styles.aviso}><Ionicons name="information-circle-outline" size={21} color={TEXTO}/><Text style={styles.avisoTexto}>Edite seu catálogo e compartilhe os serviços que desejar.</Text></View>

        {carregando ? <ActivityIndicator color={COR_BOTAO} style={{ marginTop: 40 }} /> : (
          <ScrollView style={styles.lista} contentContainerStyle={styles.listaConteudo} showsVerticalScrollIndicator={false}>
            {servicos.map((servico) => (
              <View key={servico.id} style={styles.card}>
                {servico.foto ? <Image source={{ uri: servico.foto }} style={styles.fotoCard} /> : <View style={styles.fotoPlaceholder}><Ionicons name="flower-outline" size={32} color={COR_BOTAO}/><Text style={styles.fotoPlaceholderTexto}>Teresa Nails</Text></View>}
                <View style={styles.cardConteudo}>
                  <View style={styles.categoriaTag}><Text style={styles.categoriaTexto}>{servico.categoria}</Text></View>
                  <Text style={styles.nomeServico}>{servico.nome}</Text>
                  {!!servico.descricao && <Text style={styles.descricao}>{servico.descricao}</Text>}
                  <Text style={styles.labelValor}>Preço</Text>
                  <Text style={styles.valorServico}>R$ {servico.precoMin}</Text>
                  <View style={styles.duracaoLinha}><Ionicons name="time-outline" size={16} color={SECUNDARIO}/><Text style={styles.duracaoTexto}>{formatarDuracao(servico.duracao)}</Text></View>
                  <View style={styles.acoesCard}>
                    <TouchableOpacity style={styles.btnCompartilhar} onPress={() => compartilharServico(servico)}><Ionicons name="share-social-outline" size={17} color={TEXTO}/><Text style={styles.textoCompartilhar}>Compartilhar</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.btnEditar} onPress={() => abrirEdicao(servico)}><Ionicons name="create-outline" size={20} color={TEXTO}/></TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
            {servicos.length === 0 && <View style={styles.vazio}><Ionicons name="cut-outline" size={42} color={COR_BOTAO}/><Text style={styles.vazioTitulo}>Seu catálogo está vazio</Text><Text style={styles.vazioTexto}>Adicione seu primeiro serviço</Text></View>}
          </ScrollView>
        )}

        <View style={[styles.rodape, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <TouchableOpacity style={styles.btnAdicionar} onPress={abrirNovoServico}><Ionicons name="add" size={21} color={BRANCO} /><Text style={styles.textoAdicionar}>Adicionar serviço</Text></TouchableOpacity>
        </View>
      </View>

      <Modal visible={modalAberto} transparent animationType="slide" onRequestClose={() => setModalAberto(false)}>
        <KeyboardAvoidingView style={styles.modalFundo} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <View style={styles.modalCard}>
            <View style={styles.modalCabecalho}>
              <View><Text style={styles.modalTitulo}>{editandoId ? "Editar serviço" : "Novo serviço"}</Text><Text style={styles.modalSubtitulo}>Preencha os detalhes</Text></View>
              <TouchableOpacity onPress={() => setModalAberto(false)} style={styles.btnFechar}><Ionicons name="close" size={23} color={TEXTO} /></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <TouchableOpacity style={styles.btnFoto} onPress={escolherFoto}>{foto ? <Image source={{ uri: foto }} style={styles.previewFoto} /> : <View style={styles.fotoVazia}><Ionicons name="camera-outline" size={28} color={COR_BOTAO}/><Text style={styles.btnFotoTexto}>Adicionar foto</Text></View>}</TouchableOpacity>
              <Text style={styles.labelInput}>Nome do serviço *</Text><TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex.: Alongamento" />
              <Text style={styles.labelInput}>Categoria *</Text><TextInput style={styles.input} value={categoria} onChangeText={setCategoria} placeholder="Ex.: Alongamento" />
              <Text style={styles.labelInput}>Descrição</Text><TextInput style={[styles.input, styles.inputDescricao]} value={descricao} onChangeText={setDescricao} multiline />
              <Text style={styles.labelInput}>Preço (R$) *</Text><TextInput style={styles.input} value={precoMin} onChangeText={setPrecoMin} keyboardType="decimal-pad" placeholder="120,00" />
              <Text style={styles.labelInput}>Duração (min) *</Text><TextInput style={styles.input} value={duracao} onChangeText={setDuracao} keyboardType="number-pad" placeholder="90" />
              <TouchableOpacity style={styles.btnSalvar} onPress={salvarServico}><Ionicons name="checkmark-circle-outline" size={20} color={BRANCO}/><Text style={styles.textoSalvar}>Salvar serviço</Text></TouchableOpacity>
              {editandoId && <TouchableOpacity style={styles.btnExcluir} onPress={() => { const s = servicos.find((i) => i.id === editandoId); if (s) excluirServico(s); }}><Ionicons name="trash-outline" size={18} color="#C62828"/><Text style={styles.textoExcluir}>Excluir serviço</Text></TouchableOpacity>}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: FUNDO },
  header: { height: 88, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 15 },
  btnVoltar: { width: 38, height: 38, borderRadius: 13, backgroundColor: BRANCO, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#E9DCD5" },
  logo: { width: 230, height: 100 },
  espacoDireita: { width: 38 },
  content: { flex: 1, backgroundColor: FUNDO, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 15, paddingTop: 16 },
  tituloLinha: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 15 },
  tituloInfo: { flex: 1 },
  titulo: { fontSize: 20, fontWeight: "800", color: TEXTO },
  subtitulo: { fontSize: 11, color: SECUNDARIO, marginTop: 4 },
  contador: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: ROSA_CARD, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 9 },
  contadorTexto: { fontSize: 14, fontWeight: "800", color: TEXTO },
  aviso: { flexDirection: "row", alignItems: "center", gap: 9, padding: 12, backgroundColor: "#FCE6DF", borderRadius: 13, marginBottom: 16 },
  avisoTexto: { flex: 1, fontSize: 11, lineHeight: 16, color: TEXTO },
  lista: { flex: 1 },
  listaConteudo: { paddingBottom: 12 },
  card: { backgroundColor: BRANCO, borderRadius: 18, overflow: "hidden", marginBottom: 15, borderWidth: 1, borderColor: "#E9DCD5" },
  fotoCard: { width: "100%", height: 165, backgroundColor: "#F2C5B7" },
  fotoPlaceholder: { height: 125, backgroundColor: ROSA_CARD, alignItems: "center", justifyContent: "center" },
  fotoPlaceholderTexto: { fontSize: 11, fontWeight: "700", color: TEXTO, marginTop: 6 },
  cardConteudo: { padding: 14 },
  categoriaTag: { alignSelf: "flex-start", backgroundColor: "#FCE6DF", borderRadius: 8, paddingHorizontal: 9, paddingVertical: 5, marginBottom: 8 },
  categoriaTexto: { fontSize: 10, fontWeight: "700", color: TEXTO },
  nomeServico: { fontSize: 16, fontWeight: "800", color: TEXTO },
  descricao: { fontSize: 12, lineHeight: 18, color: SECUNDARIO, marginTop: 6 },
  labelValor: { fontSize: 11, color: SECUNDARIO, marginTop: 13 },
  valorServico: { fontSize: 17, fontWeight: "800", color: "#B85F47", marginTop: 3 },
  duracaoLinha: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 9 },
  duracaoTexto: { fontSize: 11, color: SECUNDARIO },
  acoesCard: { flexDirection: "row", alignItems: "center", gap: 9, marginTop: 15, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#F0E5DF" },
  btnCompartilhar: { flex: 1, height: 40, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 10, backgroundColor: ROSA_CARD },
  textoCompartilhar: { fontSize: 12, fontWeight: "700", color: TEXTO },
  btnEditar: { width: 42, height: 40, borderRadius: 10, backgroundColor: FUNDO, alignItems: "center", justifyContent: "center" },
  vazio: { alignItems: "center", backgroundColor: BRANCO, borderRadius: 18, padding: 30, marginTop: 10 },
  vazioTitulo: { fontSize: 15, fontWeight: "800", color: TEXTO, marginTop: 12 },
  vazioTexto: { fontSize: 12, color: SECUNDARIO, textAlign: "center", marginTop: 6 },
  rodape: { paddingTop: 10, paddingHorizontal: 2, backgroundColor: FUNDO },
  btnAdicionar: { height: 48, backgroundColor: "#dc4881", borderRadius: 13, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9 },
  textoAdicionar: { color: BRANCO, fontSize: 14, fontWeight: "800" },
  modalFundo: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.45)" },
  modalCard: { maxHeight: "92%", backgroundColor: "#FFF8F5", borderTopLeftRadius: 25, borderTopRightRadius: 25, paddingHorizontal: 20, paddingTop: 22, paddingBottom: 30 },
  modalCabecalho: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 17 },
  modalTitulo: { fontSize: 20, fontWeight: "800", color: TEXTO },
  modalSubtitulo: { fontSize: 11, color: SECUNDARIO, marginTop: 4 },
  btnFechar: { width: 36, height: 36, borderRadius: 12, backgroundColor: ROSA_CARD, alignItems: "center", justifyContent: "center" },
  btnFoto: { minHeight: 125, borderRadius: 14, overflow: "hidden", backgroundColor: "#f7c5d8", borderWidth: 1, borderColor: "#F2C5B7", borderStyle: "dashed", alignItems: "center", justifyContent: "center" },
  fotoVazia: { alignItems: "center", padding: 15 },
  btnFotoTexto: { fontSize: 12, fontWeight: "800", color: TEXTO, marginTop: 8 },
  previewFoto: { width: "100%", height: 180 },
  labelInput: { fontSize: 12, fontWeight: "700", color: TEXTO, marginBottom: 6, marginTop: 14 },
  input: { minHeight: 45, borderWidth: 1, borderColor: "#D9B3A7", borderRadius: 10, paddingHorizontal: 12, backgroundColor: BRANCO, color: TEXTO, fontSize: 13 },
  inputDescricao: { height: 85, paddingTop: 12 },
  btnSalvar: { minHeight: 48, backgroundColor: "#dc4881", borderRadius: 11, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 23 },
  textoSalvar: { color: BRANCO, fontWeight: "800", fontSize: 14 },
  btnExcluir: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, padding: 14, marginTop: 5 },
  textoExcluir: { color: "#C62828", fontWeight: "700", fontSize: 12 },
});