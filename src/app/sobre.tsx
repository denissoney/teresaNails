import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";

export default function Sobre() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState({ clientes: 0, agendamentos: 0, servicos: 0 });
  const [perfil, setPerfil] = useState<any>(null);

  useFocusEffect(useCallback(() => {
    async function carregar() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setPerfil(prof);
      const { count: cCli } = await supabase.from("clientes").select("*", { count: "exact", head: true }).eq("user_id", user.id);
      const { count: cAgen } = await supabase.from("agendamentos").select("*", { count: "exact", head: true }).eq("user_id", user.id);
      const { count: cServ } = await supabase.from("servicos").select("*", { count: "exact", head: true }).eq("user_id", user.id);
      setStats({ clientes: cCli || 0, agendamentos: cAgen || 0, servicos: cServ || 0 });
    }
    carregar();
  }, []));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#171514" /></TouchableOpacity>
        <Text style={styles.tituloHeader}>Sobre o aplicativo</Text>
        <View style={styles.espacoHeader} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={[styles.conteudo, { paddingBottom: insets.bottom + 30 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <Image source={require("../../assets/images/Teresa_Silva_logo_transparente.png")} style={styles.logo} resizeMode="contain" />
          <Text style={styles.nomeApp}>{perfil?.nome || "Teresa Silva"}</Text>
          <Text style={styles.subtituloApp}>NAILS DESIGNER</Text>
          <View style={styles.linhaDecorativa} />
          <Text style={styles.frase}>Beleza, cuidado e organização em um só lugar.</Text>
        </View>

        {/* ESTATÍSTICAS REAIS */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}><Text style={styles.statValor}>{stats.clientes}</Text><Text style={styles.statLabel}>Clientes</Text></View>
          <View style={styles.statCard}><Text style={styles.statValor}>{stats.agendamentos}</Text><Text style={styles.statLabel}>Agendamentos</Text></View>
          <View style={styles.statCard}><Text style={styles.statValor}>{stats.servicos}</Text><Text style={styles.statLabel}>Serviços</Text></View>
        </View>

        <View style={styles.card}>
          <View style={styles.tituloCard}><Ionicons name="phone-portrait-outline" size={23} color="#B77979" /><Text style={styles.tituloSecao}>Sobre o aplicativo</Text></View>
          <Text style={styles.texto}>O Teresa Silva Nails é um aplicativo desenvolvido para auxiliar na organização e no gerenciamento dos serviços de um salão especializado em unhas.</Text>
          <Text style={styles.texto}>A proposta é facilitar a rotina profissional, centralizando informações importantes e tornando o atendimento às clientes mais organizado, prático e eficiente.</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.tituloCard}><Ionicons name="grid-outline" size={23} color="#B77979" /><Text style={styles.tituloSecao}>Funcionalidades</Text></View>
          <View style={styles.funcionalidade}><View style={styles.iconeFuncionalidade}><Ionicons name="calendar-outline" size={21} color="#B77979" /></View><View style={styles.textosFuncionalidade}><Text style={styles.nomeFuncionalidade}>Agenda</Text><Text style={styles.descricaoFuncionalidade}>Organização dos horários e agendamentos.</Text></View></View>
          <View style={styles.funcionalidade}><View style={styles.iconeFuncionalidade}><Ionicons name="people-outline" size={21} color="#B77979" /></View><View style={styles.textosFuncionalidade}><Text style={styles.nomeFuncionalidade}>Clientes</Text><Text style={styles.descricaoFuncionalidade}>Gerenciamento das informações das clientes.</Text></View></View>
          <View style={styles.funcionalidade}><View style={styles.iconeFuncionalidade}><Ionicons name="cash-outline" size={21} color="#B77979" /></View><View style={styles.textosFuncionalidade}><Text style={styles.nomeFuncionalidade}>Financeiro</Text><Text style={styles.descricaoFuncionalidade}>Organização dos recebimentos e despesas.</Text></View></View>
          <View style={styles.funcionalidade}><View style={styles.iconeFuncionalidade}><Ionicons name="color-palette-outline" size={21} color="#B77979" /></View><View style={styles.textosFuncionalidade}><Text style={styles.nomeFuncionalidade}>Serviços</Text><Text style={styles.descricaoFuncionalidade}>Procedimentos oferecidos pelo salão.</Text></View></View>
        </View>

        <View style={styles.card}>
          <View style={styles.tituloCard}><Ionicons name="code-slash-outline" size={23} color="#B77979" /><Text style={styles.tituloSecao}>Sobre o desenvolvedor</Text></View>
          <View style={styles.devContainer}><View style={styles.avatarDev}><Ionicons name="person-outline" size={36} color="#B77979" /></View><Text style={styles.nomeDev}>Desenvolvedor do aplicativo</Text><Text style={styles.cargoDev}>Desenvolvimento de Software</Text></View>
          <Text style={styles.texto}>Este aplicativo foi desenvolvido com o objetivo de aplicar conhecimentos de programação e criar uma solução digital voltada às necessidades de um salão de beleza.</Text>
          <View style={styles.tecnologias}><Text style={styles.labelTecnologias}>Tecnologias utilizadas</Text><View style={styles.tags}><Text style={styles.tag}>React Native</Text><Text style={styles.tag}>TypeScript</Text><Text style={styles.tag}>Expo</Text><Text style={styles.tag}>Supabase</Text></View></View>
        </View>

        <View style={styles.rodape}>
          <Ionicons name="heart" size={16} color="#B77979" />
          <Text style={styles.textoRodape}>Feito com dedicação para {perfil?.nome || "Teresa Silva"} Nails.</Text>
          <Text style={styles.versao}>Teresa Silva Nails • Versão 1.0 • {perfil?.email || ""}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F0EC" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 16, backgroundColor: "#F7F0EC" },
  botaoVoltar: { width: 42, height: 42, borderRadius: 14, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  tituloHeader: { fontSize: 18, fontWeight: "700", color: "#171514" },
  espacoHeader: { width: 42 },
  scroll: { flex: 1, backgroundColor: "#F7F0EC", borderTopLeftRadius: 28, borderTopRightRadius: 28 },
  conteudo: { paddingHorizontal: 20, paddingTop: 24, gap: 18 },
  logoContainer: { alignItems: "center", paddingVertical: 14 },
  logo: { width: 82, height: 82, borderRadius: 28, backgroundColor: "#F2C5B7", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  nomeApp: { fontSize: 27, fontWeight: "700", color: "#171514", letterSpacing: 0.5 },
  subtituloApp: { fontSize: 11, letterSpacing: 3, color: "#B77979", fontWeight: "700", marginTop: 5 },
  linhaDecorativa: { width: 48, height: 3, borderRadius: 2, backgroundColor: "#F2C5B7", marginVertical: 15 },
  frase: { fontSize: 14, color: "#77706C", textAlign: "center", lineHeight: 22 },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: { flex: 1, backgroundColor: "#fff", borderRadius: 16, padding: 14, alignItems: "center", borderWidth: 1, borderColor: "#F0E5E0" },
  statValor: { fontSize: 22, fontWeight: "800", color: "#171514" },
  statLabel: { fontSize: 11, color: "#77706C", marginTop: 4 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 18, borderWidth: 1, borderColor: "#F0E5E0" },
  tituloCard: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
  tituloSecao: { fontSize: 17, fontWeight: "700", color: "#171514", flexShrink: 1 },
  texto: { fontSize: 14, color: "#6F6864", lineHeight: 23, marginBottom: 12, textAlign: "left" },
  funcionalidade: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 17 },
  iconeFuncionalidade: { width: 44, height: 44, borderRadius: 14, backgroundColor: "#FFF1EC", alignItems: "center", justifyContent: "center" },
  textosFuncionalidade: { flex: 1 },
  nomeFuncionalidade: { fontSize: 14, fontWeight: "700", color: "#171514", marginBottom: 4 },
  descricaoFuncionalidade: { fontSize: 12, color: "#77706C", lineHeight: 18 },
  devContainer: { alignItems: "center", marginBottom: 20 },
  avatarDev: { width: 76, height: 76, borderRadius: 38, backgroundColor: "#FFF1EC", borderWidth: 1, borderColor: "#F2C5B7", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  nomeDev: { fontSize: 16, fontWeight: "700", color: "#171514", textAlign: "center" },
  cargoDev: { fontSize: 12, color: "#B77979", marginTop: 5 },
  tecnologias: { marginTop: 5 },
  labelTecnologias: { fontSize: 13, fontWeight: "700", color: "#171514", marginBottom: 12 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: { fontSize: 12, fontWeight: "600", color: "#9B6666", backgroundColor: "#FFF1EC", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, overflow: "hidden" },
  rodape: { alignItems: "center", paddingVertical: 12, gap: 8 },
  textoRodape: { fontSize: 12, color: "#77706C", textAlign: "center" },
  versao: { fontSize: 11, color: "#A39A95", marginTop: 3, textAlign: "center" },
});