import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  PanResponder,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, usePathname, useFocusEffect } from "expo-router";
import MenuDrawer from "../components/MenuDrawer";
import { supabase } from "../lib/supabase";

type Agendamento = {
  id: string;
  data: string;
  hora: string;
  dur: string;
  nome: string;
  serv: string;
  status: "Confirmado" | "Pendente";
};

const DIAS_VISIVEIS = 7;
const ROSA = "#f7c5d8";
const FUNDO = "#FFF8F5";

function formatarData(data: Date) {
  const texto = data.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
function formatarMes(data: Date) {
  const texto = data.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
function dataISO(data: Date) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}
function somarDias(data: Date, quantidade: number) {
  const novaData = new Date(data);
  novaData.setDate(novaData.getDate() + quantidade);
  return novaData;
}
function obterInicioSemana(data: Date) {
  return somarDias(data, -3);
}

export default function Agenda() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  const [diaSel, setDiaSel] = useState(() => new Date());
  const [menuAberto, setMenuAberto] = useState(false);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [carregando, setCarregando] = useState(true);

  const dataSelecionada = dataISO(diaSel);

  const carregarAgendamentos = useCallback(async () => {
    try {
      setCarregando(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setAgendamentos([]); return; }

      // busca uma janela de 14 dias ao redor do dia selecionado para o swipe ficar rápido
      const inicioJanela = dataISO(somarDias(diaSel, -7));
      const fimJanela = dataISO(somarDias(diaSel, 7));

      const { data, error } = await supabase
        .from("agendamentos")
        .select(`
          id,
          data,
          hora,
          duracao,
          status,
          clientes ( nome ),
          servicos ( nome )
        `)
        .eq("user_id", user.id)
        .gte("data", inicioJanela)
        .lte("data", fimJanela)
        .order("hora", { ascending: true });

      if (error) {
        console.log("Erro ao buscar agendamentos:", error.message);
        // Se a tabela ainda não existe, cai aqui - mantém vazio
        setAgendamentos([]);
        return;
      }

      const mapeados: Agendamento[] = (data || []).map((item: any) => ({
        id: item.id,
        data: item.data,
        hora: item.hora.slice(0, 5), // 09:30:00 -> 09:30
        dur: item.duracao || "1h",
        nome: item.clientes?.nome || "Cliente",
        serv: item.servicos?.nome || "Serviço",
        status: item.status || "Confirmado",
      }));

      setAgendamentos(mapeados);
    } catch (e) {
      console.log(e);
    } finally {
      setCarregando(false);
    }
  }, [diaSel]);

  useEffect(() => {
    carregarAgendamentos();
  }, [carregarAgendamentos]);

  // recarrega quando volta pra tela
  useFocusEffect(
    useCallback(() => {
      carregarAgendamentos();
    }, [carregarAgendamentos])
  );

  const agendamentosDoDia = useMemo(
    () => agendamentos.filter((a) => a.data === dataSelecionada).sort((a, b) => a.hora.localeCompare(b.hora)),
    [agendamentos, dataSelecionada]
  );

  const diasVisiveis = useMemo(() => {
    const inicio = obterInicioSemana(diaSel);
    return Array.from({ length: DIAS_VISIVEIS }, (_, indice) => somarDias(inicio, indice));
  }, [diaSel]);

  function navegar(destino: string) {
    if (destino === pathname) return;
    router.push(destino as never);
  }
  function selecionarDia(data: Date) { setDiaSel(new Date(data)); }
  function mudarDia(direcao: number) { setDiaSel((d) => somarDias(d, direcao)); }
  function novoAgendamento() { router.push("/novo-agendamento" as never); }

  const gestoDias = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesto) => Math.abs(gesto.dx) > 15 && Math.abs(gesto.dx) > Math.abs(gesto.dy) * 1.2,
        onPanResponderRelease: (_, gesto) => {
          if (gesto.dx < -40) mudarDia(1);
          else if (gesto.dx > 40) mudarDia(-1);
        },
      }),
    []
  );

  const rotaAtiva = pathname.startsWith("/agenda") ? "agenda" : pathname.startsWith("/clientes") ? "clientes" : pathname.startsWith("/financeiro") ? "financeiro" : pathname.startsWith("/mais") ? "mais" : "home";

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <MenuDrawer visible={menuAberto} onClose={() => setMenuAberto(false)} rotaAtiva={rotaAtiva} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.btnMenu} onPress={() => setMenuAberto(true)} activeOpacity={0.7}>
          <Ionicons name="menu" size={29} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Image source={require("../../assets/images/Teresa_Silva_logo_transparente.png")} style={styles.logoImg} resizeMode="contain" />
        </View>
        <View style={styles.ladoVazio} />
      </View>

      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.conteudoScroll}>
          <Text style={styles.titulo}>Agenda</Text>
          <Text style={styles.subtitulo}>Confira seus agendamentos e organize seu dia</Text>

          <View style={styles.mesHeader}>
            <TouchableOpacity style={styles.setaMes} onPress={() => mudarDia(-7)}>
              <Ionicons name="chevron-back" size={21} color="#000" />
            </TouchableOpacity>
            <Text style={styles.mesTexto}>{formatarMes(diaSel)}</Text>
            <TouchableOpacity style={styles.setaMes} onPress={() => mudarDia(7)}>
              <Ionicons name="chevron-forward" size={21} color="#000" />
            </TouchableOpacity>
          </View>

          <View {...gestoDias.panHandlers}>
            <View style={styles.diasRow}>
              {diasVisiveis.map((data) => {
                const selecionado = dataISO(data) === dataSelecionada;
                const hoje = dataISO(data) === dataISO(new Date());
                return (
                  <TouchableOpacity key={dataISO(data)} style={[styles.diaItem, selecionado && styles.diaAtivo]} onPress={() => selecionarDia(data)} activeOpacity={0.75}>
                    <Text style={[styles.diaSemana, selecionado && styles.textoDiaAtivo]}>{data.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "")}</Text>
                    <Text style={[styles.diaNum, selecionado && styles.textoDiaAtivo]}>{data.getDate()}</Text>
                    {hoje && <View style={[styles.marcadorHoje, selecionado && styles.marcadorHojeAtivo]} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <Text style={styles.dicaDeslize}><Ionicons name="swap-horizontal" size={13} color="#888" /> Deslize para ver outros dias</Text>

          <View style={styles.barraData}>
            <View style={styles.dataLeft}>
              <Ionicons name="calendar-outline" size={19} color="#000" />
              <View style={styles.dataInfo}>
                <Text style={styles.dataTexto}>{formatarData(diaSel)}</Text>
                <Text style={styles.quantidadeTexto}>
                  {carregando ? "Carregando..." : agendamentosDoDia.length === 0 ? "Nenhum agendamento" : `${agendamentosDoDia.length} ${agendamentosDoDia.length === 1 ? "agendamento" : "agendamentos"}`}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.btnNovo} onPress={novoAgendamento} activeOpacity={0.8}>
              <Ionicons name="add" size={17} color="#fff" />
              <Text style={styles.btnNovoTexto}>Novo</Text>
            </TouchableOpacity>
          </View>

          {carregando ? (
            <View style={styles.semAgendamentos}><ActivityIndicator size="large" color="#000" /></View>
          ) : agendamentosDoDia.length > 0 ? (
            agendamentosDoDia.map((item) => (
              <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.8} onPress={() => navegar(`/agenda?agendamentoId=${item.id}`)}>
                <View style={styles.cardHora}><Text style={styles.hora}>{item.hora}</Text><Text style={styles.dur}>{item.dur}</Text></View>
                <View style={styles.avatar}><Text style={styles.avatarLetra}>{item.nome.charAt(0).toUpperCase()}</Text></View>
                <View style={styles.cardMeio}>
                  <Text style={styles.cardNome}>{item.nome}</Text>
                  <View style={styles.servRow}><MaterialIcons name="content-cut" size={13} color="#555" /><Text style={styles.servTexto}>{item.serv}</Text></View>
                </View>
                <View style={styles.cardRight}>
                  <View style={[styles.badge, item.status === "Confirmado" ? styles.badgeConfirmado : styles.badgePendente]}>
                    <Text style={[styles.badgeTexto, item.status === "Confirmado" ? styles.textoConfirmado : styles.textoPendente]}>{item.status}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#555" style={styles.chevronCard} />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.semAgendamentos}>
              <View style={styles.iconeVazio}><Ionicons name="calendar-clear-outline" size={34} color="#C9A86A" /></View>
              <Text style={styles.vazioTitulo}>Dia livre por aqui!</Text>
              <Text style={styles.vazioTexto}>Não há agendamentos marcados para {diaSel.toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}. Que tal reservar esse horário para uma nova cliente?</Text>
              <TouchableOpacity style={styles.btnMarcar} onPress={novoAgendamento} activeOpacity={0.8}>
                <Ionicons name="add-circle-outline" size={19} color="#fff" />
                <Text style={styles.btnMarcarTexto}>Marcar agendamento</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>

      <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 5) }]}>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.replace("/home")}><Ionicons name="home-outline" size={23} color="#171514" /><Text style={styles.tabLabel}>Início</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tabItemAtivo} onPress={() => router.replace("/agenda")}><View style={styles.indicadorAtivo} /><View style={styles.tabIconAtivo}><Ionicons name="calendar" size={27} color="#171514" /></View><Text style={styles.tabLabelAtivo}>Agenda</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/clientes")}><Ionicons name="people-outline" size={23} color="#171514" /><Text style={styles.tabLabel}>Clientes</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/financeiro")}><FontAwesome5 name="dollar-sign" size={19} color="#171514" /><Text style={styles.tabLabel}>Financeiro</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/mais")}><Ionicons name="settings-outline" size={23} color="#171514" /><Text style={styles.tabLabel}>Mais</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: FUNDO },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, paddingTop: 6, paddingBottom: 12, backgroundColor: FUNDO },
  btnMenu: { width: 38, height: 38, alignItems: "center", justifyContent: "center", backgroundColor: "transparent", elevation: 0, marginBottom: 80 },
  headerCenter: { flex: 1, alignItems: "center", justifyContent: "center" },
  ladoVazio: { width: 38 },
  logoImg: { width: 300, height: 300, top: 10, margin: -90 },
  content: { flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 22, borderTopRightRadius: 22, overflow: "hidden" },
  conteudoScroll: { paddingHorizontal: 14, paddingTop: 18, paddingBottom: 25 },
  titulo: { fontSize: 23, fontWeight: "800", color: "#000" },
  subtitulo: { fontSize: 12, color: "#888", marginTop: 3, marginBottom: 12 },
  mesHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  setaMes: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: "#f7c5d8" },
  mesTexto: { fontSize: 14, fontWeight: "700", color: "#000" },
  diasRow: { flexDirection: "row", justifyContent: "space-between", gap: 4 },
  diaItem: { flex: 1, minWidth: 0, height: 66, borderRadius: 12, borderWidth: 1, borderColor: "#F0E7E2", backgroundColor: "#f7c5d8", alignItems: "center", justifyContent: "center", paddingVertical: 5 },
  diaAtivo: { backgroundColor: "#000", borderColor: "#000", transform: [{ scale: 1.04 }] },
  diaSemana: { fontSize: 10, color: "#777", textTransform: "capitalize" },
  diaNum: { fontSize: 16, fontWeight: "800", color: "#000", marginTop: 5 },
  textoDiaAtivo: { color: "#fff" },
  marcadorHoje: { width: 4, height: 4, borderRadius: 2, backgroundColor: "#f7c5d8", marginTop: 3 },
  marcadorHojeAtivo: { backgroundColor: "#f7c5d8" },
  dicaDeslize: { fontSize: 10, color: "#888", textAlign: "center", marginTop: 8, marginBottom: 17 },
  barraData: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  dataLeft: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8, marginRight: 8 },
  dataInfo: { flex: 1 },
  dataTexto: { fontSize: 12, fontWeight: "700", color: "#000", textTransform: "capitalize" },
  quantidadeTexto: { fontSize: 10, color: "#888", marginTop: 3 },
  btnNovo: { flexDirection: "row", backgroundColor: "#000", paddingHorizontal: 11, paddingVertical: 9, borderRadius: 9, alignItems: "center", justifyContent: "center", gap: 4 },
  btnNovoTexto: { color: "#fff", fontSize: 11, fontWeight: "700" },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#f7c5d8", borderRadius: 13, paddingVertical: 13, paddingHorizontal: 9, marginBottom: 10 },
  cardHora: { width: 51 },
  hora: { fontSize: 13, fontWeight: "800", color: "#000" },
  dur: { fontSize: 9, color: "#666", marginTop: 3 },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: "#F5D547", alignItems: "center", justifyContent: "center", marginHorizontal: 8 },
  avatarLetra: { fontWeight: "800", color: "#000", fontSize: 13 },
  cardMeio: { flex: 1, minWidth: 0 },
  cardNome: { fontSize: 12, fontWeight: "700", color: "#000" },
  servRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  servTexto: { fontSize: 10, color: "#444", flexShrink: 1 },
  cardRight: { alignItems: "flex-end", justifyContent: "center", marginLeft: 5 },
  badge: { paddingHorizontal: 6, paddingVertical: 4, borderRadius: 8 },
  badgeConfirmado: { backgroundColor: "#DFF5E1" },
  badgePendente: { backgroundColor: "#FFE0D6" },
  badgeTexto: { fontSize: 8, fontWeight: "700" },
  textoConfirmado: { color: "#2E7D32" },
  textoPendente: { color: "#D86A4A" },
  chevronCard: { marginTop: 5 },
  semAgendamentos: { alignItems: "center", backgroundColor: FUNDO, borderRadius: 16, paddingHorizontal: 22, paddingVertical: 28, marginTop: 4, marginBottom: 12, borderWidth: 1, borderColor: "#F2E5DE" },
  iconeVazio: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  vazioTitulo: { fontSize: 16, fontWeight: "800", color: "#000", textAlign: "center" },
  vazioTexto: { fontSize: 12, lineHeight: 19, color: "#777", textAlign: "center", marginTop: 8 },
  btnMarcar: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, backgroundColor: "#000", borderRadius: 10, paddingVertical: 12, paddingHorizontal: 16, marginTop: 17 },
  btnMarcarTexto: { color: "#fff", fontSize: 12, fontWeight: "700" },
  tabBar: { minHeight: 70, backgroundColor: ROSA, flexDirection: "row", alignItems: "stretch", justifyContent: "space-around", borderTopLeftRadius: 25, borderTopRightRadius: 25, elevation: 8 },
  tabItem: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 9, paddingBottom: 5 },
  tabItemAtivo: { flex: 1, alignItems: "center", justifyContent: "flex-start", paddingTop: 0, paddingBottom: 5, transform: [{ scale: 1.06 }] },
  indicadorAtivo: { width: "65%", height: 3, backgroundColor: "#000", borderRadius: 2 },
  tabIconAtivo: { width: 37, height: 37, alignItems: "center", justifyContent: "center" },
  tabLabel: { color: "#171514", fontSize: 9, marginTop: 4 },
  tabLabelAtivo: { color: "#171514", fontSize: 10, fontWeight: "900", marginTop: 3 },
});