import { supabase } from "../lib/supabase";
import { router } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from "react-native";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confSenha, setConfSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCadastro() {
    if (!nome || !email || !senha) {
      Alert.alert("Erro", "Preencha nome, email e senha");
      return;
    }
    if (senha !== confSenha) {
      Alert.alert("Erro", "Senhas não conferem");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: senha,
      });
      if (error) throw error;
      if (!data.user) throw new Error("Erro ao criar usuário");

      const { error: pError } = await supabase.from("profiles").insert({
        id: data.user.id,
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        telefone: telefone.trim(),
      } as any);

      if (pError) throw pError;

      Alert.alert("Sucesso", "Conta criada! Faça login.");
      router.replace("/login");
    } catch (e: any) {
      Alert.alert("Erro", e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>
      <Text style={styles.sub}>Teresa Nails</Text>
      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Telefone" keyboardType="phone-pad" value={telefone} onChangeText={setTelefone} />
      <TextInput style={styles.input} placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} />
      <TextInput style={styles.input} placeholder="Confirmar senha" secureTextEntry value={confSenha} onChangeText={setConfSenha} />

      <TouchableOpacity style={styles.btn} onPress={handleCadastro} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTxt}>CADASTRAR</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    backgroundColor: "#fff", 
    padding: 24, 
    justifyContent: "center" 
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: "#FF4D8D", 
    textAlign: "center" 
  },
  sub: { 
    textAlign: "center", 
    color: "#888", 
    marginBottom: 24, 
    marginTop: 4 
  },
  input: { 
    backgroundColor: "#FFF0F5", 
    borderWidth: 1, 
    borderColor: "#FFD1E0", 
    borderRadius: 12, 
    padding: 14, 
    marginBottom: 12 
  },
  btn: { 
    backgroundColor: "#FF4D8D", 
    borderRadius: 12, 
    padding: 16, 
    alignItems: "center", 
    marginTop: 8 
  },
  btnTxt: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
});