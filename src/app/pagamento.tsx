
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Share,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const FUNDO = "#F7F0EC";
const DOURADO = "#C9A86A";
const ROSA = "#DC4881";
const TEXTO = "#171514";
const BRANCO = "#FFFFFF";

export default function FormasPagamento() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [pix, setPix] = useState("");

  async function compartilhar() {
    const chavePix = pix.trim();

    if (!chavePix) {
      Alert.alert(
        "Chave Pix não informada",
        "Digite sua chave Pix antes de compartilhar."
      );
      return;
    }

    try {
      const mensagem =
        "🌸 Teresa Silva | Nails Designer\n\n" +
        "Minha chave Pix para pagamento:\n" +
        chavePix +
        "\n\nObrigada pela preferência! 💗";

      await Share.share(
        {
          title: "Chave Pix - Teresa Silva",
          message: mensagem,
        },
        {
          dialogTitle: "Compartilhar chave Pix",
        }
      );
    } catch (error) {
      Alert.alert(
        "Não foi possível compartilhar",
        "Ocorreu um erro ao abrir o menu de compartilhamento. Tente novamente."
      );
    }
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
      <StatusBar
        backgroundColor={FUNDO}
        barStyle="dark-content"
      />

      {/* CABEÇALHO */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.btnBack}
          onPress={() => router.back()}
          activeOpacity={0.7}
          accessibilityLabel="Voltar para a tela anterior"
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={TEXTO}
          />
        </TouchableOpacity>

        <Image
          source={require("../../assets/images/Teresa_Silva_logo_transparente.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.espacoHeader} />
      </View>

      {/* CONTEÚDO */}
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={[
            styles.contentContainer,
            {
              paddingBottom: Math.max(insets.bottom, 20) + 20,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.tituloContainer}>
            <Text style={styles.titulo}>
              Formas de Pagamento
            </Text>

            <View style={styles.linhaDourada} />

            <Text style={styles.descricao}>
              Consulte e compartilhe sua chave Pix.
            </Text>
          </View>

          {/* CARTÃO PIX */}
          <View style={styles.cardPix}>
            <View style={styles.iconePixContainer}>
              <Ionicons
                name="qr-code-outline"
                size={30}
                color={DOURADO}
              />
            </View>

            <Text style={styles.cardTitulo}>
              Pagamento via Pix
            </Text>

            <Text style={styles.cardDescricao}>
              Informe sua chave Pix para facilitar os pagamentos
              das suas clientes.
            </Text>

            <Text style={styles.label}>
              Sua chave Pix
            </Text>

            <View style={styles.inputBox}>
              <Ionicons
                name="key-outline"
                size={20}
                color={DOURADO}
              />

              <TextInput
                style={styles.input}
                placeholder="Digite sua chave Pix"
                placeholderTextColor="#968D87"
                value={pix}
                onChangeText={setPix}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="default"
                returnKeyType="done"
                accessibilityLabel="Sua chave Pix"
              />

              {pix.length > 0 && (
                <TouchableOpacity
                  onPress={() => setPix("")}
                  accessibilityLabel="Limpar chave Pix"
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color="#968D87"
                  />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.btnCompartilhar}
              onPress={compartilhar}
              activeOpacity={0.8}
            >
              <Ionicons
                name="share-social-outline"
                size={21}
                color={BRANCO}
              />

              <Text style={styles.compartilharTexto}>
                Compartilhar chave Pix
              </Text>
            </TouchableOpacity>

            <View style={styles.aviso}>
              <Ionicons
                name="information-circle-outline"
                size={19}
                color={DOURADO}
              />

              <Text style={styles.avisoTexto}>
                Confira se a chave está correta antes de compartilhar.
              </Text>
            </View>
          </View>

          {/* BOTÃO VOLTAR */}
          <TouchableOpacity
            style={styles.btnVoltar}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons
              name="arrow-back"
              size={19}
              color={ROSA}
            />

            <Text style={styles.btnVoltarTexto}>
              Voltar
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FUNDO,
  },

  header: {
    height: 65,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: FUNDO,
    margin: 35
  },

  btnBack: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    right: 50,
    marginBottom: 70
  },

  logo: {
    width: 400,
    height: 300,
    margin: -70,
    right: 20
  },

  espacoHeader: {
    width: 40,
  },

  keyboardContainer: {
    flex: 1,
  },

  content: {
    flex: 1,
    backgroundColor: BRANCO,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
  },

  tituloContainer: {
    marginBottom: 26,
  },

  titulo: {
    fontSize: 23,
    fontWeight: "800",
    color: TEXTO,
  },

  linhaDourada: {
    width: 55,
    height: 3,
    backgroundColor: DOURADO,
    borderRadius: 5,
    marginTop: 10,
  },

  descricao: {
    fontSize: 14,
    color: "#77706B",
    marginTop: 12,
    lineHeight: 21,
  },

  cardPix: {
    backgroundColor: "#fddae7",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E9DCD3",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  iconePixContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: BRANCO,
    borderWidth: 1,
    borderColor: "#E9DCD3",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 14,
  },

  cardTitulo: {
    fontSize: 19,
    fontWeight: "800",
    color: TEXTO,
    textAlign: "center",
  },

  cardDescricao: {
    fontSize: 13,
    color: "#77706B",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 23,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: TEXTO,
    marginBottom: 9,
  },

  inputBox: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: DOURADO,
    borderRadius: 12,
    backgroundColor: BRANCO,
    paddingHorizontal: 13,
  },

  input: {
    flex: 1,
    minHeight: 50,
    fontSize: 14,
    color: TEXTO,
    paddingVertical: 8,
  },

  btnCompartilhar: {
    minHeight: 52,
    backgroundColor: ROSA,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 18,
    paddingHorizontal: 12,
    elevation: 2,
  },

  compartilharTexto: {
    color: BRANCO,
    fontSize: 15,
    fontWeight: "700",
  },

  aviso: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 18,
  },

  avisoTexto: {
    flex: 1,
    fontSize: 12,
    color: "#77706B",
    lineHeight: 18,
  },

  btnVoltar: {
    minHeight: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: ROSA,
    backgroundColor: BRANCO,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 25,
  },

  btnVoltarTexto: {
    fontSize: 15,
    fontWeight: "700",
    color: ROSA,
  },
});
