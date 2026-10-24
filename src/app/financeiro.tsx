
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import MenuDrawer from "../components/MenuDrawer";

const ROSA = "#f7c5d8";
const TEXTO = "#171514";

type Periodo = "Hoje" | "Semana" | "Mês";

type DadoGrafico = {
  label: string;
  valor: number;
};

const TRANSACOES = [
  {
    id: "1",
    nome: "Ana Souza",
    serv: "Alongamento em gel",
    valor: "R$ 80",
    data: "04/10",
    status: "Pago",
  },
  {
    id: "2",
    nome: "Ana Souza",
    serv: "Alongamento em gel",
    valor: "R$ 80",
    data: "04/10",
    status: "Pago",
  },
  {
    id: "3",
    nome: "Ana Souza",
    serv: "Alongamento em gel",
    valor: "R$ 80",
    data: "04/10",
    status: "Pago",
  },
];

// Dados de demonstração para cada período.
const DADOS_GRAFICO: Record<Periodo, DadoGrafico[]> = {
  Hoje: [
    { label: "08h", valor: 40 },
    { label: "10h", valor: 120 },
    { label: "12h", valor: 80 },
    { label: "14h", valor: 180 },
    { label: "16h", valor: 100 },
    { label: "18h", valor: 150 },
  ],
  Semana: [
    { label: "Seg", valor: 250 },
    { label: "Ter", valor: 380 },
    { label: "Qua", valor: 180 },
    { label: "Qui", valor: 520 },
    { label: "Sex", valor: 430 },
    { label: "Sáb", valor: 650 },
    { label: "Dom", valor: 120 },
  ],
  Mês: [
    { label: "Sem. 1", valor: 650 },
    { label: "Sem. 2", valor: 820 },
    { label: "Sem. 3", valor: 580 },
    { label: "Sem. 4", valor: 800 },
  ],
};

type IconName = React.ComponentProps<typeof Ionicons>["name"];

type BotaoNavProps = {
  icone: IconName;
  titulo: string;
  ativo: boolean;
  onPress: () => void;
};

function BotaoNav({
  icone,
  titulo,
  ativo,
  onPress,
}: BotaoNavProps) {
  return (
    <TouchableOpacity style={styles.botaoNav} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.areaIndicador}>
        {ativo && <View style={styles.linhaAtiva} />}
      </View>

      <View style={[ styles.conteudoNav, ativo && styles.conteudoNavAtivo, ]}>
        <Ionicons name={icone} size={ativo ? 27 : 23} color={TEXTO}/>
        <Text style={[ styles.textoNav, ativo && styles.textoNavAtivo, ]}>
          {titulo}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function Financeiro() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [filtro, setFiltro] = useState<Periodo>("Mês");
  const [menuAberto, setMenuAberto] = useState(false);

  function navegar(destino: string) {
    router.push(destino as never);
  }

  const dadosAtuais = DADOS_GRAFICO[filtro];
  const maiorValor = Math.max( ...dadosAtuais.map((item) => item.valor), 1 );
  const totalPeriodo = dadosAtuais.reduce( (total, item) => total + item.valor, 0);
  const formatarMoeda = (valor: number) => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2, });
  const tituloGrafico = filtro === "Hoje"
      ? "Faturamento Diário"
      : filtro === "Semana"
      ? "Faturamento Semanal"
      : "Faturamento Mensal";
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <MenuDrawer visible={menuAberto} onClose={() => setMenuAberto(false)} rotaAtiva="financeiro"/>

      {/* CABEÇALHO */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnMenu} onPress={() => setMenuAberto(true)} activeOpacity={0.7}>
          <Ionicons name="menu" size={26} color="#000" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Image source={require("../../assets/images/Teresa_Silva_logo_transparente.png")} style={styles.logoImg} resizeMode="contain"/>
        </View>

        <View style={{ width: 34 }} />
      </View>

      {/* CONTEÚDO */}
      <View style={styles.content}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.conteudoScroll}
        >
          <Text style={styles.titulo}>Financeiro</Text>

          {/* CARDS DO RESUMO */}
          <View style={styles.cardsRow}>
            <View style={styles.cardTop}>
              <Ionicons
                name="trending-up-outline"
                size={22}
                color="#000"
              />
              <Text style={styles.cardLabel}>Faturamento</Text>
              <Text style={styles.cardValor}>R$ 2.850</Text>
            </View>

            <View style={styles.cardTop}>
              <MaterialIcons
                name="money-off"
                size={22}
                color="#000"
              />
              <Text style={styles.cardLabel}>Despesas</Text>
              <Text style={styles.cardValor}>R$ 420</Text>
            </View>

            <View style={styles.cardTop}>
              <Ionicons
                name="wallet-outline"
                size={22}
                color="#000"
              />
              <Text style={styles.cardLabel}>Lucro</Text>
              <Text style={styles.cardValor}>R$ 2.430</Text>
            </View>
          </View>

          {/* FILTROS DO GRÁFICO */}
          <View style={styles.filtroHeader}>
            <Text style={styles.secaoTitulo}>{tituloGrafico}</Text>

            <View style={styles.filtros}>
              {(["Hoje", "Semana", "Mês"] as Periodo[]).map(
                (periodo) => (
                  <TouchableOpacity
                    key={periodo}
                    style={[
                      styles.filtroBtn,
                      filtro === periodo && styles.filtroAtivo,
                    ]}
                    onPress={() => setFiltro(periodo)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.filtroTexto,
                        filtro === periodo &&
                          styles.filtroTextoAtivo,
                      ]}
                    >
                      {periodo}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>

          {/* GRÁFICO FUNCIONAL */}
          <View style={styles.graficoBox}>
            <View style={styles.graficoResumo}>
              <View>
                <Text style={styles.graficoLabel}>
                  Total do período demonstrativo
                </Text>

                <Text style={styles.graficoTotal}>
                  {formatarMoeda(totalPeriodo)}
                </Text>
              </View>

              <View style={styles.iconeGrafico}>
                <Ionicons
                  name="bar-chart-outline"
                  size={22}
                  color="#000"
                />
              </View>
            </View>

            <View style={styles.graficoArea}>
              {dadosAtuais.map((item, index) => {
                const altura = Math.max(
                  (item.valor / maiorValor) * 125,
                  5
                );

                return (
                  <View
                    key={`${filtro}-${item.label}-${index}`}
                    style={styles.colunaGrafico}
                  >
                    <Text style={styles.valorBarra}>
                      {item.valor}
                    </Text>

                    <View style={styles.areaBarra}>
                      <View
                        style={[
                          styles.barra,
                          {
                            height: altura,
                            backgroundColor:
                              item.valor === maiorValor
                                ? "#C9A86A"
                                : "#F4C7D7",
                          },
                        ]}
                      />
                    </View>

                    <Text style={styles.eixoTexto}>
                      {item.label}
                    </Text>
                  </View>
                );
              })}
            </View>

            <Text style={styles.legendaGrafico}>
              Valores em reais (R$). Selecione Hoje, Semana ou Mês
              para mudar a visualização.
            </Text>
          </View>

          {/* TRANSAÇÕES RECENTES */}
          <View style={styles.transacoesHeader}>
            <Text style={styles.secaoTitulo}>
              Transações Recentes
            </Text>

            <Text style={styles.quantidadeTransacoes}>
              {TRANSACOES.length} registros
            </Text>
          </View>

          {TRANSACOES.map((item) => (
            <View key={item.id} style={styles.cardTransacao}>
              <View style={styles.avatar}>
                <Text style={styles.avatarLetra}>A</Text>
              </View>

              <View style={styles.transInfo}>
                <Text style={styles.transNome}>{item.nome}</Text>
                <Text style={styles.transServ}>{item.serv}</Text>
              </View>

              <View style={styles.transRight}>
                <Text style={styles.transValor}>{item.valor}</Text>

                <View style={styles.transDataRow}>
                  <Text style={styles.transData}>{item.data}</Text>
                  <Text style={styles.transPago}>{item.status}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* BARRA DE NAVEGAÇÃO IGUAL À TELA ANTERIOR */}
      <View
        style={[
          styles.navegacao,
          { paddingBottom: Math.max(insets.bottom, 5) },
        ]}
      >
        <BotaoNav
          icone="home"
          titulo="Início"
          ativo={false}
          onPress={() => router.replace("/home")}
        />

        <BotaoNav
          icone="calendar-outline"
          titulo="Agenda"
          ativo={false}
          onPress={() => navegar("/agenda")}
        />

        <BotaoNav
          icone="people-outline"
          titulo="Clientes"
          ativo={false}
          onPress={() => navegar("/clientes")}
        />

        <BotaoNav
          icone="cash-outline"
          titulo="Financeiro"
          ativo={true}
          onPress={() => router.replace("/financeiro")}
        />

        <BotaoNav
          icone="settings-outline"
          titulo="Mais"
          ativo={false}
          onPress={() => navegar("/mais")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F5",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 12,
    backgroundColor: "#FFF8F5",
  },

  btnMenu: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    marginBottom: 80
  },

  headerCenter: {
    alignItems: "center",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 14,
    paddingTop: 16,
    overflow: "hidden",
  },

  conteudoScroll: {
    paddingBottom: 20,
  },

  titulo: {
    fontSize: 22,
    fontWeight: "800",
    color: "#000",
    textAlign: "center",
    marginBottom: 14,
  },

  cardsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },

  cardTop: {
    flex: 1,
    backgroundColor: "#f7c5d8",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 5,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
  },

  cardLabel: {
    fontSize: 10,
    color: "#000",
    marginTop: 4,
  },

  cardValor: {
    fontSize: 12,
    fontWeight: "800",
    color: "#000",
    marginTop: 3,
  },

  filtroHeader: {
    gap: 10,
    marginBottom: 10,
  },

  secaoTitulo: {
    fontSize: 13,
    fontWeight: "700",
    color: "#000",
  },

  filtros: {
    flexDirection: "row",
    gap: 7,
  },

  filtroBtn: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },

  filtroAtivo: {
    backgroundColor: ROSA,
    borderColor: "#000",
  },

  filtroTexto: {
    fontSize: 11,
    color: "#000",
  },

  filtroTextoAtivo: {
    fontWeight: "800",
  },

  graficoBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 14,
    padding: 12,
    marginBottom: 20,
  },

  graficoResumo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  graficoLabel: {
    fontSize: 10,
    color: "#888",
  },

  graficoTotal: {
    fontSize: 21,
    fontWeight: "800",
    color: "#171514",
    marginTop: 4,
  },

  iconeGrafico: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: ROSA,
    alignItems: "center",
    justifyContent: "center",
  },

  graficoArea: {
    minHeight: 180,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  colunaGrafico: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    minWidth: 0,
  },

  valorBarra: {
    fontSize: 9,
    color: "#555",
    marginBottom: 4,
  },

  areaBarra: {
    height: 130,
    width: "65%",
    maxWidth: 30,
    justifyContent: "flex-end",
    alignItems: "center",
  },

  barra: {
    width: "100%",
    minHeight: 5,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },

  eixoTexto: {
    fontSize: 9,
    color: "#777",
    marginTop: 7,
    marginBottom: 8,
    textAlign: "center",
  },

  legendaGrafico: {
    fontSize: 9,
    lineHeight: 14,
    color: "#888",
    marginTop: 10,
  },

  transacoesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  quantidadeTransacoes: {
    fontSize: 10,
    color: "#888",
  },

  cardTransacao: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7c5d8",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5D547",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarLetra: {
    fontWeight: "800",
    color: "#000",
  },

  transInfo: {
    flex: 1,
    marginLeft: 10,
  },

  transNome: {
    fontSize: 13,
    fontWeight: "700",
    color: "#000",
  },

  transServ: {
    fontSize: 10,
    color: "#555",
    marginTop: 3,
  },

  transRight: {
    alignItems: "flex-end",
  },

  transValor: {
    fontSize: 13,
    fontWeight: "800",
    color: "#000",
  },

  transDataRow: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    marginTop: 4,
  },

  transData: {
    fontSize: 10,
    color: "#555",
  },

  transPago: {
    fontSize: 10,
    color: "#2E7D32",
    fontWeight: "700",
  },

  // Navegação igual à tela Home
  navegacao: {
    minHeight: 70,
    backgroundColor: ROSA,
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-around",
    paddingTop: 0,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: -2 },
  },

  botaoNav: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    minHeight: 65,
  },

  areaIndicador: {
    width: "100%",
    height: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  linhaAtiva: {
    width: "65%",
    height: 3,
    backgroundColor: "#000",
    borderRadius: 2,
  },

  conteudoNav: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },

  conteudoNavAtivo: {
    transform: [{ scale: 1.06 }],
  },

  textoNav: {
    color: TEXTO,
    fontSize: 9,
  },

  textoNavAtivo: {
    fontWeight: "900",
    fontSize: 10,
  },
  logoImg: {
    width: 300,
    height: 300,
    margin: -90
  }
});
