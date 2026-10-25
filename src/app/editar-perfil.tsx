
import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const CORES = {
  fundo: "#F7F0EC",
  rosa: "#F2C5B7",
  rosaCard: "#F9D8D0",
  rosaBotao: "#E8AFA0",
  texto: "#171514",
  secundario: "#756963",
  dourado: "#C9A96E",
  branco: "#FFFFFF",
  borda: "#E9DCD5",
};

export default function EditarPerfil() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [nome, setNome] = useState("Teresa Silva");
  const [telefone, setTelefone] = useState("+55 82 98765-4321");
  const [email, setEmail] = useState("teresa.silva@gmail.com");
  const [instagram, setInstagram] = useState("@teresasilva");
  const [especialidade, setEspecialidade] = useState("Nail Designer");

  function salvarAlteracoes() {
    if (
      !nome.trim() ||
      !telefone.trim() ||
      !email.trim() ||
      !especialidade.trim()
    ) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha seu nome, telefone, e-mail e especialidade."
      );
      return;
    }

    // Navega para a tela de sucesso após validar os campos.
    router.replace("/");
  }

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 28 },
          ]}
        >
          {/* CABEÇALHO */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.btnBack}
              onPress={() => router.back()}
              activeOpacity={0.7}
              accessibilityLabel="Voltar"
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color={CORES.texto}
              />
            </TouchableOpacity>

            <Text style={styles.titulo}>Editar perfil</Text>

            <View style={styles.headerEspaco} />
          </View>

          {/* IDENTIDADE VISUAL */}
          <View style={styles.intro}>
            <View style={styles.linhaDecorativa} />
            <Text style={styles.subtitulo}>
              SEU ESPAÇO, SUA IDENTIDADE
            </Text>
            <Text style={styles.descricao}>
              Mantenha suas informações sempre atualizadas.
            </Text>
          </View>

          {/* FOTO DO PERFIL */}
          <View style={styles.fotoWrapper}>
            <View style={styles.fotoBorda}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400",
                }}
                style={styles.foto}
              />
            </View>

            <TouchableOpacity
              style={styles.btnEditarFoto}
              activeOpacity={0.7}
              onPress={() =>
                Alert.alert(
                  "Foto do perfil",
                  "A seleção de uma nova foto será implementada aqui."
                )
              }
            >
              <Ionicons
                name="camera-outline"
                size={16}
                color={CORES.texto}
              />
              <Text style={styles.btnEditarFotoText}>
                Editar foto
              </Text>
            </TouchableOpacity>
          </View>

          {/* FORMULÁRIO */}
          <View style={styles.formCard}>
            <View style={styles.formTituloWrapper}>
              <View style={styles.iconeFormulario}>
                <Ionicons
                  name="person-outline"
                  size={21}
                  color={CORES.dourado}
                />
              </View>

              <View>
                <Text style={styles.formTitulo}>
                  Dados pessoais
                </Text>
                <Text style={styles.formSubtitulo}>
                  Informações profissionais
                </Text>
              </View>
            </View>

            {/* NOME */}
            <Text style={styles.label}>Nome completo</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={19}
                color={CORES.secundario}
              />
              <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
                placeholder="Seu nome completo"
                placeholderTextColor="#9A8D86"
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            {/* TELEFONE */}
            <Text style={styles.label}>Telefone</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="call-outline"
                size={19}
                color={CORES.secundario}
              />
              <TextInput
                style={styles.input}
                value={telefone}
                onChangeText={setTelefone}
                placeholder="+55 82 98765-4321"
                placeholderTextColor="#9A8D86"
                keyboardType="phone-pad"
                returnKeyType="next"
              />
            </View>

            {/* E-MAIL */}
            <Text style={styles.label}>E-mail</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={19}
                color={CORES.secundario}
              />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="seuemail@exemplo.com"
                placeholderTextColor="#9A8D86"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>

            {/* INSTAGRAM */}
            <Text style={styles.label}>Instagram</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="logo-instagram"
                size={19}
                color={CORES.secundario}
              />
              <TextInput
                style={styles.input}
                value={instagram}
                onChangeText={setInstagram}
                placeholder="@seuusuario"
                placeholderTextColor="#9A8D86"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>

            {/* ESPECIALIDADE */}
            <Text style={styles.label}>Especialidade</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="sparkles-outline"
                size={19}
                color={CORES.secundario}
              />
              <TextInput
                style={styles.input}
                value={especialidade}
                onChangeText={setEspecialidade}
                placeholder="Sua especialidade"
                placeholderTextColor="#9A8D86"
                returnKeyType="done"
              />
            </View>

            {/* BOTÃO SALVAR */}
            <TouchableOpacity style={styles.btnSalvar} activeOpacity={0.8} onPress={() => router.push("/perfil-salvo")}>
              <Ionicons name="checkmark-circle-outline" size={21} color={CORES.branco}/>
              <Text style={styles.btnSalvarText}>
                Salvar alterações
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnCancelar} activeOpacity={0.7} onPress={() => router.back()}>
              <Text style={styles.btnCancelarText}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>

          {/* RODAPÉ */}
          <View style={styles.rodape}>
            <View style={styles.linhaRodape} />
            <Text style={styles.rodapeNome}>
              Teresa Nails
            </Text>
            <Text style={styles.rodapeTexto}>
              Beleza em cada detalhe
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },

  keyboard: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 28,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 10,
  },

  btnBack: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  titulo: {
    fontSize: 17,
    fontWeight: "800",
    color: CORES.texto,
  },

  headerEspaco: {
    width: 42,
  },

  intro: {
    alignItems: "center",
    marginTop: 12,
    paddingHorizontal: 20,
  },

  linhaDecorativa: {
    width: 42,
    height: 3,
    borderRadius: 2,
    backgroundColor: CORES.dourado,
    marginBottom: 12,
  },

  subtitulo: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: CORES.dourado,
  },

  descricao: {
    fontSize: 12,
    color: CORES.secundario,
    marginTop: 7,
    textAlign: "center",
  },

  fotoWrapper: {
    alignItems: "center",
    marginTop: 22,
  },

  fotoBorda: {
    width: 104,
    height: 104,
    borderRadius: 52,
    padding: 4,
    borderWidth: 2,
    borderColor: CORES.dourado,
    backgroundColor: CORES.branco,
  },

  foto: {
    width: "100%",
    height: "100%",
    borderRadius: 48,
    backgroundColor: CORES.rosa,
  },

  btnEditarFoto: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#f7c5d8",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#F0C9BE",
  },

  btnEditarFotoText: {
    fontSize: 12,
    fontWeight: "700",
    color: CORES.texto,
  },

  formCard: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 17,
    backgroundColor: CORES.branco,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: CORES.borda,
  },

  formTituloWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  iconeFormulario: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#f7c5d8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  formTitulo: {
    fontSize: 15,
    fontWeight: "800",
    color: CORES.texto,
  },

  formSubtitulo: {
    fontSize: 11,
    color: CORES.secundario,
    marginTop: 3,
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    color: CORES.texto,
    marginTop: 14,
    marginBottom: 7,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 49,
    backgroundColor: "#f7c5d8",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: CORES.borda,
    paddingHorizontal: 13,
  },

  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 13,
    color: CORES.texto,
  },

  btnSalvar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    backgroundColor: "#dc4881",
    borderRadius: 14,
    paddingVertical: 15,
    marginTop: 28,
  },

  btnSalvarText: {
    color: CORES.branco,
    fontSize: 14,
    fontWeight: "800",
  },

  btnCancelar: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    marginTop: 4,
  },

  btnCancelarText: {
    color: CORES.secundario,
    fontSize: 13,
    fontWeight: "700",
  },

  rodape: {
    alignItems: "center",
    marginTop: 26,
    paddingBottom: 12,
  },

  linhaRodape: {
    width: 38,
    height: 2,
    borderRadius: 2,
    backgroundColor: CORES.dourado,
    marginBottom: 10,
  },

  rodapeNome: {
    fontSize: 14,
    fontWeight: "800",
    color: CORES.texto,
  },

  rodapeTexto: {
    fontSize: 10,
    color: CORES.secundario,
    marginTop: 4,
  },
});
