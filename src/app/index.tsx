import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { supabase } from "../lib/supabase";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const [destino, setDestino] = useState<string | null>(null);

  useEffect(() => {
    async function verificar() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setDestino("/home");
      } else {
        setDestino("/splash"); // ou "/" se seu login é a rota raiz
      }
    }
    verificar();
  }, []);

  if (!destino) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F7F0EC" }}>
        <ActivityIndicator size="large" color="#DC4881" />
      </View>
    );
  }

  return <Redirect href={destino as any} />;
}