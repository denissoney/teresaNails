
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Image,
  Animated,
  PanResponder,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type Props = {
  visible: boolean;
  onClose: () => void;
  onOpen?: () => void;
  rotaAtiva?: string;
};

const LARGURA_MENU = 280;
const LARGURA_TELA = Dimensions.get("window").width;

export default function MenuDrawer({
  visible,
  onClose,
  onOpen,
  rotaAtiva = "clientes",
}: Props) {
  const router = useRouter();

  const translateX = useRef(
    new Animated.Value(-LARGURA_MENU)
  ).current;

  const abertoRef = useRef(visible);
  const gestoInicialX = useRef(0);

  useEffect(() => {
    abertoRef.current = visible;

    Animated.timing(translateX, {
      toValue: visible ? 0 : -LARGURA_MENU,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [visible, translateX]);

  function abrirMenu() {
    abertoRef.current = true;
    onOpen?.();
  }

  function fecharMenu() {
    abertoRef.current = false;
    onClose();
  }

  function go(path: string) {
    fecharMenu();
    setTimeout(() => router.push(path as any), 270);
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,

      onMoveShouldSetPanResponder: (_, gesture) => {
        const horizontal =
          Math.abs(gesture.dx) > Math.abs(gesture.dy);

        if (!horizontal) return false;

        // Menu aberto: permite arrastar para a esquerda.
        if (abertoRef.current) {
          return gesture.dx < -8;
        }

        // Menu fechado: permite começar perto da borda esquerda
        // e arrastar para a direita.
        return (
          gesture.dx > 8 &&
          gestoInicialX.current < 35
        );
      },

      onPanResponderGrant: (event) => {
        gestoInicialX.current = event.nativeEvent.pageX;
      },

      onPanResponderMove: (_, gesture) => {
        const deslocamento = abertoRef.current
          ? Math.max(-LARGURA_MENU, Math.min(0, gesture.dx))
          : Math.max(
              -LARGURA_MENU,
              Math.min(0, -LARGURA_MENU + gesture.dx)
            );

        translateX.setValue(deslocamento);
      },

      onPanResponderRelease: (_, gesture) => {
        if (!abertoRef.current && gesture.dx > 80) {
          abrirMenu();
          return;
        }

        if (abertoRef.current && gesture.dx < -80) {
          fecharMenu();
          return;
        }

        Animated.spring(translateX, {
          toValue: abertoRef.current ? 0 : -LARGURA_MENU,
          useNativeDriver: true,
          bounciness: 0,
        }).start();
      },
    })
  ).current;

  const isActive = (nome: string) => rotaAtiva === nome;

  return (
    <>
      {/* Gesto para abrir o menu pela borda esquerda */}
      {!visible && (
        <View
          {...panResponder.panHandlers}
          style={styles.areaGesto}
          pointerEvents="box-only"
        />
      )}

      <Modal
        visible={visible}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={fecharMenu}
      >
        <StatusBar
          backgroundColor="transparent"
          barStyle="dark-content"
          translucent
        />

        <View style={styles.overlay}>
          <Animated.View
            style={[
              styles.drawer,
              { transform: [{ translateX }] },
            ]}
            {...panResponder.panHandlers}
          >
            {/* CABEÇALHO */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={fecharMenu}
              >
                <Ionicons name="close" size={25} color="#000" />
              </TouchableOpacity>

              <Image
                source={require("../../assets/images/Teresa_Silva_logo_transparente.png")}
                style={styles.logoImg}
                resizeMode="contain"
              />
            </View>

            {/* ITENS DO MENU */}
            <View style={styles.menu}>
              <TouchableOpacity
                style={[styles.item, isActive("home") && styles.itemAtivo]}
                onPress={() => go("/home")}
              >
                <Ionicons name="home-outline" size={22} color="#000" />
                <Text style={[styles.itemTexto, isActive("home") && styles.bold]}>
                  Home
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.item, isActive("agenda") && styles.itemAtivo]}
                onPress={() => go("/agenda")}
              >
                <Ionicons name="calendar-outline" size={22} color="#000" />
                <Text style={[styles.itemTexto, isActive("agenda") && styles.bold]}>
                  Agenda
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.item, isActive("clientes") && styles.itemAtivo]}
                onPress={() => go("/clientes")}
              >
                <Ionicons name="people-outline" size={22} color="#000" />
                <Text style={[styles.itemTexto, isActive("clientes") && styles.bold]}>
                  Clientes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.item, isActive("financeiro") && styles.itemAtivo]}
                onPress={() => go("/financeiro")}
              >
                <Ionicons name="wallet-outline" size={22} color="#000" />
                <Text style={[styles.itemTexto, isActive("financeiro") && styles.bold]}>
                  Financeiro
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.item, isActive("perfil") && styles.itemAtivo]}
                onPress={() => go("/perfil")}
              >
                <Ionicons name="person-outline" size={22} color="#000" />
                <Text style={[styles.itemTexto, isActive("perfil") && styles.bold]}>
                  Perfil
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.item, isActive("servicos") && styles.itemAtivo]}
                onPress={() => go("/servicos")}
              >
                <Text style={styles.iconTesoura}>✂️</Text>
                <Text style={[styles.itemTexto, isActive("servicos") && styles.bold]}>
                  Serviços
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.item, isActive("pagamento") && styles.itemAtivo]}
                onPress={() => go("/pagamento")}
              >
                <Ionicons name="card-outline" size={22} color="#000" />
                <Text style={[styles.itemTexto, isActive("pagamento") && styles.bold]}>
                  Pagamento
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.item, isActive("mais") && styles.itemAtivo]}
                onPress={() => go("/mais")}
              >
                <Ionicons name="settings-outline" size={22} color="#000" />
                <Text style={[styles.itemTexto, isActive("mais") && styles.bold]}>
                  Configurações
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.item}
                onPress={() => go("/sobre")}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#000"/>
                <Text style={styles.itemTexto}>Sobre</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.item, { marginTop: 12 }]}
                onPress={() => go("/")}
              >
                <Ionicons name="exit-outline" size={22} color="#FF6B4A" />
                <Text style={styles.itemSair}>Sair</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* FUNDO ESCURO: TOQUE FORA PARA FECHAR */}
          <Pressable
            style={styles.backdrop}
            onPress={fecharMenu}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  areaGesto: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 35,
    zIndex: 999,
  },

  overlay: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: LARGURA_MENU,
    backgroundColor: "#fff",
    overflow: "hidden",
    zIndex: 2,
  },

  backdrop: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
},

  header: {
    backgroundColor: "#FFF8F5",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 18,
    position: "relative",
    width: 280,
    marginBottom: 30,
  },

  closeBtn: {
    top: 12,
    right: -120,
    zIndex: 10,
    padding: 4,
  },

  logoImg: {
    width: 200,
    height: 200,
   marginBottom: -50,
   paddingTop: -20
  },

  menu: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
    paddingHorizontal: 10,
    borderTopLeftRadius: 18,
    marginTop: -8,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 12,
  },

  itemAtivo: {
    backgroundColor: "#FCE7EF",
  },

  itemTexto: {
    fontSize: 15,
    color: "#000",
    fontWeight: "400",
  },

  bold: {
    fontWeight: "700",
  },

  iconTesoura: {
    fontSize: 18,
    width: 22,
    textAlign: "center",
  },

  itemSair: {
    fontSize: 15,
    color: "#fb2727",
    fontWeight: "500",
  },
});
