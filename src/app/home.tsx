
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  PanResponder,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useRouter,
  usePathname,
} from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MenuDrawer from "../components/MenuDrawer";

const ROSA = "#f7c5d8";
const FUNDO = "#F7F0EC";
const TEXTO = "#171514";
const VERDE = "#36A853";
const DESTAQUE = "#B66F81";

const LARGURA_TELA = Dimensions.get("window").width;

type IconName = React.ComponentProps<typeof Ionicons>["name"];

type AtalhoProps = {
  titulo: string;
  icone: IconName;
  destino: string;
};

type Agendamento = {
  id: string;
  cliente: string;
  servico: string;
  horario: string;
  status: string;
};

const agendamentos: Agendamento[] = [
  {
    id: "1",
    cliente: "Ana Souza",
    servico: "Alongamento",
    horario: "14:00",
    status: "Confirmado",
  },
  {
    id: "2",
    cliente: "Ana Souza",
    servico: "Manutenção",
    horario: "16:00",
    status: "Confirmado",
  },
];

function Atalho({ titulo, icone, destino }: AtalhoProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.atalho}
      activeOpacity={0.7}
      onPress={() => router.push(destino as never)}
    >
      <Ionicons name={icone} size={25} color={TEXTO} />
      <Text style={styles.atalhoTexto}>{titulo}</Text>
    </TouchableOpacity>
  );
}

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
    <TouchableOpacity
      style={styles.botaoNav}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.areaIndicador}>
        {ativo && <View style={styles.linhaAtiva} />}
      </View>

      <Animated.View
        style={[
          styles.conteudoNav,
          ativo && styles.conteudoNavAtivo,
        ]}
      >
        <Ionicons
          name={icone}
          size={ativo ? 27 : 23}
          color={TEXTO}
        />

        <Text
          style={[
            styles.textoNav,
            ativo && styles.textoNavAtivo,
          ]}
        >
          {titulo}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const [menuAberto, setMenuAberto] = useState(false);

  const inicioArraste = useRef(0);
  const gestoHorizontal = useRef(false);

  function navegar(destino: string) {
    router.push(destino as never);
  }

  function abrirAgendamento(item: Agendamento) {
    router.push({
      pathname: "/",
      params: {
        agendamentoId: item.id,
        cliente: item.cliente,
        servico: item.servico,
        horario: item.horario,
        status: item.status,
      },
    });
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,

      onMoveShouldSetPanResponder: (_, gesture) => {
        const comecaNaBorda = inicioArraste.current < 35;
        const arrastaParaDireita =
          gesture.dx > 12 &&
          Math.abs(gesture.dx) > Math.abs(gesture.dy);

        const arrastaParaEsquerda =
          menuAberto &&
          gesture.dx < -12 &&
          Math.abs(gesture.dx) > Math.abs(gesture.dy);

        return (
          (comecaNaBorda && arrastaParaDireita) ||
          arrastaParaEsquerda
        );
      },

      onPanResponderGrant: () => {
        gestoHorizontal.current = true;
      },

      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 60) {
          setMenuAberto(true);
        } else if (gesture.dx < -60) {
          setMenuAberto(false);
        }

        gestoHorizontal.current = false;
      },

      onPanResponderTerminate: () => {
        gestoHorizontal.current = false;
      },
    })
  ).current;

  const rotaAtiva =
    pathname === "/" || pathname === "/home"
      ? "home"
      : pathname.startsWith("/agenda")
        ? "agenda"
        : pathname.startsWith("/clientes")
          ? "clientes"
          : pathname.startsWith("/financeiro")
            ? "financeiro"
            : "mais";

  return (
    <View
      style={styles.container}
      onTouchStart={(event) => {
        inicioArraste.current = event.nativeEvent.pageX;
      }}
      {...panResponder.panHandlers}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={FUNDO}
      />

      <MenuDrawer
        visible={menuAberto}
        onClose={() => setMenuAberto(false)}
        rotaAtiva={rotaAtiva}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={[
          styles.conteudo,
          {
            paddingTop: Math.max(insets.top, 8) + 6,
            paddingBottom: 20,
          },
        ]}
      >
        {/* CABEÇALHO */}
        <View style={styles.cabecalho}>
          <View style={styles.perfil}>
            <TouchableOpacity
              style={styles.btnMenu}
              onPress={() => setMenuAberto(true)}
              activeOpacity={0.6}
            >
              <Ionicons
                name="menu"
                size={30}
                color={TEXTO}
              />
            </TouchableOpacity>

            <View style={styles.avatar}>
              <Ionicons
                name="person"
                size={37}
                color="#F7E5DD"
              />
            </View>

            <View style={styles.dadosPerfil}>
              <Text style={styles.bomDia}>Bom dia,</Text>
              <Text style={styles.nome}>TERESA SILVA</Text>
              <Text style={styles.profissao}>
                Nails Designer
              </Text>
              <Text style={styles.slogan}>
                Sua beleza, minha arte
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.notificacao}
            onPress={() => navegar("/notificacoes")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="notifications-outline"
              size={25}
              color={TEXTO}
            />
          </TouchableOpacity>
        </View>

        {/* RESUMO DO DIA */}
        <View style={styles.resumo}>
          <Text style={styles.resumoSaudacao}>Olá,</Text>
          <Text style={styles.resumoNome}>TERESA SILVA</Text>
          <Text style={styles.resumoProfissao}>
            Nails Designer
          </Text>

          <Text style={styles.resumoDescricao}>
            Bem-vinda de volta! Aqui está seu resumo de hoje.
          </Text>

          <View style={styles.resumoCards}>
            <TouchableOpacity
              style={styles.resumoCard}
              activeOpacity={0.8}
              onPress={() => navegar("/agenda")}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color={TEXTO}
              />
              <Text style={styles.numeroAgendamentos}>
                3 agendamentos
              </Text>
              <Text style={styles.textoCard}>hoje</Text>
              <Text style={styles.dataCard}>
                Hoje, 03 Out
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resumoCard}
              activeOpacity={0.8}
              onPress={() => navegar("/financeiro")}
            >
              <Ionicons
                name="cash-outline"
                size={20}
                color={TEXTO}
              />
              <Text style={styles.valorFinanceiro}>
                R$ 360,00
              </Text>
              <Text style={styles.textoCard}>
                + 12% vs ontem
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AÇÕES RÁPIDAS */}
        <Text style={styles.tituloSecao}>
          Ações rápidas
        </Text>

        <View style={styles.atalhosContainer}>
          <Atalho
            titulo={"Novo\nagendamento"}
            icone="add-circle-outline"
            destino="/agenda"
          />

          <Atalho
            titulo="Ver agenda"
            icone="calendar-outline"
            destino="/agenda"
          />

          <Atalho
            titulo="Clientes"
            icone="people-outline"
            destino="/clientes"
          />

          <Atalho
            titulo="Financeiro"
            icone="bar-chart-outline"
            destino="/financeiro"
          />
        </View>

        {/* AGENDAMENTOS */}
        <View style={styles.tituloAgenda}>
          <Text style={styles.tituloSecao}>
            Agendamentos de hoje
          </Text>

          <TouchableOpacity
            onPress={() => navegar("/agenda")}
            activeOpacity={0.7}
          >
            <Text style={styles.verTodos}>
              Ver todos ({agendamentos.length})
            </Text>
          </TouchableOpacity>
        </View>

        {agendamentos.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.agendamento}
            activeOpacity={0.75}
            onPress={() => abrirAgendamento(item)}
          >
            <View style={styles.iniciais}>
              <Text style={styles.letraInicial}>
                {item.cliente.charAt(0).toUpperCase()}
              </Text>
            </View>

            <View style={styles.dadosAgendamento}>
              <Text style={styles.cliente}>
                {item.cliente}
              </Text>

              <View style={styles.linhaServico}>
                <Ionicons
                  name="brush-outline"
                  size={13}
                  color={TEXTO}
                />

                <Text style={styles.servico}>
                  {item.servico} - {item.horario}
                </Text>
              </View>
            </View>

            <View style={styles.statusContainer}>
              <Ionicons
                name="checkmark-circle"
                size={15}
                color={VERDE}
              />
              <Text style={styles.status}>
                {item.status}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={19}
              color={TEXTO}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* NAVEGAÇÃO INFERIOR */}
      <View
        style={[
          styles.navegacao,
          {
            paddingBottom: Math.max(insets.bottom, 5),
          },
        ]}
      >
        <BotaoNav
          icone="home"
          titulo="Início"
          ativo={rotaAtiva === "home"}
          onPress={() => router.replace("/home")}
        />

        <BotaoNav
          icone="calendar-outline"
          titulo="Agenda"
          ativo={rotaAtiva === "agenda"}
          onPress={() => navegar("/agenda")}
        />

        <BotaoNav
          icone="people-outline"
          titulo="Clientes"
          ativo={rotaAtiva === "clientes"}
          onPress={() => navegar("/clientes")}
        />

        <BotaoNav
          icone="cash-outline"
          titulo="Financeiro"
          ativo={rotaAtiva === "financeiro"}
          onPress={() => navegar("/financeiro")}
        />

        <BotaoNav
          icone="settings-outline"
          titulo="Mais"
          ativo={rotaAtiva === "mais"}
          onPress={() => navegar("/mais")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FUNDO,
  },

  conteudo: {
    paddingHorizontal: 7,
  },

  cabecalho: {
    minHeight: 82,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
    position: "relative"
  },

  perfil: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 5,
    alignSelf: "center",
    right: -60
  },

  btnMenu: {
    width: 34,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 2,
    backgroundColor: "transparent",
    elevation: 0,
    marginBottom: 40,
    right: 55
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#292020",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E7D7CF",
  },

  dadosPerfil: {
    justifyContent: "center",
  },

  bomDia: {
    color: TEXTO,
    fontSize: 9,
    fontWeight: "600",
  },

  nome: {
    color: TEXTO,
    fontSize: 15,
    fontWeight: "900",
    marginTop: 1,
  },

  profissao: {
    color: TEXTO,
    fontSize: 10,
    marginTop: 1,
  },

  slogan: {
    color: TEXTO,
    fontSize: 9,
    marginTop: 4,
  },

  notificacao: {
    paddingHorizontal: 5,
    paddingVertical: 8,
  },

  resumo: {
    backgroundColor: ROSA,
    borderRadius: 12,
    marginHorizontal: 7,
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 13,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },

  resumoSaudacao: {
    color: TEXTO,
    fontSize: 10,
    fontWeight: "600",
  },

  resumoNome: {
    color: TEXTO,
    fontSize: 16,
    fontWeight: "900",
    lineHeight: 20,
  },

  resumoProfissao: {
    color: TEXTO,
    fontSize: 10,
  },

  resumoDescricao: {
    color: TEXTO,
    fontSize: 10,
    marginTop: 4,
    marginBottom: 9,
  },

  resumoCards: {
    flexDirection: "row",
    gap: 8,
  },

  resumoCard: {
    flex: 1,
    minHeight: 95,
    borderWidth: 1,
    borderColor: "#A9877C",
    borderRadius: 10,
    padding: 8,
  },

  numeroAgendamentos: {
    color: TEXTO,
    fontSize: 11,
    marginTop: 5,
    fontWeight: "600",
  },

  textoCard: {
    color: "#62534D",
    fontSize: 9,
    marginTop: 3,
  },

  dataCard: {
    color: "#81716B",
    fontSize: 9,
    marginTop: 8,
  },

  valorFinanceiro: {
    color: TEXTO,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 6,
  },

  tituloSecao: {
    color: TEXTO,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 11,
  },

  atalhosContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 10,
    marginBottom: 10,
  },

  atalho: {
    flex: 1,
    minHeight: 76,
    backgroundColor: ROSA,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 2,
    elevation: 2,
  },

  atalhoTexto: {
    color: TEXTO,
    fontSize: 8,
    textAlign: "center",
    marginTop: 7,
  },

  tituloAgenda: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 9,
    paddingHorizontal: 1,
    marginTop: 5,
  },

  verTodos: {
    color: "#A87928",
    fontSize: 10,
    fontWeight: "600",
  },

  agendamento: {
    minHeight: 57,
    backgroundColor: ROSA,
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    elevation: 2,
  },

  iniciais: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#D8B74C",
    alignItems: "center",
    justifyContent: "center",
  },

  letraInicial: {
    color: TEXTO,
    fontSize: 15,
    fontWeight: "900",
  },

  dadosAgendamento: {
    flex: 1,
    minWidth: 0,
  },

  cliente: {
    color: TEXTO,
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 3,
  },

  linhaServico: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  servico: {
    color: TEXTO,
    fontSize: 9,
    flexShrink: 1,
  },

  statusContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },

  status: {
    color: VERDE,
    fontSize: 8,
  },

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
});
