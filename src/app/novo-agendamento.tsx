import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Modal,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import MenuDrawer from "../components/MenuDrawer";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { supabase } from "../lib/supabase";

const FUNDO = "#FFFBF8";
const ROSA = "#FFD9C7";
const ROSA_ESCURO = "#E8A88C";

type ClienteOpt = { id: string; nome: string };
type ServicoOpt = { id: string; nome: string; duracao?: string };

function CalendarioCustom({ visivel, dataSelecionada, onClose, onSelecionar }: any) {
  const [dataView, setDataView] = useState(() => new Date(dataSelecionada.getFullYear(), dataSelecionada.getMonth(), 1));
  const ano = dataView.getFullYear(); const mes = dataView.getMonth();
  const meses = ["JANEIRO","FEVEREIRO","MARÇO","ABRIL","MAIO","JUNHO","JULHO","AGOSTO","SETEMBRO","OUTUBRO","NOVEMBRO","DEZEMBRO"];
  const diasSemana = ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];
  function mudarMes(d: number){ setDataView(new Date(ano, mes + d, 1)); }
  function getDias(): (number | null)[] {
    const primeiroDia = new Date(ano, mes, 1).getDay();
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();
    const inicio = primeiroDia === 0 ? 6 : primeiroDia - 1;
    const dias: (number | null)[] = [];
    for(let i=0;i<inicio;i++) dias.push(null);
    for(let i=1;i<=diasNoMes;i++) dias.push(i);
    while(dias.length % 7 !== 0) dias.push(null);
    return dias;
  }
  const dias = getDias(); const semanas: (number | null)[][] = [];
  for(let i=0;i<dias.length;i+=7) semanas.push(dias.slice(i,i+7));

  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalFundo}>
        <View style={styles.calendarioBox}>
          <View style={styles.calHeader}>
            <TouchableOpacity onPress={()=>mudarMes(-1)}><Ionicons name="chevron-back" size={22} color="#000" /></TouchableOpacity>
            <Text style={styles.calMesAno}>{meses[mes]} {ano}</Text>
            <TouchableOpacity onPress={()=>mudarMes(1)}><Ionicons name="chevron-forward" size={22} color="#000" /></TouchableOpacity>
          </View>
          <View style={styles.calSemanaRow}><Text style={styles.calSemNumHeader}>sem</Text>{diasSemana.map((d)=><Text key={d} style={styles.calSemLabel}>{d}</Text>)}</View>
          {semanas.map((semana, idx)=>(
            <View key={idx} style={styles.calLinha}>
              <View style={styles.calCelSem}><Text style={styles.calSemNum}>{String(idx+1).padStart(2,"0")}</Text></View>
              {semana.map((dia,col)=>{
                const selecionado = dia!==null && dia===dataSelecionada.getDate() && mes===dataSelecionada.getMonth() && ano===dataSelecionada.getFullYear();
                const hoje = dia!==null && dia===new Date().getDate() && mes===new Date().getMonth() && ano===new Date().getFullYear();
                return (
                  <TouchableOpacity key={`${idx}-${col}`} style={[styles.calCel, selecionado && styles.calCelAtivo, hoje && !selecionado && styles.calCelHoje]} disabled={dia===null} onPress={()=>{ if(dia!==null) onSelecionar(new Date(ano,mes,dia)); }}>
                    {dia!==null && <Text style={[styles.calDiaTexto, selecionado && styles.calDiaAtivo]}>{String(dia).padStart(2,"0")}</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
          <View style={styles.calFooter}><TouchableOpacity style={styles.btnFechar} onPress={onClose}><Text style={styles.btnFecharTxt}>Fechar</Text></TouchableOpacity></View>
        </View>
      </View>
    </Modal>
  );
}

export default function NovoAgendamento() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);
  const [clientes, setClientes] = useState<ClienteOpt[]>([]);
  const [servicos, setServicos] = useState<ServicoOpt[]>([]);
  const [clienteSel, setClienteSel] = useState<ClienteOpt | null>(null);
  const [servicoSel, setServicoSel] = useState<ServicoOpt | null>(null);
  const [data, setData] = useState(new Date());
  const [hora, setHora] = useState(()=>{ const d=new Date(); d.setHours(9,0,0,0); return d; });
  const [showCal, setShowCal] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [showCliente, setShowCliente] = useState(false);
  const [showServico, setShowServico] = useState(false);
  const [obs, setObs] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(true);

  useEffect(()=>{
    async function load() {
      setCarregandoDados(true);
      const { data: { user } } = await supabase.auth.getUser();
      if(!user){ setCarregandoDados(false); return; }
      const { data: cli } = await supabase.from("clientes").select("id,nome").eq("user_id", user.id).order("nome");
      const { data: serv } = await supabase.from("servicos").select("id,nome").eq("user_id", user.id).order("nome");
      setClientes(cli || []);
      setServicos(serv || []);
      setCarregandoDados(false);
    }
    load();
  },[]);

  function formatarData(d: Date){ return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`; }
  function formatarHora(d: Date){ return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`; }
  function alterarHora(evento: DateTimePickerEvent, novaHora?: Date){
    if(Platform.OS==="android") setShowTime(false);
    if(evento.type==="set" && novaHora) setHora(novaHora);
  }

  async function salvarAgendamento() {
    if (!clienteSel) { Alert.alert("Atenção","Selecione uma cliente."); return; }
    if (!servicoSel) { Alert.alert("Atenção","Selecione um serviço."); return; }

    try {
      setSalvando(true);
      const { data: { user } } = await supabase.auth.getUser();
      if(!user){ Alert.alert("Erro","Usuário não logado"); return; }

      const dataISO = `${data.getFullYear()}-${String(data.getMonth()+1).padStart(2,"0")}-${String(data.getDate()).padStart(2,"0")}`;
      const horaISO = `${String(hora.getHours()).padStart(2,"0")}:${String(hora.getMinutes()).padStart(2,"0")}:00`;
      const { error } = await supabase.from("agendamentos").insert({
        user_id: user.id,
        cliente_id: clienteSel.id,
        servico_id: servicoSel.id,
        data: dataISO,
        hora: horaISO,
        duracao: servicoSel.duracao || "1h",
        status: "Confirmado",
        observacoes: obs || null
      });

      if(error) throw error;

      router.replace("/agendamento-salvo" as never);
    } catch(e: any){
      Alert.alert("Erro ao salvar", e.message || "Tente novamente");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <MenuDrawer visible={menuAberto} onClose={()=>setMenuAberto(false)} rotaAtiva="agenda" />
      <CalendarioCustom visivel={showCal} dataSelecionada={data} onClose={()=>setShowCal(false)} onSelecionar={(novaData: Date)=>{ setData(novaData); setShowCal(false); }} />

      <View style={styles.headerTop}>
        <TouchableOpacity style={styles.btnBack} onPress={()=>router.back()}><Ionicons name="arrow-back" size={22} color="#000" /></TouchableOpacity>
        <View style={styles.logoWrap}><Image source={require("../../assets/images/Teresa_Silva_logo_transparente.png")} style={styles.logoImg} resizeMode="contain" /></View>
        <TouchableOpacity style={styles.btnMenu} onPress={()=>setMenuAberto(true)}><Ionicons name="menu" size={26} color="#000" /></TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.conteudoScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>Novo Agendamento</Text>
        <Text style={styles.subtitulo}>Defina os detalhes do serviço</Text>

        {carregandoDados ? <ActivityIndicator color="#000" style={{marginVertical:20}}/> : (
          <>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Selecionar Cliente</Text>
              <TouchableOpacity style={styles.selectBox} onPress={()=>{ setShowCliente(!showCliente); setShowServico(false); }}>
                <Text style={[styles.selectTexto, !clienteSel && styles.placeholder]}>{clienteSel?.nome || (clientes.length===0 ? "Nenhuma cliente cadastrada" : "Selecionar cliente...")}</Text>
                <Ionicons name="chevron-down" size={16} color="#000" />
              </TouchableOpacity>
              {showCliente && (
                <View style={styles.dropdown}>
                  {clientes.map((c)=>(
                    <TouchableOpacity key={c.id} style={styles.dropdownItem} onPress={()=>{ setClienteSel(c); setShowCliente(false); }}>
                      <Text style={styles.dropdownTexto}>{c.nome}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardLabel}>Serviço</Text>
              <TouchableOpacity style={styles.selectBox} onPress={()=>{ setShowServico(!showServico); setShowCliente(false); }}>
                <Text style={[styles.selectTexto, !servicoSel && styles.placeholder]}>{servicoSel?.nome || (servicos.length===0 ? "Nenhum serviço cadastrado" : "Selecionar serviço...")}</Text>
                <Ionicons name="chevron-down" size={16} color="#000" />
              </TouchableOpacity>
              {showServico && (
                <View style={styles.dropdown}>
                  {servicos.map((s)=>(
                    <TouchableOpacity key={s.id} style={styles.dropdownItem} onPress={()=>{ setServicoSel(s); setShowServico(false); }}>
                      <Text style={styles.dropdownTexto}>{s.nome}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </>
        )}

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Data e Horário</Text>
          <TouchableOpacity style={styles.selectBox} onPress={()=>{ setShowCliente(false); setShowServico(false); setShowTime(false); setShowCal(true); }} activeOpacity={0.7}>
            <View style={styles.selectIconTexto}><Ionicons name="calendar-outline" size={19} color="#000"/><View style={styles.infoSelecao}><Text style={styles.selectTexto}>{formatarData(data)}</Text><Text style={styles.textoAuxiliar}>Selecionar data</Text></View></View>
            <Ionicons name="chevron-down" size={17} color="#000"/>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.selectBox, styles.caixaHora]} onPress={()=>{ setShowCliente(false); setShowServico(false); setShowCal(false); setShowTime(true); }} activeOpacity={0.7}>
            <View style={styles.selectIconTexto}><Ionicons name="time-outline" size={19} color="#000"/><View style={styles.infoSelecao}><Text style={styles.selectTexto}>{formatarHora(hora)}</Text><Text style={styles.textoAuxiliar}>Selecionar horário</Text></View></View>
            <Ionicons name="chevron-down" size={17} color="#000" />
          </TouchableOpacity>
          {showTime && <DateTimePicker value={hora} mode="time" is24Hour display={Platform.OS==="android" ? "default" : "spinner"} onChange={alterarHora}/>}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Observações</Text>
          <View style={styles.textAreaBox}><TextInput style={styles.textArea} placeholder="Adicione observações..." placeholderTextColor="#888" multiline value={obs} onChangeText={setObs}/></View>
        </View>

        <TouchableOpacity style={[styles.btnSalvar, salvando && { opacity:0.6 }]} activeOpacity={0.8} onPress={salvarAgendamento} disabled={salvando}>
          {salvando ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnSalvarTexto}>Salvar Agendamento</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: FUNDO },
  headerTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12, backgroundColor: FUNDO, paddingBottom: 6 },
  btnBack: { width: 34, height: 34, alignItems: "center", justifyContent: "center", marginBottom: 70 },
  btnMenu: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", elevation: 2, marginBottom: 70 },
  logoWrap: { flex: 1, alignItems: "center" },
  logoImg: { width: 300, height: 300, margin: -80 },
  content: { flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 22, borderTopRightRadius: 22, overflow: "hidden" },
  conteudoScroll: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 30 },
  titulo: { fontSize: 20, fontWeight: "800", color: "#000", textAlign: "center" },
  subtitulo: { fontSize: 11, color: "#D9B08A", textAlign: "center", marginTop: 2, marginBottom: 20 },
  card: { backgroundColor: "#f7c5d8", borderRadius: 12, padding: 12, marginBottom: 14 },
  cardLabel: { fontSize: 11, fontWeight: "600", color: "#000", marginBottom: 8 },
  selectBox: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: "#000", borderRadius: 10, paddingHorizontal: 12, minHeight: 48, backgroundColor: "#fff" },
  selectIconTexto: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  infoSelecao: { flex: 1 },
  selectTexto: { fontSize: 12, color: "#000" },
  textoAuxiliar: { fontSize: 10, color: "#555", marginTop: 2 },
  placeholder: { color: "#555" },
  caixaHora: { marginTop: 10 },
  dropdown: { marginTop: 8, backgroundColor: "#fff", borderRadius: 10, borderWidth: 1, borderColor: "#000", overflow: "hidden" },
  dropdownItem: { paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderColor: "#eee" },
  dropdownTexto: { fontSize: 12, color: "#000" },
  textAreaBox: { borderWidth: 1, borderColor: "#000", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, minHeight: 60, backgroundColor: "#fff" },
  textArea: { fontSize: 12, color: "#000", minHeight: 60, textAlignVertical: "top" },
  btnSalvar: { backgroundColor: "#dc4881", borderRadius: 12, height: 48, alignItems: "center", justifyContent: "center", marginTop: 10, elevation: 2 },
  btnSalvarTexto: { fontSize: 14, fontWeight: "700", color: "#fff" },
  modalFundo: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", alignItems: "center", justifyContent: "center", padding: 16 },
  calendarioBox: { width: "100%", maxWidth: 340, backgroundColor: "#fff", borderRadius: 12, overflow: "hidden", borderWidth: 2, borderColor: "#000" },
  calHeader: { backgroundColor: "#f7c5d8", paddingVertical: 12, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  calMesAno: { color: "#000", fontWeight: "800", fontSize: 14, letterSpacing: 1 },
  calSemanaRow: { flexDirection: "row", backgroundColor: "#f7c5d8", paddingVertical: 6, borderBottomWidth: 1, borderColor: "#000" },
  calSemNumHeader: { width: 30, textAlign: "center", fontSize: 9, fontWeight: "700", color: "#555" },
  calSemLabel: { flex: 1, textAlign: "center", fontSize: 10, fontWeight: "700", color: "#000" },
  calLinha: { flexDirection: "row", borderBottomWidth: 1, borderColor: ROSA, minHeight: 36 },
  calCelSem: { width: 30, backgroundColor: "#f7c5d8", alignItems: "center", justifyContent: "center", borderRightWidth: 1, borderColor: "#dc4881" },
  calSemNum: { fontSize: 10, color: "#dc4881", fontWeight: "700" },
  calCel: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 6 },
  calCelAtivo: { backgroundColor: "#000", borderRadius: 8 },
  calCelHoje: { borderWidth: 1, borderColor: ROSA_ESCURO, borderRadius: 8 },
  calDiaTexto: { fontSize: 12, color: "#000" },
  calDiaAtivo: { color: "#fff", fontWeight: "800" },
  calFooter: { backgroundColor: "#fff", padding: 10, alignItems: "center" },
  btnFechar: { backgroundColor: "#dc4881", paddingHorizontal: 20, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: "#000" },
  btnFecharTxt: { fontSize: 12, fontWeight: "700", color: "#fff" },
});