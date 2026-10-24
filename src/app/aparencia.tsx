
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FUNDO = "#F7F0EC";
const ROSA = "#DC4881";
const DOURADO = "#C9A86A";

type Tema = "claro" | "escuro" | "automatico";

export default function Aparencia() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [tema, setTema] = useState<Tema>("claro");

  const cores =
    tema === "escuro"
      ? {
          fundo: "#171514",
          cartao: "#262321",
          texto: "#FFFFFF",
          secundario: "#C5BDB7",
          borda: "#49413D",
        }
      : {
          fundo: FUNDO,
          cartao: "#FFFFFF",
          texto: "#171514",
          secundario: "#77706B",
          borda: "#E9DCD3",
        };

  function opcaoTema(
    valor: Tema,
    titulo: string,
    descricao: string,
    icone: keyof typeof Ionicons.glyphMap
  ) {
    const selecionado = tema === valor;

    return (
      <TouchableOpacity
        style={[
          styles.opcao,
          {
            backgroundColor: cores.cartao,
            borderColor: selecionado ? ROSA : cores.borda,
          },
        ]}
        onPress={() => setTema(valor)}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.iconeContainer,
            {
              backgroundColor: selecionado
                ? "#FCE4ED"
                : cores.fundo,
            },
          ]}
        >
          <Ionicons
            name={icone}
            size={23}
            color={selecionado ? ROSA : DOURADO}
          />
        </View>

        <View style={styles.opcaoTextoContainer}>
          <Text style={[styles.opcaoTitulo, { color: cores.texto }]}>
            {titulo}
          </Text>

          <Text
            style={[
              styles.opcaoDescricao,
              { color: cores.secundario },
            ]}
          >
            {descricao}
          </Text>
        </View>

        <Ionicons
          name={
            selecionado
              ? "radio-button-on"
              : "radio-button-off"
          }
          size={23}
          color={selecionado ? ROSA : cores.secundario}
        />
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: cores.fundo,
        },
      ]}
    >
      <StatusBar
        backgroundColor={cores.fundo}
        barStyle={tema === "escuro" ? "light-content" : "dark-content"}
      />

      {/* CABEÇALHO */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={cores.texto}
          />
        </TouchableOpacity>

        <Text style={[styles.headerTitulo, { color: cores.texto }]}>
          Aparência
        </Text>

        <View style={styles.espacoHeader} />
      </View>

      <ScrollView
        style={[
          styles.conteudo,
          {
            backgroundColor: cores.cartao,
          },
        ]}
        contentContainerStyle={[
          styles.conteudoInterno,
          { paddingBottom: Math.max(insets.bottom, 20) + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.titulo, { color: cores.texto }]}>
          Personalize seu aplicativo
        </Text>

        <Text style={[styles.subtitulo, { color: cores.secundario }]}>
          Escolha a aparência que combina com você.
        </Text>

        {/* OPÇÕES DE TEMA */}
        <Text style={[styles.secaoTitulo, { color: cores.texto }]}>
          Tema do aplicativo
        </Text>

        {opcaoTema(
          "claro",
          "Modo claro",
          "Visual claro e delicado",
          "sunny-outline"
        )}

        {opcaoTema(
          "escuro",
          "Modo escuro",
          "Mais confortável em ambientes escuros",
          "moon-outline"
        )}

        {opcaoTema(
          "automatico",
          "Automático",
          "Segue a configuração do dispositivo",
          "phone-portrait-outline"
        )}

        {/* PRÉVIA */}
        <Text style={[styles.secaoTitulo, { color: cores.texto }]}>
          Prévia
        </Text>

        <View
          style={[
            styles.preview,
            {
              backgroundColor: cores.fundo,
              borderColor: cores.borda,
            },
          ]}
        >
          <View style={styles.previewHeader}>
            <View>
              <Text style={[styles.previewPequeno, { color: cores.secundario }]}>
                TERESA SILVA
              </Text>

              <Text style={[styles.previewTitulo, { color: cores.texto }]}>
                Olá, Teresa! 🌸
              </Text>
            </View>

            <View style={styles.previewIcone}>
              <Ionicons
                name="flower-outline"
                size={25}
                color={ROSA}
              />
            </View>
          </View>

          <View
            style={[
              styles.previewCard,
              { backgroundColor: cores.cartao },
            ]}
          >
            <View style={styles.previewCirculo}>
              <Ionicons
                name="calendar-outline"
                size={23}
                color={ROSA}
              />
            </View>

            <View style={styles.previewInfo}>
              <Text style={[styles.previewCardTitulo, { color: cores.texto }]}>
                Próximo agendamento
              </Text>

              <Text style={[styles.previewCardSubtitulo, { color: cores.secundario }]}>
                Hoje às 14:00
              </Text>
            </View>
          </View>

          <View style={styles.previewBotao}>
            <Text style={styles.previewBotaoTexto}>
              Exemplo de botão
            </Text>
          </View>
        </View>

        <View style={styles.nota}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={DOURADO}
          />

          <Text style={[styles.notaTexto, { color: cores.secundario }]}>
            A prévia mostra como o tema selecionado pode ficar.
            Para aplicar a mudança em todas as telas, é necessário
            conectar esta seleção ao ThemeContext do aplicativo.
          </Text>
        </View>

        {/* VOLTAR */}
        <TouchableOpacity
          style={styles.botaoPrincipal}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.botaoPrincipalTexto}>
            Concluir
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    height: 65,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  botaoVoltar: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitulo: {
    fontSize: 20,
    fontWeight: "800",
  },

  espacoHeader: {
    width: 40,
  },

  conteudo: {
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  conteudoInterno: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },

  titulo: {
    fontSize: 23,
    fontWeight: "800",
  },

  subtitulo: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },

  secaoTitulo: {
    fontSize: 17,
    fontWeight: "800",
    marginTop: 28,
    marginBottom: 13,
  },

  opcao: {
    flexDirection: "row",
    alignItems: "center",
    padding: 13,
    borderWidth: 1.5,
    borderRadius: 14,
    marginBottom: 11,
  },

  iconeContainer: {
    width: 46,
    height: 46,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  opcaoTextoContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },

  opcaoTitulo: {
    fontSize: 15,
    fontWeight: "700",
  },

  opcaoDescricao: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 17,
  },

  preview: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 18,
  },

  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 17,
  },

  previewPequeno: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },

  previewTitulo: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 5,
  },

  previewIcone: {
    width: 45,
    height: 45,
    backgroundColor: "#FCE4ED",
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },

  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 13,
    borderRadius: 13,
    marginBottom: 13,
  },

  previewCirculo: {
    width: 42,
    height: 42,
    backgroundColor: "#FCE4ED",
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  previewInfo: {
    flex: 1,
    marginLeft: 11,
  },

  previewCardTitulo: {
    fontSize: 13,
    fontWeight: "700",
  },

  previewCardSubtitulo: {
    fontSize: 12,
    marginTop: 5,
  },

  previewBotao: {
    backgroundColor: ROSA,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  previewBotaoTexto: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  nota: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    marginTop: 20,
  },

  notaTexto: {
    flex: 1,
    fontSize: 12,
    lineHeight: 19,
  },

  botaoPrincipal: {
    height: 52,
    backgroundColor: ROSA,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },

  botaoPrincipalTexto: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
