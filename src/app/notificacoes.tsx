import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CORES = {
  fundo: "#F7F0EC",
  rosa: "#F2C5B7",
  rosaCard: "#F7C5D8",
  texto: "#171514",
  secundario: "#756963",
  dourado: "#C9A86A",
  branco: "#FFFFFF",
  borda: "#E9DCD5",
  verde: "#36A853",
};

type Categoria =
  | "Todas"
  | "Agendamentos"
  | "Clientes"
  | "Financeiro"
  | "Sistema";

type Notificacao = {
  id: number;
  titulo: string;
  mensagem: string;
  horario: string;
  categoria: Exclude<Categoria, "Todas">;
  icone: keyof typeof Ionicons.glyphMap;
  lida: boolean;
};

const NOTIFICACOES_INICIAIS: Notificacao[] = [
  {
    id: 1,
    titulo: "Novo agendamento",
    mensagem:
      "Ana Souza agendou um alongamento de unhas para amanhã às 14h.",
    horario: "Há 10 minutos",
    categoria: "Agendamentos",
    icone: "calendar-outline",
    lida: false,
  },
  {
    id: 2,
    titulo: "Pagamento recebido",
    mensagem:
      "O pagamento de R$ 120,00 referente ao atendimento foi registrado.",
    horario: "Há 35 minutos",
    categoria: "Financeiro",
    icone: "wallet-outline",
    lida: false,
  },
  {
    id: 3,
    titulo: "Nova cliente cadastrada",
    mensagem:
      "Mariana Oliveira foi adicionada à sua lista de clientes.",
    horario: "Hoje, 09:20",
    categoria: "Clientes",
    icone: "person-add-outline",
    lida: true,
  },
  {
    id: 4,
    titulo: "Lembrete de atendimento",
    mensagem:
      "Você tem um atendimento marcado para hoje às 16h.",
    horario: "Hoje, 08:00",
    categoria: "Agendamentos",
    icone: "alarm-outline",
    lida: true,
  },
  {
    id: 5,
    titulo: "Resumo financeiro",
    mensagem:
      "Confira os resultados e o faturamento dos seus atendimentos.",
    horario: "Ontem, 18:30",
    categoria: "Financeiro",
    icone: "bar-chart-outline",
    lida: true,
  },
  {
    id: 6,
    titulo: "Tudo atualizado!",
    mensagem:
      "Seus dados estão organizados. Continue cuidando de cada detalhe.",
    horario: "Ontem, 10:15",
    categoria: "Sistema",
    icone: "checkmark-circle-outline",
    lida: true,
  },
];

const FILTROS: Categoria[] = [
  "Todas",
  "Agendamentos",
  "Clientes",
  "Financeiro",
  "Sistema",
];

export default function RelatoriosNotificacoes() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [notificacoes, setNotificacoes] = useState(
    NOTIFICACOES_INICIAIS
  );

  const [filtro, setFiltro] = useState<Categoria>("Todas");

  const quantidadeNaoLidas = notificacoes.filter(
    (item) => !item.lida
  ).length;

  const notificacoesFiltradas = notificacoes.filter(
    (item) =>
      filtro === "Todas" || item.categoria === filtro
  );

  function marcarComoLida(id: number) {
    setNotificacoes((atuais) =>
      atuais.map((item) =>
        item.id === id ? { ...item, lida: true } : item
      )
    );
  }

  function marcarTodasComoLidas() {
    setNotificacoes((atuais) =>
      atuais.map((item) => ({ ...item, lida: true }))
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >

      {/* CABEÇALHO */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => router.back()}
          activeOpacity={0.7}
          accessibilityLabel="Voltar"
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={CORES.texto}
          />
        </TouchableOpacity>

        <View style={styles.headerTexto}>
          <Text style={styles.headerTitulo}>
            Notificações
          </Text>
          <Text style={styles.headerSubtitulo}>
            Relatórios e atualizações
          </Text>
        </View>

        <View style={styles.iconeHeader}>
          <Ionicons
            name="notifications-outline"
            size={23}
            color={CORES.dourado}
          />
          {quantidadeNaoLidas > 0 && (
            <View style={styles.pontoNotificacao} />
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.conteudo,
          { paddingBottom: insets.bottom + 28 },
        ]}
      >
        {/* RESUMO */}
        <View style={styles.cardResumo}>
          <View style={styles.resumoTopo}>
            <View style={styles.resumoIcone}>
              <Ionicons
                name="notifications"
                size={25}
                color={CORES.texto}
              />
            </View>

            <View style={styles.resumoTexto}>
              <Text style={styles.resumoTitulo}>
                Central de notificações
              </Text>
              <Text style={styles.resumoSubtitulo}>
                Acompanhe tudo o que acontece no seu salão.
              </Text>
            </View>
          </View>

          <View style={styles.resumoNumeros}>
            <View style={styles.numeroItem}>
              <Text style={styles.numeroValor}>
                {notificacoes.length}
              </Text>
              <Text style={styles.numeroLabel}>
                Total
              </Text>
            </View>

            <View style={styles.divisorVertical} />

            <View style={styles.numeroItem}>
              <Text style={styles.numeroValor}>
                {quantidadeNaoLidas}
              </Text>
              <Text style={styles.numeroLabel}>
                Não lidas
              </Text>
            </View>

            <View style={styles.divisorVertical} />

            <View style={styles.numeroItem}>
              <Text style={styles.numeroValor}>
                {notificacoes.length - quantidadeNaoLidas}
              </Text>
              <Text style={styles.numeroLabel}>
                Lidas
              </Text>
            </View>
          </View>
        </View>

        {/* TÍTULO DA LISTA */}
        <View style={styles.tituloListaContainer}>
          <View>
            <Text style={styles.tituloLista}>
              Todas as notificações
            </Text>
            <Text style={styles.subtituloLista}>
              Fique por dentro das novidades
            </Text>
          </View>

          {quantidadeNaoLidas > 0 && (
            <TouchableOpacity
              onPress={marcarTodasComoLidas}
              activeOpacity={0.7}
            >
              <Text style={styles.marcarTexto}>
                Marcar todas como lidas
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* FILTROS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtros}
        >
          {FILTROS.map((item) => {
            const ativo = filtro === item;

            return (
              <TouchableOpacity
                key={item}
                style={[
                  styles.filtroBotao,
                  ativo && styles.filtroAtivo,
                ]}
                onPress={() => setFiltro(item)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filtroTexto,
                    ativo && styles.filtroTextoAtivo,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* LISTA */}
        {notificacoesFiltradas.length > 0 ? (
          notificacoesFiltradas.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.cardNotificacao,
                !item.lida && styles.cardNaoLido,
              ]}
              onPress={() => marcarComoLida(item.id)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.iconeNotificacao,
                  !item.lida && styles.iconeNaoLido,
                ]}
              >
                <Ionicons
                  name={item.icone}
                  size={22}
                  color={CORES.texto}
                />
              </View>

              <View style={styles.notificacaoConteudo}>
                <View style={styles.notificacaoTituloLinha}>
                  <Text style={styles.notificacaoTitulo}>
                    {item.titulo}
                  </Text>

                  {!item.lida && (
                    <View style={styles.pontoNaoLido} />
                  )}
                </View>

                <Text style={styles.notificacaoMensagem}>
                  {item.mensagem}
                </Text>

                <View style={styles.notificacaoRodape}>
                  <Text style={styles.horario}>
                    {item.horario}
                  </Text>

                  <View style={styles.categoriaTag}>
                    <Text style={styles.categoriaTexto}>
                      {item.categoria}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.vazio}>
            <Ionicons
              name="notifications-off-outline"
              size={38}
              color={CORES.dourado}
            />
            <Text style={styles.vazioTitulo}>
              Nenhuma notificação
            </Text>
            <Text style={styles.vazioTexto}>
              Não há notificações nesta categoria.
            </Text>
          </View>
        )}

        {/* RODAPÉ */}
        <View style={styles.rodape}>
          <View style={styles.linhaRodape} />
          <Text style={styles.rodapeTitulo}>
            Teresa Nails
          </Text>
          <Text style={styles.rodapeSubtitulo}>
            Beleza em cada detalhe
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    gap: 12,
  },

  botaoVoltar: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: CORES.branco,
    borderWidth: 1,
    borderColor: CORES.borda,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTexto: {
    flex: 1,
  },

  headerTitulo: {
    fontSize: 19,
    fontWeight: "800",
    color: CORES.texto,
  },

  headerSubtitulo: {
    fontSize: 11,
    color: CORES.secundario,
    marginTop: 3,
  },

  iconeHeader: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: CORES.branco,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: CORES.borda,
  },

  pontoNotificacao: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    top: 8,
    right: 8,
    backgroundColor: "#DC4881",
    borderWidth: 1,
    borderColor: CORES.branco,
  },

  conteudo: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  cardResumo: {
    backgroundColor: CORES.rosaCard,
    borderRadius: 22,
    padding: 17,
    borderWidth: 1,
    borderColor: "#F0C9BE",
  },

  resumoTopo: {
    flexDirection: "row",
    alignItems: "center",
  },

  resumoIcone: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: CORES.branco,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  resumoTexto: {
    flex: 1,
  },

  resumoTitulo: {
    fontSize: 14,
    fontWeight: "800",
    color: CORES.texto,
  },

  resumoSubtitulo: {
    fontSize: 11,
    lineHeight: 16,
    color: CORES.secundario,
    marginTop: 4,
  },

  resumoNumeros: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#E9BFB8",
  },

  numeroItem: {
    flex: 1,
    alignItems: "center",
  },

  numeroValor: {
    fontSize: 22,
    fontWeight: "800",
    color: CORES.texto,
  },

  numeroLabel: {
    fontSize: 11,
    color: CORES.secundario,
    marginTop: 4,
  },

  divisorVertical: {
    width: 1,
    height: 34,
    backgroundColor: "#E9BFB8",
  },

  tituloListaContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 26,
    marginBottom: 14,
    gap: 8,
  },

  tituloLista: {
    fontSize: 16,
    fontWeight: "800",
    color: CORES.texto,
  },

  subtituloLista: {
    fontSize: 11,
    color: CORES.secundario,
    marginTop: 4,
  },

  marcarTexto: {
    fontSize: 10,
    fontWeight: "700",
    color: "#B83F70",
    textAlign: "right",
  },

  filtros: {
    gap: 8,
    paddingBottom: 14,
  },

  filtroBotao: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: CORES.branco,
    borderWidth: 1,
    borderColor: CORES.borda,
  },

  filtroAtivo: {
    backgroundColor: CORES.rosaCard,
    borderColor: CORES.rosa,
  },

  filtroTexto: {
    fontSize: 11,
    fontWeight: "600",
    color: CORES.secundario,
  },

  filtroTextoAtivo: {
    color: CORES.texto,
    fontWeight: "800",
  },

  cardNotificacao: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: CORES.branco,
    borderRadius: 18,
    padding: 13,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: CORES.borda,
  },

  cardNaoLido: {
    backgroundColor: "#FFF9F8",
    borderColor: "#EBC3D1",
  },

  iconeNotificacao: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: CORES.fundo,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  iconeNaoLido: {
    backgroundColor: CORES.rosaCard,
  },

  notificacaoConteudo: {
    flex: 1,
  },

  notificacaoTituloLinha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },

  notificacaoTitulo: {
    flex: 1,
    fontSize: 13,
    fontWeight: "800",
    color: CORES.texto,
  },

  pontoNaoLido: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#DC4881",
  },

  notificacaoMensagem: {
    fontSize: 11,
    lineHeight: 17,
    color: CORES.secundario,
    marginTop: 6,
  },

  notificacaoRodape: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 10,
  },

  horario: {
    fontSize: 10,
    color: CORES.secundario,
  },

  categoriaTag: {
    backgroundColor: CORES.fundo,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  categoriaTexto: {
    fontSize: 9,
    fontWeight: "700",
    color: CORES.secundario,
  },

  vazio: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 42,
    backgroundColor: CORES.branco,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: CORES.borda,
  },

  vazioTitulo: {
    fontSize: 15,
    fontWeight: "800",
    color: CORES.texto,
    marginTop: 12,
  },

  vazioTexto: {
    fontSize: 11,
    color: CORES.secundario,
    marginTop: 5,
  },

  rodape: {
    alignItems: "center",
    marginTop: 25,
    paddingBottom: 12,
  },

  linhaRodape: {
    width: 42,
    height: 2,
    borderRadius: 2,
    backgroundColor: CORES.dourado,
    marginBottom: 12,
  },

  rodapeTitulo: {
    fontSize: 14,
    fontWeight: "800",
    color: CORES.texto,
  },

  rodapeSubtitulo: {
    fontSize: 10,
    color: CORES.secundario,
    marginTop: 4,
  },
});
