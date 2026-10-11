import { View, Image, Text, StyleSheet } from "react-native";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require("../../assets/images/Teresa_Silva_logo_transparente.png")} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF6F0",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 500,
    height: 500,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    letterSpacing: 3,
    color: "#8B7355",
    fontWeight: "300",
    fontFamily: "serif",
  },
  subtitle: {
    fontSize: 12,
    letterSpacing: 4,
    color: "#C9A96E",
    marginTop: 6,
    textTransform: "uppercase",
  }
});