import React, { useCallback, useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert,} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import MenuDrawer from "../components/MenuDrawer";
import { supabase } from "../lib/supabase";

const ROSA = "#f7c5d8";
const TEXTO = "#171514";
type Periodo = "Hoje" | "Semana" | "Mês";
type DadoGrafico = { label: string; valor: number; };
type Transacao = { id: string; nome: string; serv: string; valor: number; data: string; status: string; };

function obterNome(relacao: any) {
  if (!relacao) return "Não informado";
  if (Array.isArray(relacao)) return relacao[0]?.nome ?? "Não informado";
  return relacao.nome ?? "Não informado";
}
function formatarMoeda(valor: number) { return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
function formatarData(data: string | null) {
  if (!data) return "--/--";
  const p = data.slice(0,10).split("-");
  if (p.length!==3) return "--/--";
  return `${p[2]}/${p[1]}`;
}
function dataLocalISO(d: Date){ return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
function inicioDaSemana(data: Date){
  const inicio = new Date(data);
  const dia = inicio.getDay();
  inicio.setDate(inicio.getDate() - (dia===0 ? 6 : dia-1));
  inicio.setHours(0,0,0,0);
  return inicio;
}
function statusPago(status: string){
  const n = status.trim().toLowerCase();
  return ["pago","paga","concluído","concluido","confirmado"].includes(n);
}
function nomeStatus(status: string){
  if(statusPago(status)) return "Pago";
  const n = status.trim().toLowerCase();
  if(n==="pendente") return "Pendente";
  if(n==="cancelado") return "Cancelado";
  return status || "Pendente";
}

export default function Financeiro() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [filtro, setFiltro] = useState<Periodo>("Mês");
  const [menuAberto, setMenuAberto] = useState(false);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregarFinanceiro = useCallback(async () => {
    setCarregando(true); setErro("");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }

      // CORREÇÃO: filtra por user_id e busca hora + valor + preco do serviço como fallback
      const { data, error } = await supabase
        .from("agendamentos")
        .select(`
          id,
          data,
          hora,
          horario,
          valor,
          status,
          clientes ( nome ),
          servicos ( nome, preco )
        `)
        .eq("user_id", user.id)
        .order("data", { ascending: false })
        .order("hora", { ascending: false });

      if (error) throw error;

      const lista: Transacao[] = (data ?? []).map((item: any) => ({
        id: String(item.id),
        nome: obterNome(item.clientes),
        serv: obterNome(item.servicos),
        valor: Number(item.valor ?? item.servicos?.preco ?? 0),
        data: item.data ?? "",
        status: nomeStatus(item.status ?? ""),
      }));

      setTransacoes(lista);
    } catch (e: any) {
      console.error(e);
      setErro("Não foi possível carregar. Verifique as permissões.");
      Alert.alert("Erro", e.message);
    } finally { setCarregando(false); }
  }, [router]);

  useFocusEffect(useCallback(()=>{ void carregarFinanceiro(); },[carregarFinanceiro]));

  const dadosPeriodo = useMemo(() => {
    const hoje = new Date(); hoje.setHours(0,0,0,0);
    const hojeISO = dataLocalISO(hoje);
    const semanaInicio = inicioDaSemana(hoje);
    const semanaInicioISO = dataLocalISO(semanaInicio);
    const mesInicioISO = dataLocalISO(new Date(hoje.getFullYear(), hoje.getMonth(), 1));

    const transacoesPeriodo = transacoes.filter((item)=>{
      if(!item.data) return false;
      const data = item.data.slice(0,10);
      if(filtro==="Hoje") return data===hojeISO;
      if(filtro==="Semana") return data>=semanaInicioISO && data<=hojeISO;
      return data>=mesInicioISO && data<=hojeISO;
    });

    const pagas = transacoesPeriodo.filter((i)=> statusPago(i.status) || i.status.toLowerCase()==="confirmado");
    const faturamento = pagas.reduce((t,i)=>t+i.valor,0);

    let grafico: DadoGrafico[] = [];
    if(filtro==="Hoje"){
      // Agrupa por período do dia já que não temos hora salva em todas
      grafico = [
        { label: "Hoje", valor: faturamento }
      ];
    } else if(filtro==="Semana"){
      const dias = ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];
      grafico = dias.map((label, index)=>{
        const dia = new Date(semanaInicio);
        dia.setDate(semanaInicio.getDate()+index);
        const iso = dataLocalISO(dia);
        return { label, valor: pagas.filter((i)=>i.data.slice(0,10)===iso).reduce((t,i)=>t+i.valor,0) };
      });
    } else {
      grafico = Array.from({length:4}, (_, idx)=>{
        const inicioDia = new Date(hoje.getFullYear(), hoje.getMonth(), idx*7+1);
        const fimDia = new Date(hoje.getFullYear(), hoje.getMonth(), idx*7+7);
        return {
          label: `Sem. ${idx+1}`,
          valor: pagas.filter((i)=>{
            const data = i.data.slice(0,10);
            return data>=dataLocalISO(inicioDia) && data<=dataLocalISO(fimDia);
          }).reduce((t,i)=>t+i.valor,0)
        };
      });
    }

    return { transacoesPeriodo, faturamento, grafico };
  }, [transacoes, filtro]);

  const dadosAtuais = dadosPeriodo.grafico;
  const maiorValor = Math.max(...dadosAtuais.map(i=>i.valor),1);
  const tituloGrafico = filtro==="Hoje" ? "Faturamento Diário" : filtro==="Semana" ? "Faturamento Semanal" : "Faturamento Mensal";

  const recentes = [...transacoes].sort((a,b)=> b.data.localeCompare(a.data)).slice(0,10);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <MenuDrawer visible={menuAberto} onClose={()=>setMenuAberto(false)} rotaAtiva="financeiro" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnMenu} onPress={()=>setMenuAberto(true)}><Ionicons name="menu" size={26} color="#000" /></TouchableOpacity>
        <View style={styles.headerCenter}><Image source={require("../../assets/images/Teresa_Silva_logo_transparente.png")} style={styles.logoImg} resizeMode="contain" /></View>
        <View style={{width:34}}/>
      </View>

      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.conteudoScroll}>
          <Text style={styles.titulo}>Financeiro</Text>

          {carregando ? <ActivityIndicator size="large" color="#B66F81" style={{marginVertical:30}}/> : erro ? (
            <View style={styles.estado}><Ionicons name="cloud-offline-outline" size={38} color="#C9A86A"/><Text style={styles.estadoTitulo}>Não foi possível carregar</Text><Text style={styles.estadoTexto}>{erro}</Text><TouchableOpacity style={styles.botaoTentar} onPress={()=>void carregarFinanceiro()}><Text style={styles.textoTentar}>Tentar novamente</Text></TouchableOpacity></View>
          ) : (
            <>
              <View style={styles.cardsRow}>
                <View style={styles.cardTop}><Ionicons name="trending-up-outline" size={22} color="#000"/><Text style={styles.cardLabel}>Faturamento</Text><Text style={styles.cardValor}>{formatarMoeda(dadosPeriodo.faturamento)}</Text></View>
                <View style={styles.cardTop}><MaterialIcons name="money-off" size={22} color="#000"/><Text style={styles.cardLabel}>Despesas</Text><Text style={styles.cardValor}>Em breve</Text></View>
                <View style={styles.cardTop}><Ionicons name="wallet-outline" size={22} color="#000"/><Text style={styles.cardLabel}>Lucro</Text><Text style={styles.cardValor}>{formatarMoeda(dadosPeriodo.faturamento)}</Text></View>
              </View>

              <View style={styles.filtroHeader}>
                <Text style={styles.secaoTitulo}>{tituloGrafico}</Text>
                <View style={styles.filtros}>
                  {(["Hoje","Semana","Mês"] as Periodo[]).map((p)=>(
                    <TouchableOpacity key={p} style={[styles.filtroBtn, filtro===p && styles.filtroAtivo]} onPress={()=>setFiltro(p)}><Text style={[styles.filtroTexto, filtro===p && styles.filtroTextoAtivo]}>{p}</Text></TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.graficoBox}>
                <View style={styles.graficoResumo}><View><Text style={styles.graficoLabel}>Faturamento no período</Text><Text style={styles.graficoTotal}>{formatarMoeda(dadosPeriodo.faturamento)}</Text></View><View style={styles.iconeGrafico}><Ionicons name="bar-chart-outline" size={22} color="#000"/></View></View>
                <View style={styles.graficoArea}>
                  {dadosAtuais.map((item, idx)=>{
                    const altura = item.valor>0 ? Math.max((item.valor/maiorValor)*125, 5) : 2;
                    return (
                      <View key={`${filtro}-${item.label}-${idx}`} style={styles.colunaGrafico}>
                        <Text style={styles.valorBarra}>{item.valor>0 ? formatarMoeda(item.valor).replace("R$","").trim() : "—"}</Text>
                        <View style={styles.areaBarra}><View style={[styles.barra, { height: altura, backgroundColor: item.valor===maiorValor && item.valor>0 ? "#C9A86A" : "#F4C7D7" }]}/></View>
                        <Text style={styles.eixoTexto}>{item.label}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              <View style={styles.transacoesHeader}><Text style={styles.secaoTitulo}>Transações Recentes</Text><Text style={styles.quantidadeTransacoes}>{recentes.length} registros</Text></View>

              {recentes.length>0 ? recentes.map((item)=>(
                <View key={item.id} style={styles.cardTransacao}>
                  <View style={styles.avatar}><Text style={styles.avatarLetra}>{item.nome.charAt(0).toUpperCase()}</Text></View>
                  <View style={styles.transInfo}><Text style={styles.transNome}>{item.nome}</Text><Text style={styles.transServ} numberOfLines={2}>{item.serv}</Text></View>
                  <View style={styles.transRight}><Text style={styles.transValor}>{formatarMoeda(item.valor)}</Text><View style={styles.transDataRow}><Text style={styles.transData}>{formatarData(item.data)}</Text><Text style={[styles.transPago, !statusPago(item.status) && styles.statusPendente]}>{item.status}</Text></View></View>
                </View>
              )) : <View style={styles.estado}><Ionicons name="receipt-outline" size={36} color="#C9A86A"/><Text style={styles.estadoTitulo}>Nenhuma transação</Text><Text style={styles.estadoTexto}>Seus agendamentos pagos aparecerão aqui.</Text></View>}
            </>
          )}
        </ScrollView>
      </View>

      <View style={[styles.navegacao, { paddingBottom: Math.max(insets.bottom,5) }]}>
        <TouchableOpacity style={styles.botaoNav} onPress={()=>router.replace("/home")}><View style={styles.areaIndicador}/><View style={styles.conteudoNav}><Ionicons name="home" size={23} color={TEXTO}/><Text style={styles.textoNav}>Início</Text></View></TouchableOpacity>
        <TouchableOpacity style={styles.botaoNav} onPress={()=>router.push("/agenda" as never)}><View style={styles.areaIndicador}/><View style={styles.conteudoNav}><Ionicons name="calendar-outline" size={23} color={TEXTO}/><Text style={styles.textoNav}>Agenda</Text></View></TouchableOpacity>
        <TouchableOpacity style={styles.botaoNav} onPress={()=>router.push("/clientes" as never)}><View style={styles.areaIndicador}/><View style={styles.conteudoNav}><Ionicons name="people-outline" size={23} color={TEXTO}/><Text style={styles.textoNav}>Clientes</Text></View></TouchableOpacity>
        <TouchableOpacity style={styles.botaoNav} onPress={()=>router.replace("/financeiro")}><View style={styles.areaIndicador}><View style={styles.linhaAtiva}/></View><View style={[styles.conteudoNav, styles.conteudoNavAtivo]}><Ionicons name="cash" size={27} color={TEXTO}/><Text style={styles.textoNavAtivo}>Financeiro</Text></View></TouchableOpacity>
        <TouchableOpacity style={styles.botaoNav} onPress={()=>router.push("/mais" as never)}><View style={styles.areaIndicador}/><View style={styles.conteudoNav}><Ionicons name="settings-outline" size={23} color={TEXTO}/><Text style={styles.textoNav}>Mais</Text></View></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F5" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, paddingTop: 6, paddingBottom: 12, backgroundColor: "#FFF8F5" },
  btnMenu: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", elevation: 2, marginBottom: 80 },
  headerCenter: { alignItems: "center" },
  content: { flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 25, borderTopRightRadius: 25, paddingHorizontal: 14, paddingTop: 16, overflow: "hidden" },
  conteudoScroll: { paddingBottom: 20 },
  titulo: { fontSize: 22, fontWeight: "800", color: "#000", textAlign: "center", marginBottom: 14 },
  cardsRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  cardTop: { flex: 1, backgroundColor: "#f7c5d8", borderRadius: 12, paddingVertical: 12, paddingHorizontal: 5, alignItems: "center", borderWidth: 1, borderColor: "#000" },
  cardLabel: { fontSize: 10, color: "#000", marginTop: 4, textAlign: "center" },
  cardValor: { fontSize: 11, fontWeight: "800", color: "#000", marginTop: 3, textAlign: "center" },
  filtroHeader: { gap: 10, marginBottom: 10 },
  secaoTitulo: { fontSize: 13, fontWeight: "700", color: "#000" },
  filtros: { flexDirection: "row", gap: 7 },
  filtroBtn: { paddingHorizontal: 13, paddingVertical: 7, borderRadius: 8, borderWidth: 1, borderColor: "#ddd", backgroundColor: "#fff" },
  filtroAtivo: { backgroundColor: ROSA, borderColor: "#000" },
  filtroTexto: { fontSize: 11, color: "#000" },
  filtroTextoAtivo: { fontWeight: "800" },
  graficoBox: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#eee", borderRadius: 14, padding: 12, marginBottom: 20 },
  graficoResumo: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  graficoLabel: { fontSize: 10, color: "#888" },
  graficoTotal: { fontSize: 21, fontWeight: "800", color: "#171514", marginTop: 4 },
  iconeGrafico: { width: 38, height: 38, borderRadius: 12, backgroundColor: ROSA, alignItems: "center", justifyContent: "center" },
  graficoArea: { minHeight: 180, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-around", paddingTop: 8, borderBottomWidth: 1, borderBottomColor: "#eee" },
  colunaGrafico: { flex: 1, alignItems: "center", justifyContent: "flex-end", minWidth: 0 },
  valorBarra: { fontSize: 8, color: "#555", marginBottom: 4 },
  areaBarra: { height: 130, width: "65%", maxWidth: 30, justifyContent: "flex-end", alignItems: "center" },
  barra: { width: "100%", minHeight: 5, borderTopLeftRadius: 6, borderTopRightRadius: 6 },
  eixoTexto: { fontSize: 9, color: "#777", marginTop: 7, marginBottom: 8, textAlign: "center" },
  transacoesHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  quantidadeTransacoes: { fontSize: 10, color: "#888" },
  cardTransacao: { flexDirection: "row", alignItems: "center", backgroundColor: "#f7c5d8", borderRadius: 12, padding: 12, marginBottom: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#F5D547", alignItems: "center", justifyContent: "center" },
  avatarLetra: { fontWeight: "800", color: "#000" },
  transInfo: { flex: 1, minWidth: 0, marginLeft: 10, marginRight: 5 },
  transNome: { fontSize: 13, fontWeight: "700", color: "#000" },
  transServ: { fontSize: 10, color: "#555", marginTop: 3 },
  transRight: { alignItems: "flex-end" },
  transValor: { fontSize: 13, fontWeight: "800", color: "#000" },
  transDataRow: { flexDirection: "row", gap: 5, alignItems: "center", marginTop: 4 },
  transData: { fontSize: 10, color: "#555" },
  transPago: { fontSize: 10, color: "#2E7D32", fontWeight: "700" },
  statusPendente: { color: "#8A5A00" },
  estado: { alignItems: "center", justifyContent: "center", paddingHorizontal: 20, paddingVertical: 30 },
  estadoTitulo: { fontSize: 14, fontWeight: "700", color: TEXTO, marginTop: 12, textAlign: "center" },
  estadoTexto: { fontSize: 12, color: "#888", marginTop: 5, textAlign: "center" },
  botaoTentar: { marginTop: 15, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, backgroundColor: ROSA },
  textoTentar: { color: TEXTO, fontSize: 12, fontWeight: "700" },
  navegacao: { minHeight: 70, backgroundColor: ROSA, flexDirection: "row", alignItems: "stretch", justifyContent: "space-around", paddingTop: 0, borderTopLeftRadius: 25, borderTopRightRadius: 25, elevation: 8 },
  botaoNav: { flex: 1, alignItems: "center", justifyContent: "flex-start", minHeight: 65 },
  areaIndicador: { width: "100%", height: 4, alignItems: "center", justifyContent: "center" },
  linhaAtiva: { width: "65%", height: 3, backgroundColor: "#000", borderRadius: 2 },
  conteudoNav: { flex: 1, width: "100%", alignItems: "center", justifyContent: "center", gap: 3 },
  conteudoNavAtivo: { transform: [{ scale: 1.06 }] },
  textoNav: { color: TEXTO, fontSize: 9 },
  textoNavAtivo: { fontWeight: "900", fontSize: 10 },
  logoImg: { width: 300, height: 300, top: 10, margin: -90 },
});