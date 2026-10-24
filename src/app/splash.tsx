
import React, { useEffect } from "react";
import { View, StyleSheet, Image, StatusBar,} from "react-native";
import { useRouter } from "expo-router";
export default function Splash() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/home"); }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <StatusBar hidden backgroundColor="#FCE7EF" />
      <Image source={require("../../assets/images/Teresa_Silva_logo_transparente.png")} style={styles.logo} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCE7EF",
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 230,
    height: 230,
    marginBottom: 12,
  },

  nome: {
    fontSize: 27,
    fontWeight: "700",
    letterSpacing: 3,
    color: "#68434F",
    textAlign: "center",
  },

  profissao: {
    fontSize: 12,
    letterSpacing: 5,
    color: "#986B79",
    marginTop: 9,
  },

  linha: {
    width: 65,
    height: 1,
    backgroundColor: "#C58A9F",
    marginTop: 22,
    marginBottom: 17,
  },

  frase: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#805966",
  },
});
