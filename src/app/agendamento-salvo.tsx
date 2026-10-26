import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";

const FUNDO = "#F7F0EC";
const DOURADO = "#C9A86A";

export default function AgendamentoSalvo() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [ultimo, setUltimo] = useState<any>(null);

  useEffect(() => {
    async function buscarUltimo() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("agendamentos")
        .select(`
          *,
          clientes:cliente_id (nome),
          servicos:servico_id (nome)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      
      if (data) setUltimo(data);
    }
    buscarUltimo();
  }, []);

  function verAgenda() {
    router.replace("/agenda");
  }

  return (
    <View style={[ styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom, },]}>

      <Image source={require("../../assets/images/Teresa_Silva_logo_transparente.png")} style={styles.logo} resizeMode="contain"/>

      <View style={styles.sucessoContainer}>
        <View style={styles.bordaExterna}>
          <View style={styles.bordaInterna}>
            <Ionicons name="checkmark" size={76} color="#FFFFFF"/>
          </View>
        </View>
      </View>

      <View style={styles.mensagemContainer}>
        <Text style={styles.titulo}>
          Agendamento salvo{"\n"}com sucesso!
        </Text>

        {ultimo && (
          <Text style={styles.detalhe}>
            {ultimo.clientes?.nome} - {ultimo.servicos?.nome}{"\n"}
            {ultimo.data} às {ultimo.hora || ultimo.horario}
          </Text>
        )}

        <Text style={styles.subtitulo}>
          Seu agendamento foi salvo com sucesso.
        </Text>
      </View>

      <TouchableOpacity style={styles.botao} onPress={verAgenda} activeOpacity={0.8}>
        <Text style={styles.textoBotao}>Ver agenda</Text>
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
    margin: -70,
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
  detalhe: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginTop: 12,
    fontWeight: "600",
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
    backgroundColor: "#DC4881",
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