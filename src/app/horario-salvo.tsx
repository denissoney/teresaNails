
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FUNDO = "#F7F0EC";
const DOURADO = "#C9A86A";
const COR_BOTAO = "#E88F75";
export default function HorariosSalvos() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  function verHorarios() {
    router.replace("/agenda");
  }

  return (
    <View style={[ styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom, },]}>
      <StatusBar backgroundColor={FUNDO} barStyle="dark-content"/>

      {/* LOGO */}
      <Image source={require("../../assets/images/Teresa_Silva_logo_transparente.png")} style={styles.logo} resizeMode="contain"/>

      {/* ÍCONE DE SUCESSO */}
      <View style={styles.sucessoContainer}>
        <View style={styles.bordaExterna}>
          <View style={styles.bordaInterna}>
            <Ionicons name="checkmark" size={76} color="#FFFFFF" strokeWidth={4}/>
          </View>
        </View>
      </View>

      {/* MENSAGEM */}
      <View style={styles.mensagemContainer}>
        <Text style={styles.titulo}>
          Horários salvos{"\n"}com sucesso!
        </Text>

        <Text style={styles.subtitulo}>
          Seus horários foram salvos.
        </Text>
      </View>

      {/* BOTÃO */}
      <TouchableOpacity style={styles.botao} onPress={verHorarios} activeOpacity={0.8}>
        <Text style={styles.textoBotao}>
          Ver horários
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FUNDO,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
  },

  logo: {
    width: 400,
    height: 300,
    margin: -70
  },

  sucessoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },

  bordaExterna: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: DOURADO,
    alignItems: "center",
    justifyContent: "center",
  },

  bordaInterna: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: DOURADO,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  mensagemContainer: {
    alignItems: "center",
    marginBottom: 38,
  },

  titulo: {
    fontSize: 25,
    fontWeight: "800",
    color: "#000000",
    textAlign: "center",
    lineHeight: 31,
  },

  subtitulo: {
    fontSize: 12,
    color: DOURADO,
    textAlign: "center",
    marginTop: 18,
  },

  botao: {
    width: "100%",
    height: 53,
    backgroundColor: "#dc4881",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },

  textoBotao: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
