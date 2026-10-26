import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import Svg, { Polyline, Circle } from "react-native-svg";
import { supabase } from "../lib/supabase";

const { width: screenWidth } = Dimensions.get("window");
const chartWidth = screenWidth - 64;
const CORES = {
  fundo: "#F7F0EC",
  rosa: "#F2C5B7",
  rosaCard: "#F9D8D0",
  texto: "#171514",
  secundario: "#756963",
  dourado: "#C9A96E",
  branco: "#FFFFFF",
  borda: "#E9DCD5",
};

export default function Perfil() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [perfil, setPerfil] = useState<any>(null);
  const [stats, setStats] = useState({ faturamento: 0, atendimentos: 0, novosClientes: 0 });
  const [destaques, setDestaques] = useState({ servico: "Nenhum", cliente: "Nenhum" });
  const [carregando, setCarregando] = useState(true);
  const pontosGrafico = [
    { x: 8, y: 64 },
    { x: chartWidth * 0.32, y: 45 },
    { x: chartWidth * 0.65, y: 27 },
    { x: chartWidth - 8, y: 10 },
  ];
  const pontosLinha = pontosGrafico.map((p) => `${p.x},${p.y}`).join(" ");

  async function carregarTudo() {
    setCarregando(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Perfil
      const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (p) setPerfil(p);
      // 2. Agendamentos do mês
      const inicioMes = new Date();
      inicioMes.setDate(1);
      const inicioStr = inicioMes.toISOString().split('T')[0];
      const { data: agendamentos } = await supabase
        .from("agendamentos")
        .select(`
          valor, cliente_id, servico_id,
          servicos:servico_id (nome),
          clientes:cliente_id (nome)
        `)
        .eq("user_id", user.id)
        .gte("data", inicioStr);

      if (agendamentos) {
        const faturamento = agendamentos.reduce((acc, a) => acc + Number(a.valor || 0), 0);
        setStats({
          faturamento,
          atendimentos: agendamentos.length,
          novosClientes: new Set(agendamentos.map(a => a.cliente_id)).size,
        });

        // Serviço mais pedido
        const contagem: any = {};
        agendamentos.forEach((a: any) => {
          const nome = a.servicos?.nome;
          if (nome) contagem[nome] = (contagem[nome] || 0) + 1;
        });
        const topServico = Object.keys(contagem).sort((a,b) => contagem[b]-contagem[a])[0] || "Nenhum ainda";

        // Cliente em destaque
        const contCli: any = {};
        agendamentos.forEach((a: any) => {
          const nome = a.clientes?.nome;
          if (nome) contCli[nome] = (contCli[nome] || 0) + 1;
        });
        const topClienteNome = Object.keys(contCli).sort((a,b) => contCli[b]-contCli[a])[0];
        const topCliente = topClienteNome ? `${topClienteNome} • ${contCli[topClienteNome]} atendimentos` : "Nenhum ainda";

        setDestaques({ servico: topServico, cliente: topCliente });
      }
    } catch (e) {
      console.log("Erro perfil", e);
    } finally {
      setCarregando(false);
    }
  }

  useFocusEffect(useCallback(() => { carregarTudo(); }, []));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}>
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.botaoIcone} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color={CORES.texto} />
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>Meu perfil</Text>
          <TouchableOpacity style={styles.botaoIcone} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={23} color={CORES.texto} />
          </TouchableOpacity>
        </View>

        {carregando ? <ActivityIndicator color={CORES.dourado} style={{ marginTop: 40 }} /> : (
          <>
            {/* FOTO DO PERFIL */}
            <View style={styles.fotoWrapper}>
              <View style={styles.fotoBorda}>
                <Image source={{ uri: perfil?.avatar_url || "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400" }} style={styles.foto} />
              </View>
              <View style={styles.selo}>
                <Ionicons name="checkmark" size={13} color={CORES.branco} />
              </View>
              <Text style={styles.nomeFoto}>{perfil?.nome || "Teresa Silva"}</Text>
              <Text style={styles.subNomeFoto}>{perfil?.email || "Nail Designer • Beleza e cuidado"}</Text>
            </View>

            {/* CARTÃO DE IDENTIFICAÇÃO */}
            <View style={styles.cardNome}>
              <View style={styles.logoMini}>
                <Text style={styles.logoMiniText}>{perfil?.nome ? perfil.nome.slice(0,2).toUpperCase() : "TS"}</Text>
              </View>
              <View style={styles.infoNome}>
                <Text style={styles.nome}>{perfil?.nome || "Teresa Silva"}</Text>
                <Text style={styles.subNome}>{perfil?.telefone || "Nail Designer - Premium"}</Text>
                <View style={styles.status}>
                  <View style={styles.statusPonto} />
                  <Text style={styles.statusTexto}>Profissional</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.botaoEditar} onPress={() => router.push("/editar-perfil")}>
                <Ionicons name="create-outline" size={21} color={CORES.texto}/>
              </TouchableOpacity>
            </View>

            {/* INDICADORES REAIS */}
            <View style={styles.rowCards}>
              <View style={styles.miniCard}>
                <View style={styles.iconeCard}><Ionicons name="wallet-outline" size={19} color={CORES.texto} /></View>
                <Text style={styles.miniLabel}>Faturamento do mês</Text>
                <Text style={styles.miniValue}>R$ {stats.faturamento.toFixed(0)}</Text>
              </View>
              <View style={styles.miniCard}>
                <View style={styles.iconeCard}><Ionicons name="people-outline" size={19} color={CORES.texto} /></View>
                <Text style={styles.miniLabel}>Atendimentos</Text>
                <Text style={styles.miniValue}>{stats.atendimentos}</Text>
              </View>
              <View style={styles.miniCard}>
                <View style={styles.iconeCard}><Ionicons name="person-add-outline" size={19} color={CORES.texto} /></View>
                <Text style={styles.miniLabel}>Clientes atendidos</Text>
                <Text style={styles.miniValue}>{stats.novosClientes}</Text>
              </View>
            </View>

            {/* GRÁFICO */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.titulo}>Crescimento</Text>
                  <Text style={styles.subTitulo}>Faturamento semanal • {new Date().toLocaleString('pt-BR', { month: 'long' })}</Text>
                </View>
                <View style={styles.iconeDestaque}><Ionicons name="trending-up" size={20} color={CORES.dourado} /></View>
              </View>
              <View style={styles.cardGrafico}>
                <View style={styles.resumoGrafico}>
                  <Text style={styles.resumoLabel}>Desempenho do mês</Text>
                  <Text style={styles.resumoValor}>R$ {stats.faturamento.toFixed(2).replace('.', ',')}</Text>
                </View>
                <View style={styles.grafico}>
                  <Svg width={chartWidth} height={82} viewBox={`0 0 ${chartWidth} 82`}>
                    <Polyline points={pontosLinha} fill="none" stroke={CORES.dourado} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                    {pontosGrafico.map((ponto, index) => (
                      <Circle key={index} cx={ponto.x} cy={ponto.y} r={4} fill={CORES.dourado} stroke={CORES.branco} strokeWidth={2} />
                    ))}
                  </Svg>
                  <View style={styles.legendaGrafico}>
                    {["Sem. 1", "Sem. 2", "Sem. 3", "Sem. 4"].map((semana) => (
                      <Text key={semana} style={styles.legenda}>{semana}</Text>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            {/* DESTAQUES REAIS */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.titulo}>Seus destaques</Text>
                  <Text style={styles.subTitulo}>O que está fazendo sucesso</Text>
                </View>
                <Ionicons name="sparkles-outline" size={22} color={CORES.dourado} />
              </View>
              <View style={styles.cardDestaque}>
                <View style={styles.iconeDestaqueCard}><Ionicons name="trophy-outline" size={23} color={CORES.texto} /></View>
                <View style={styles.textoDestaque}>
                  <Text style={styles.cardRosaLabel}>Serviço mais pedido</Text>
                  <Text style={styles.cardRosaValue}>{destaques.servico}</Text>
                </View>
              </View>
              <View style={styles.cardDestaque}>
                <View style={styles.iconeDestaqueCard}><Ionicons name="heart-outline" size={23} color={CORES.texto} /></View>
                <View style={styles.textoDestaque}>
                  <Text style={styles.cardRosaLabel}>Cliente em destaque</Text>
                  <Text style={styles.cardRosaValue}>{destaques.cliente}</Text>
                </View>
              </View>
            </View>

            <View style={styles.rodape}>
              <View style={styles.linhaRodape} />
              <Text style={styles.rodapeTexto}>Teresa Nails</Text>
              <Text style={styles.rodapeSubTexto}>Beleza em cada detalhe</Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CORES.fundo },
  scrollContent: { paddingBottom: 24 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 18, paddingVertical: 10 },
  botaoIcone: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", borderColor: CORES.borda },
  headerTitulo: { fontSize: 17, fontWeight: "700", color: CORES.texto },
  fotoWrapper: { alignItems: "center", marginTop: 14 },
  fotoBorda: { width: 104, height: 104, borderRadius: 52, padding: 4, borderWidth: 2, borderColor: CORES.dourado, backgroundColor: CORES.branco },
  foto: { width: "100%", height: "100%", borderRadius: 48, backgroundColor: CORES.rosa },
  selo: { position: "absolute", top: 76, marginLeft: 70, width: 25, height: 25, borderRadius: 13, backgroundColor: "#36A853", borderWidth: 2, borderColor: CORES.fundo, alignItems: "center", justifyContent: "center" },
  nomeFoto: { marginTop: 12, fontSize: 19, fontWeight: "800", color: CORES.texto },
  subNomeFoto: { marginTop: 4, fontSize: 12, color: CORES.secundario },
  cardNome: { flexDirection: "row", alignItems: "center", backgroundColor: "#f7c5d8", marginHorizontal: 16, marginTop: 22, borderRadius: 18, padding: 14, borderWidth: 1, borderColor: "#F0C9BE" },
  logoMini: { width: 46, height: 46, borderRadius: 23, borderWidth: 1.5, borderColor: CORES.dourado, backgroundColor: CORES.fundo, alignItems: "center", justifyContent: "center", marginRight: 12 },
  logoMiniText: { fontFamily: "serif", fontSize: 19, fontWeight: "700", color: CORES.dourado },
  infoNome: { flex: 1 },
  nome: { fontSize: 14, fontWeight: "800", color: CORES.texto },
  subNome: { fontSize: 11, color: CORES.secundario, marginTop: 3 },
  status: { flexDirection: "row", alignItems: "center", marginTop: 6, gap: 5 },
  statusPonto: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#36A853" },
  statusTexto: { fontSize: 10, color: CORES.secundario },
  botaoEditar: { width: 36, height: 36, borderRadius: 12, backgroundColor: CORES.branco, alignItems: "center", justifyContent: "center", marginLeft: 8 },
  rowCards: { flexDirection: "row", gap: 8, marginHorizontal: 16, marginTop: 14 },
  miniCard: { flex: 1, minWidth: 0, backgroundColor: CORES.branco, borderRadius: 15, paddingVertical: 12, paddingHorizontal: 5, alignItems: "center", borderWidth: 1, borderColor: CORES.borda },
  iconeCard: { width: 36, height: 36, borderRadius: 12, backgroundColor: "#f7c5d8", alignItems: "center", justifyContent: "center", marginBottom: 8 },
  miniLabel: { fontSize: 9, lineHeight: 13, color: CORES.secundario, textAlign: "center", minHeight: 26 },
  miniValue: { fontSize: 12, fontWeight: "800", color: CORES.texto, textAlign: "center", marginTop: 4 },
  section: { marginTop: 25, paddingHorizontal: 16 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  titulo: { fontSize: 16, fontWeight: "800", color: CORES.texto },
  subTitulo: { fontSize: 11, color: CORES.secundario, marginTop: 4 },
  iconeDestaque: { width: 40, height: 40, borderRadius: 14, backgroundColor: CORES.branco, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: CORES.borda },
  cardGrafico: { backgroundColor: CORES.branco, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: CORES.borda },
  resumoGrafico: { marginBottom: 14 },
  resumoLabel: { fontSize: 11, color: CORES.secundario },
  resumoValor: { fontSize: 21, fontWeight: "800", color: CORES.texto, marginTop: 5 },
  grafico: { width: "100%", alignItems: "center", marginTop: 2 },
  legendaGrafico: { width: "100%", flexDirection: "row", justifyContent: "space-between", marginTop: 8, paddingHorizontal: 2 },
  legenda: { fontSize: 10, color: CORES.secundario },
  cardDestaque: { flexDirection: "row", alignItems: "center", backgroundColor: "#f7c5d8", borderRadius: 16, padding: 13, marginTop: 9, borderWidth: 1, borderColor: "#F0C9BE" },
  iconeDestaqueCard: { width: 43, height: 43, borderRadius: 14, backgroundColor: CORES.branco, alignItems: "center", justifyContent: "center", marginRight: 12 },
  textoDestaque: { flex: 1 },
  cardRosaLabel: { fontSize: 11, color: CORES.secundario },
  cardRosaValue: { fontSize: 12, fontWeight: "800", color: CORES.texto, marginTop: 4 },
  rodape: { alignItems: "center", marginTop: 30, paddingBottom: 12 },
  linhaRodape: { width: 42, height: 2, borderRadius: 2, backgroundColor: CORES.dourado, marginBottom: 12 },
  rodapeTexto: { fontSize: 14, fontWeight: "800", color: CORES.texto },
  rodapeSubTexto: { fontSize: 10, color: CORES.secundario, marginTop: 4 },
});