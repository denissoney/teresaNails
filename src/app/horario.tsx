import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Switch, TextInput, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { supabase } from "../lib/supabase";

const FUNDO = "#F7F0EC";
const DOURADO = "#C9A86A";

type DiaSemana = {
  id: string;
  nome: string;
  ativo: boolean;
  abertura: string;
  fechamento: string;
  intervaloAtivo: boolean;
  intervaloInicio: string;
  intervaloFim: string;
};

const DIAS_INICIAIS: DiaSemana[] = [
  { id: "seg", nome: "Segunda-feira", ativo: true, abertura: "09:00", fechamento: "18:00", intervaloAtivo: true, intervaloInicio: "12:00", intervaloFim: "13:00" },
  { id: "ter", nome: "Terça-feira", ativo: true, abertura: "09:00", fechamento: "18:00", intervaloAtivo: true, intervaloInicio: "12:00", intervaloFim: "13:00" },
  { id: "qua", nome: "Quarta-feira", ativo: true, abertura: "09:00", fechamento: "18:00", intervaloAtivo: true, intervaloInicio: "12:00", intervaloFim: "13:00" },
  { id: "qui", nome: "Quinta-feira", ativo: true, abertura: "09:00", fechamento: "18:00", intervaloAtivo: true, intervaloInicio: "12:00", intervaloFim: "13:00" },
  { id: "sex", nome: "Sexta-feira", ativo: true, abertura: "09:00", fechamento: "18:00", intervaloAtivo: true, intervaloInicio: "12:00", intervaloFim: "13:00" },
  { id: "sab", nome: "Sábado", ativo: true, abertura: "09:00", fechamento: "14:00", intervaloAtivo: false, intervaloInicio: "12:00", intervaloFim: "13:00" },
  { id: "dom", nome: "Domingo", ativo: false, abertura: "09:00", fechamento: "14:00", intervaloAtivo: false, intervaloInicio: "12:00", intervaloFim: "13:00" },
];

export default function Horario() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [dias, setDias] = useState<DiaSemana[]>(DIAS_INICIAIS);
  const [diaExpandido, setDiaExpandido] = useState<string | null>("seg");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  async function carregarHorarios() {
    setCarregando(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("horarios").select("*").eq("user_id", user.id);
      if (data && data.length > 0) {
        const map: any = {};
        data.forEach((h: any) => { map[h.dia_id] = h; });
        setDias(DIAS_INICIAIS.map(d => map[d.id] ? {
          id: map[d.id].dia_id,
          nome: map[d.id].nome,
          ativo: map[d.id].ativo,
          abertura: map[d.id].abertura,
          fechamento: map[d.id].fechamento,
          intervaloAtivo: map[d.id].intervalo_ativo,
          intervaloInicio: map[d.id].intervalo_inicio,
          intervaloFim: map[d.id].intervalo_fim,
        } : d));
      }
    } catch (e) { console.log(e); } finally { setCarregando(false); }
  }

  useFocusEffect(useCallback(() => { carregarHorarios(); }, []));

  function atualizarDia(id: string, campo: keyof DiaSemana, valor: string | boolean) {
    setDias((atuais) => atuais.map((dia) => dia.id === id ? { ...dia, [campo]: valor } : dia));
  }

  function validarHorario(horario: string) { return /^([01]\d|2[0-3]):[0-5]\d$/.test(horario); }

  async function salvarHorarios() {
    const diasAtivos = dias.filter((dia) => dia.ativo);
    if (diasAtivos.length === 0) { Alert.alert("Atenção", "Ative pelo menos um dia"); return; }

    for (const dia of diasAtivos) {
      if (!validarHorario(dia.abertura) || !validarHorario(dia.fechamento) || dia.abertura >= dia.fechamento) {
        Alert.alert("Horário inválido", `Confira ${dia.nome}`); return;
      }
      if (dia.intervaloAtivo) {
        if (!validarHorario(dia.intervaloInicio) || !validarHorario(dia.intervaloFim) || dia.intervaloInicio >= dia.intervaloFim || dia.intervaloInicio < dia.abertura || dia.intervaloFim > dia.fechamento) {
          Alert.alert("Intervalo inválido", `Confira intervalo de ${dia.nome}`); return;
        }
      }
    }

    setSalvando(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sem usuário");

      for (const dia of dias) {
        const { error } = await supabase.from("horarios").upsert({
          user_id: user.id,
          dia_id: dia.id,
          nome: dia.nome,
          ativo: dia.ativo,
          abertura: dia.abertura,
          fechamento: dia.fechamento,
          intervalo_ativo: dia.intervaloAtivo,
          intervalo_inicio: dia.intervaloInicio,
          intervalo_fim: dia.intervaloFim,
        } as any, { onConflict: "user_id,dia_id" });
        if (error) throw error;
      }

      router.push("/horario-salvo");
    } catch (e: any) {
      Alert.alert("Erro", e.message);
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) return <View style={[styles.container, { paddingTop: insets.top, justifyContent: "center" }]}><ActivityIndicator color={DOURADO} /></View>;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnVoltar} onPress={() => router.back()}><Ionicons name="arrow-back" size={22} color="#000" /></TouchableOpacity>
        <Image source={require("../../assets/images/Teresa_Silva_logo_transparente.png")} style={styles.logo} resizeMode="contain" />
        <TouchableOpacity style={styles.btnMenu} onPress={() => router.push("/mais")}><Ionicons name="menu" size={25} color="#000" /></TouchableOpacity>
      </View>

      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.titulo}>Horários de Funcionamento</Text>
          <Text style={styles.subtitulo}>Defina os dias e horários em que você atende</Text>

          <View style={styles.resumo}>
            <View style={styles.resumoIcone}><Ionicons name="time-outline" size={24} color="#000" /></View>
            <View style={styles.resumoInfo}>
              <Text style={styles.resumoTitulo}>Sua agenda de atendimento</Text>
              <Text style={styles.resumoTexto}>{dias.filter((d) => d.ativo).length} dias habilitados</Text>
            </View>
          </View>

          <Text style={styles.secaoTitulo}>Dias da semana</Text>

          {dias.map((dia) => {
            const expandido = diaExpandido === dia.id;
            return (
              <View key={dia.id} style={styles.cardDia}>
                <View style={styles.linhaDia}>
                  <TouchableOpacity style={styles.diaInfo} onPress={() => setDiaExpandido(expandido ? null : dia.id)}>
                    <Text style={styles.nomeDia}>{dia.nome}</Text>
                    <Text style={[styles.statusDia, !dia.ativo && styles.statusFechado]}>{dia.ativo ? `${dia.abertura} - ${dia.fechamento}` : "Fechado"}</Text>
                  </TouchableOpacity>
                  <Switch value={dia.ativo} onValueChange={(v) => atualizarDia(dia.id, "ativo", v)} trackColor={{ false: "#D8D0CC", true: "#f7c5d8" }} thumbColor={dia.ativo ? "#dc4881" : "#F5F5F5"} />
                  <TouchableOpacity style={styles.btnExpandir} onPress={() => setDiaExpandido(expandido ? null : dia.id)}><Ionicons name={expandido ? "chevron-up" : "chevron-down"} size={18} color="#000" /></TouchableOpacity>
                </View>

                {expandido && (
                  <View style={styles.detalhesDia}>
                    {dia.ativo ? (
                      <>
                        <Text style={styles.labelHorario}>Horário de atendimento</Text>
                        <View style={styles.horariosRow}>
                          <View style={styles.campoHorario}>
                            <Text style={styles.labelCampo}>Abertura</Text>
                            <View style={styles.inputHorario}><Ionicons name="time-outline" size={16} color={DOURADO} /><TextInput style={styles.inputTexto} value={dia.abertura} onChangeText={(v) => atualizarDia(dia.id, "abertura", v)} placeholder="09:00" maxLength={5} /></View>
                          </View>
                          <View style={styles.campoHorario}>
                            <Text style={styles.labelCampo}>Fechamento</Text>
                            <View style={styles.inputHorario}><Ionicons name="time-outline" size={16} color={DOURADO} /><TextInput style={styles.inputTexto} value={dia.fechamento} onChangeText={(v) => atualizarDia(dia.id, "fechamento", v)} placeholder="18:00" maxLength={5} /></View>
                          </View>
                        </View>

                        <View style={styles.intervaloHeader}>
                          <View style={styles.intervaloInfo}><Ionicons name="cafe-outline" size={18} color="#000" /><Text style={styles.intervaloTitulo}>Intervalo / almoço</Text></View>
                          <Switch value={dia.intervaloAtivo} onValueChange={(v) => atualizarDia(dia.id, "intervaloAtivo", v)} trackColor={{ false: "#D8D0CC", true: "#f7c5d8" }} thumbColor={dia.intervaloAtivo ? "#dc4881" : "#F5F5F5"} />
                        </View>

                        {dia.intervaloAtivo && (
                          <View style={styles.horariosRow}>
                            <View style={styles.campoHorario}><Text style={styles.labelCampo}>Início</Text><TextInput style={styles.inputSimples} value={dia.intervaloInicio} onChangeText={(v) => atualizarDia(dia.id, "intervaloInicio", v)} placeholder="12:00" maxLength={5} /></View>
                            <View style={styles.campoHorario}><Text style={styles.labelCampo}>Fim</Text><TextInput style={styles.inputSimples} value={dia.intervaloFim} onChangeText={(v) => atualizarDia(dia.id, "intervaloFim", v)} placeholder="13:00" maxLength={5} /></View>
                          </View>
                        )}
                      </>
                    ) : <Text style={styles.textoFechado}>Este dia está marcado como fechado. Ative o botão para configurar.</Text>}
                  </View>
                )}
              </View>
            );
          })}

          <View style={styles.aviso}><Ionicons name="information-circle-outline" size={20} color="#8B5E4A" /><Text style={styles.avisoTexto}>Os horários definidos aqui servem como referência para os agendamentos do salão.</Text></View>
        </ScrollView>

        <View style={[styles.rodape, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <TouchableOpacity style={styles.btnSalvar} onPress={salvarHorarios} disabled={salvando}>
            {salvando ? <ActivityIndicator color="#fff" /> : <><Ionicons name="checkmark-circle-outline" size={20} color="#fff" /><Text style={styles.textoSalvar}>Salvar horários</Text></>}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: FUNDO },
  header: { height: 150, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12 },
  btnVoltar: { width: 34, height: 34, alignItems: "center", justifyContent: "center" },
  btnMenu: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", elevation: 2, marginBottom: 90 },
  logo: { width: 300, height: 300 },
  content: { flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 25, borderTopRightRadius: 25, paddingHorizontal: 14, paddingTop: 16, overflow: "hidden" },
  scrollContent: { paddingBottom: 20 },
  titulo: { fontSize: 20, fontWeight: "800", color: "#000", textAlign: "center" },
  subtitulo: { fontSize: 11, color: DOURADO, textAlign: "center", marginTop: 5, marginBottom: 18 },
  resumo: { flexDirection: "row", alignItems: "center", backgroundColor: "#f7c5d8", borderRadius: 12, padding: 13, marginBottom: 20 },
  resumoIcone: { width: 42, height: 42, borderRadius: 12, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  resumoInfo: { flex: 1, marginLeft: 11 },
  resumoTitulo: { fontSize: 13, fontWeight: "800", color: "#000" },
  resumoTexto: { fontSize: 11, color: "#555", marginTop: 4 },
  secaoTitulo: { fontSize: 14, fontWeight: "800", color: "#000", marginBottom: 10 },
  cardDia: { backgroundColor: "#FFF9F6", borderRadius: 12, borderWidth: 1, borderColor: "#F0DDD5", marginBottom: 10, overflow: "hidden" },
  linhaDia: { minHeight: 62, flexDirection: "row", alignItems: "center", paddingHorizontal: 11, paddingVertical: 8 },
  diaInfo: { flex: 1 },
  nomeDia: { fontSize: 12, fontWeight: "800", color: "#000" },
  statusDia: { fontSize: 10, color: "#8B5E4A", marginTop: 5 },
  statusFechado: { color: "#999" },
  btnExpandir: { padding: 5, marginLeft: 2 },
  detalhesDia: { borderTopWidth: 1, borderTopColor: "#F0DDD5", padding: 12 },
  labelHorario: { fontSize: 11, fontWeight: "700", color: "#000", marginBottom: 10 },
  horariosRow: { flexDirection: "row", gap: 10 },
  campoHorario: { flex: 1 },
  labelCampo: { fontSize: 10, color: "#666", marginBottom: 5 },
  inputHorario: { minHeight: 40, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#f7c5d8", borderRadius: 8, backgroundColor: "#fff", paddingHorizontal: 8 },
  inputTexto: { flex: 1, fontSize: 12, color: "#000", paddingVertical: 7, paddingLeft: 5 },
  intervaloHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 14, marginBottom: 8 },
  intervaloInfo: { flexDirection: "row", alignItems: "center", gap: 7 },
  intervaloTitulo: { fontSize: 11, fontWeight: "700", color: "#000" },
  inputSimples: { height: 40, borderWidth: 1, borderColor: "#f7c5d8", borderRadius: 8, backgroundColor: "#fff", paddingHorizontal: 10, fontSize: 12, color: "#000" },
  textoFechado: { fontSize: 11, color: "#777", lineHeight: 17 },
  aviso: { flexDirection: "row", alignItems: "flex-start", gap: 8, backgroundColor: "#f7c5d8", borderRadius: 10, padding: 12, marginTop: 5, marginBottom: 10 },
  avisoTexto: { flex: 1, fontSize: 10, color: "#000", lineHeight: 15 },
  rodape: { paddingTop: 10, backgroundColor: "#fff" },
  btnSalvar: { minHeight: 44, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#dc4881", borderRadius: 8 },
  textoSalvar: { color: "#fff", fontSize: 13, fontWeight: "800" },
});