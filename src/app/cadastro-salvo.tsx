
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const ROSA = "#F2C5B7";
const FUNDO = "#F7F0EC";
const TEXTO = "#171514";
const COR_BOTAO = "#E88F75";
const BRANCO = "#FFFFFF";
const VERDE = "#36A853";

export default function CadastroSucesso() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  function voltarLogin() {
    router.replace("/login");
  }

  return (
    <View style={[ styles.container, { paddingTop: Math.max(insets.top, 20), paddingBottom: Math.max(insets.bottom, 20),},]}>
      <View style={styles.conteudo}>
        <Image
          source={require("../../assets/images/Teresa_Silva_logo_transparente.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.card}>
          <View style={styles.iconeContainer}>
            <View style={styles.circuloExterno}>
              <View style={styles.circuloInterno}>
                <Ionicons
                  name="checkmark"
                  size={54}
                  color={BRANCO}
                />
              </View>
            </View>

            <View style={styles.coracao}>
              <Ionicons
                name="heart"
                size={23}
                color={COR_BOTAO}
              />
            </View>
          </View>

          <Text style={styles.titulo}>
            Cadastro realizado!
          </Text>

          <Text style={styles.subtitulo}>
            Sua conta foi criada com sucesso. 💗
          </Text>

          <Text style={styles.descricao}>
            Que bom ter você no Teresa Nails!
            {"\n\n"}
            Agora você pode entrar na sua conta e
            começar a organizar seus serviços,
            clientes e agendamentos.
          </Text>

          <View style={styles.sucessoInfo}>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color={VERDE}
            />
            <Text style={styles.textoSucessoInfo}>
              Tudo pronto para começar!
            </Text>
          </View>

          <TouchableOpacity style={styles.botao} onPress={voltarLogin} activeOpacity={0.85}>
            <Text style={styles.textoBotao}>
              Voltar para o login
            </Text>
            <Ionicons name="arrow-forward" size={20} color={BRANCO}/>
          </TouchableOpacity>
        </View>

        <View style={styles.rodape}>
          <Ionicons name="heart" size={15} color={COR_BOTAO} />
          <Text style={styles.textoRodape}>
            Feito com carinho para você
          </Text>
        </View>
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
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
  },

  logo: {
    width: 300,
    height: 300,
    alignSelf: "center",
    marginBottom: -50,
  },

  card: {
    backgroundColor: BRANCO,
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 34,
    paddingBottom: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0E3DD",
    shadowColor: "#8D6254",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  iconeContainer: {
    position: "relative",
    marginBottom: 28,
  },

  circuloExterno: {
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: "#E5F5E8",
    justifyContent: "center",
    alignItems: "center",
  },

  circuloInterno: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: VERDE,
    justifyContent: "center",
    alignItems: "center",
  },

  coracao: {
    position: "absolute",
    right: -12,
    bottom: -3,
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: "#FCE8E1",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: BRANCO,
  },

  titulo: {
    fontSize: 27,
    fontWeight: "800",
    color: TEXTO,
    textAlign: "center",
    marginBottom: 12,
  },

  subtitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#B66D58",
    textAlign: "center",
    marginBottom: 18,
  },

  descricao: {
    fontSize: 14,
    lineHeight: 23,
    color: "#756A64",
    textAlign: "center",
    marginBottom: 23,
  },

  sucessoInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#F0F9F1",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 13,
    width: "100%",
    marginBottom: 24,
  },

  textoSucessoInfo: {
    fontSize: 13,
    color: "#267A3A",
    fontWeight: "600",
  },

  botao: {
    minHeight: 55,
    width: "100%",
    backgroundColor: "#DC4881",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: COR_BOTAO,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 3,
  },

  textoBotao: {
    color: BRANCO,
    fontSize: 15,
    fontWeight: "800",
  },

  rodape: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginTop: 25,
  },

  textoRodape: {
    color: "#92847D",
    fontSize: 12,
  },
});
