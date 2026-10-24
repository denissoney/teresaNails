
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, usePathname } from "expo-router";
import MenuDrawer from "../components/MenuDrawer";

const ROSA = "#f7c5d8";
const FUNDO = "#FFF8F5";
const TEXTO = "#171514";
const CLIENTES = [
  {
    id: "1",
    nome: "Ana Souza",
    tel: "(82) 99883-2424",
    serv: "Alongamento em gel",
    data: "04/10/2026",
  },
  {
    id: "2",
    nome: "Ana Souza",
    tel: "(82) 99883-2424",
    serv: "Alongamento em gel",
    data: "04/10/2026",
  },
  {
    id: "3",
    nome: "Ana Souza",
    tel: "(82) 99883-2424",
    serv: "Alongamento em gel",
    data: "04/10/2026",
  },
];

export default function Clientes() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const [busca, setBusca] = useState("");
  const [menuAberto, setMenuAberto] = useState(false);
  const filtrados = CLIENTES.filter((cliente) => cliente.nome.toLowerCase().includes(busca.toLowerCase().trim()));
  function navegar(destino: string) {
    if (destino === pathname) return;
    router.push(destino as never);
  }
  return (
    <View style={[ styles.container, { paddingTop: insets.top },]}>
      <MenuDrawer visible={menuAberto} onClose={() => setMenuAberto(false)} rotaAtiva="clientes"/>

      {/* CABEÇALHO */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnMenu} onPress={() => setMenuAberto(true)} activeOpacity={0.7} accessibilityLabel="Abrir menu">
          <Ionicons name="menu" size={29} color={TEXTO} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
           <Image source={require("../../assets/images/Teresa_Silva_logo_transparente.png")} style={styles.logoImg} resizeMode="contain"/>
        </View>

        <View style={styles.ladoVazio} />
      </View>

      {/* CONTEÚDO */}
      <View style={styles.content}>
        <Text style={styles.titulo}>Clientes</Text>
        <Text style={styles.subtitulo}>
          Gerencie sua carteira de clientes
        </Text>

        {/* PESQUISA */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={TEXTO} />

          <TextInput
            style={styles.input}
            placeholder="Pesquisar cliente"
            placeholderTextColor="#888"
            value={busca}
            onChangeText={setBusca}
            autoCapitalize="words"
            returnKeyType="search"
          />

          {busca.length > 0 && (
            <TouchableOpacity
              onPress={() => setBusca("")}
              accessibilityLabel="Limpar pesquisa"
            >
              <Ionicons name="close-circle" size={18} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        {/* LISTA DE CLIENTES */}
        <ScrollView
          style={styles.lista}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listaConteudo}
          keyboardShouldPersistTaps="handled"
        >
          {filtrados.length > 0 ? (
            filtrados.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => navegar(`/clientes/${item.id}`)}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarLetra}>
                    {item.nome.charAt(0).toUpperCase()}
                  </Text>
                </View>

                <View style={styles.cardInfo}>
                  <Text style={styles.cardNome}>{item.nome}</Text>

                  <View style={styles.linha}>
                    <Ionicons
                      name="call-outline"
                      size={12}
                      color={TEXTO}
                    />
                    <Text style={styles.linhaTexto}>{item.tel}</Text>
                  </View>

                  <View style={styles.linha}>
                    <View style={styles.iconGel}>
                      <Text style={styles.iconGelTexto}>💧</Text>
                    </View>
                    <Text style={styles.linhaTexto} numberOfLines={2}>
                      Último serviço: {item.serv}
                    </Text>
                  </View>

                  <View style={styles.linha}>
                    <Ionicons
                      name="calendar-outline"
                      size={12}
                      color={TEXTO}
                    />
                    <Text style={styles.linhaTexto}>{item.data}</Text>
                  </View>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={TEXTO}
                />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.semResultados}>
              <Ionicons
                name="people-outline"
                size={36}
                color="#C9A86A"
              />
              <Text style={styles.semResultadosTitulo}>
                Nenhum cliente encontrado
              </Text>
              <Text style={styles.semResultadosTexto}>
                Tente pesquisar usando outro nome.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* NAVEGAÇÃO INFERIOR IGUAL À AGENDA */}
      <View
        style={[
          styles.tabBar,
          { paddingBottom: Math.max(insets.bottom, 5) },
        ]}
      >
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.replace("/home")}
          activeOpacity={0.7}
        >
          <Ionicons name="home-outline" size={23} color={TEXTO} />
          <Text style={styles.tabLabel}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navegar("/agenda")}
          activeOpacity={0.7}
        >
          <Ionicons name="calendar-outline" size={23} color={TEXTO} />
          <Text style={styles.tabLabel}>Agenda</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItemAtivo}
          onPress={() => router.replace("/clientes")}
          activeOpacity={0.7}
        >
          <View style={styles.indicadorAtivo} />

          <View style={styles.tabIconAtivo}>
            <Ionicons name="people" size={27} color={TEXTO} />
          </View>

          <Text style={styles.tabLabelAtivo}>Clientes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navegar("/financeiro")}
          activeOpacity={0.7}
        >
          <FontAwesome5 name="dollar-sign" size={19} color={TEXTO} />
          <Text style={styles.tabLabel}>Financeiro</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navegar("/mais")}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={23} color={TEXTO} />
          <Text style={styles.tabLabel}>Mais</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FUNDO,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 12,
    backgroundColor: FUNDO,
  },

  btnMenu: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    elevation: 0,
    marginBottom: 80
  },

  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  ladoVazio: {
    width: 38,
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: "hidden",
    paddingHorizontal: 14,
    paddingTop: 16,
  },

  titulo: {
    fontSize: 22,
    fontWeight: "800",
    color: "#000",
  },

  subtitulo: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
    marginBottom: 14,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 42,
    marginBottom: 14,
    gap: 6,
  },

  input: {
    flex: 1,
    fontSize: 13,
    color: "#000",
    paddingVertical: 0,
  },

  lista: {
    flex: 1,
  },

  listaConteudo: {
    paddingBottom: 15,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7c5d8",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F5D547",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarLetra: {
    fontWeight: "800",
    color: "#000",
    fontSize: 18,
  },

  cardInfo: {
    flex: 1,
    minWidth: 0,
    marginLeft: 12,
    marginRight: 8,
  },

  cardNome: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },

  linha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 3,
  },

  linhaTexto: {
    flex: 1,
    fontSize: 11,
    color: "#333",
  },

  iconGel: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#D6EFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  iconGelTexto: {
    fontSize: 8,
  },

  semResultados: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 35,
  },

  semResultadosTitulo: {
    fontSize: 14,
    fontWeight: "700",
    color: "#171514",
    marginTop: 12,
  },

  semResultadosTexto: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
    textAlign: "center",
  },

  // BARRA INFERIOR — MESMO PADRÃO DA AGENDA
  tabBar: {
    minHeight: 70,
    backgroundColor: ROSA,
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-around",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: -2 },
    paddingTop: 0,
  },

  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 9,
    paddingBottom: 5,
  },

  tabItemAtivo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 0,
    paddingBottom: 5,
    transform: [{ scale: 1.06 }],
  },

  indicadorAtivo: {
    width: "65%",
    height: 3,
    backgroundColor: "#000",
    borderRadius: 2,
  },

  tabIconAtivo: {
    width: 37,
    height: 37,
    alignItems: "center",
    justifyContent: "center",
  },

  tabLabel: {
    color: TEXTO,
    fontSize: 9,
    marginTop: 4,
  },

  tabLabelAtivo: {
    color: TEXTO,
    fontSize: 10,
    fontWeight: "900",
    marginTop: 3,
  },
  logoImg: {
    width: 300,
    height: 300,
    margin: -90
  }
});
