
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import MenuDrawer from "../components/MenuDrawer";

const ROSA = "#f7c5d8";
const ROSA_CLARO = "#FFD9C7";
const FUNDO = "#F7F0EC";
const TEXTO = "#171514";

type IconName = React.ComponentProps<typeof Ionicons>["name"];
type BotaoNavProps = { icone: IconName; titulo: string; ativo: boolean; onPress: () => void;};

function BotaoNav({ icone, titulo, ativo, onPress,}: BotaoNavProps) {
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
export default function Mais() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);

  function navegar(destino: string) {
    router.push(destino as never);
  }

  return (
    <View style={[ styles.container, { paddingTop: insets.top }, ]}>
      <MenuDrawer visible={menuAberto} onClose={() => setMenuAberto(false)} rotaAtiva="mais"/>

      {/* CABEÇALHO COM VOLTAR, LOGO E MENU */}
      <View style={styles.headerTop}>
        <TouchableOpacity style={styles.btnBack} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color="#000"/>
        </TouchableOpacity>
        <Image source={require("../../assets/images/Teresa_Silva_logo_transparente.png")} style={styles.logoImg} resizeMode="contain"/>
        <TouchableOpacity style={styles.btnMenu} onPress={() => setMenuAberto(true)} activeOpacity={0.7}>
          <Ionicons name="menu" size={26} color="#000" />
        </TouchableOpacity>
      </View>

      {/* CONTEÚDO DA TELA */}
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.titulo}>Configurações</Text>
          <Text style={styles.subtitulo}>
            Gerencie seu app
          </Text>
          {/* CARD DO PERFIL */}
          <TouchableOpacity style={styles.cardPerfil} activeOpacity={0.8} onPress={() => navegar("/perfil")}>
            <View style={styles.perfilIcon}>
            < Image source={require("@/assets/images/logo-redonda.png")} style={styles.lgredonda} resizeMode= "contain" />
            </View>

            <View style={styles.perfilInfo}>
              <Text style={styles.perfilNome}>
                Teresa Silva
              </Text>

              <Text style={styles.perfilSub}>
                Nail Designer - Premium
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color="#000"/>
          </TouchableOpacity>

          {/* SEÇÃO GERAL */}
          <Text style={styles.secaoLabel}>Geral</Text>

          <View style={styles.box}>
            <TouchableOpacity style={styles.item} onPress={() => navegar("/servicos")} activeOpacity={0.7}>
              <Text style={styles.emoji}>✂️</Text>

              <Text style={styles.itemTexto}>
                Serviços e preços
              </Text>

              <Ionicons name="chevron-forward" size={16} color="#000" style={styles.chevron}/>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.item} onPress={() => navegar("/horario")} activeOpacity={0.7}>
              <Ionicons name="time-outline" size={18} color="#000"/>
              <Text style={styles.itemTexto}>
                Horário de funcionamento
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#000" style={styles.chevron}/>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.item} onPress={() => navegar("/pagamento")} activeOpacity={0.7}>
              <Ionicons name="card-outline" size={18} color="#000"/>
              <Text style={styles.itemTexto}>
                Forma de pagamento
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#000" style={styles.chevron}/>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.item} onPress={() => navegar("/aparencia")} activeOpacity={0.7}>
              <Ionicons name="color-palette-outline" size={18} color="#000"/>
              <Text style={styles.itemTexto}>
                Aparência
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#000" style={styles.chevron}/>
            </TouchableOpacity>
          </View>

          {/* SEÇÃO SOBRE */}
          <Text style={styles.secaoLabel}>Sobre</Text>
          <View style={styles.box}>
            <TouchableOpacity style={styles.item} onPress={() => navegar("/sobre")} activeOpacity={0.7}>
              <Ionicons name="help-circle-outline" size={18} color="#000"/>
              <Text style={styles.itemTexto}>
                Sobre o app
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#000" style={styles.chevron}/>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      {/* BARRA DE NAVEGAÇÃO */}
      <View style={[ styles.navegacao, { paddingBottom: Math.max(insets.bottom, 5), },]}>
        <BotaoNav icone="home" titulo="Início" ativo={false} onPress={() => router.replace("/home")}/>
        <BotaoNav icone="calendar-outline" titulo="Agenda" ativo={false} onPress={() => navegar("/agenda")}/>
        <BotaoNav icone="people-outline" titulo="Clientes" ativo={false} onPress={() => navegar("/clientes")}/>
        <BotaoNav icone="cash-outline" titulo="Financeiro" ativo={false} onPress={() => navegar("/financeiro")}/>
        <BotaoNav icone="settings-outline" titulo="Mais" ativo={true} onPress={() => router.replace("/mais")}/>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FUNDO,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 10,
    backgroundColor: FUNDO,
  },

  btnBack: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 60
  },

  btnMenu: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    marginBottom: 60
  },

  logoImg: {
    width: 200,
    height: 200,
    margin: -50
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

  scrollContent: {
    paddingBottom: 20,
  },

  titulo: {
    fontSize: 20,
    fontWeight: "800",
    color: "#000",
    textAlign: "center",
  },

  subtitulo: {
    fontSize: 11,
    color: "#C9A86A",
    textAlign: "center",
    marginTop: 2,
    marginBottom: 16,
  },

  cardPerfil: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7c5d8",
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#0001",
  },

  perfilIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: "#C9A86A",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  perfilLetra: {
    fontSize: 20,
    fontFamily: "serif",
  },

  perfilInfo: {
    flex: 1,
    marginLeft: 12,
  },

  perfilNome: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
  },

  perfilSub: {
    fontSize: 11,
    color: "#555",
    marginTop: 2,
  },

  secaoLabel: {
    fontSize: 11,
    color: "#C9A86A",
    marginBottom: 6,
    marginTop: 4,
  },

  box: {
    backgroundColor: "#f7c5d8",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 2,
    marginBottom: 18,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 10,
  },

  emoji: {
    fontSize: 16,
    width: 18,
    textAlign: "center",
  },

  itemTexto: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    color: "#000",
  },

  chevron: {
    marginLeft: "auto",
  },

  divider: {
    height: 1,
    backgroundColor: "#000",
    opacity: 0.12,
  },

  // BARRA INFERIOR 
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
    shadowOffset: {
      width: 0,
      height: -2,
    },
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
  lgredonda: {
    width: 30,
  }
});
