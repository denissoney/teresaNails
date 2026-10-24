
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Modal, KeyboardAvoidingView, Platform, Alert,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const ROSA = "#F2C5B7";
const FUNDO = "#F7F0EC";
const COR_BOTAO = "#E88F75";

type Servico = {
  id: string;
  nome: string;
  precoMin: string;
  precoMax: string;
};

const SERVICOS_INICIAIS: Servico[] = [
  {
    id: "1",
    nome: "Alongamento",
    precoMin: "120,00",
    precoMax: "180,00",
  },
  {
    id: "2",
    nome: "Unha em gel",
    precoMin: "120,00",
    precoMax: "180,00",
  },
  {
    id: "3",
    nome: "Fibra de vidro",
    precoMin: "140,00",
    precoMax: "200,00",
  },
  {
    id: "4",
    nome: "Manutenção",
    precoMin: "80,00",
    precoMax: "110,00",
  },
];

export default function Servicos() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [servicos, setServicos] = useState<Servico[]>( SERVICOS_INICIAIS);
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [precoMin, setPrecoMin] = useState("");
  const [precoMax, setPrecoMax] = useState("");

  function abrirNovoServico() {
    setEditandoId(null);
    setNome("");
    setPrecoMin("");
    setPrecoMax("");
    setModalAberto(true);
  }

  function abrirEdicao(servico: Servico) {
    setEditandoId(servico.id);
    setNome(servico.nome);
    setPrecoMin(servico.precoMin);
    setPrecoMax(servico.precoMax);
    setModalAberto(true);
  }

  function salvarServico() {
    if (!nome.trim() || !precoMin.trim() || !precoMax.trim()) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha o nome e os dois valores do serviço."
      );
      return;
    }

    const novoServico: Servico = {
      id: editandoId ?? Date.now().toString(),
      nome: nome.trim(),
      precoMin: precoMin.trim(),
      precoMax: precoMax.trim(),
    };

    if (editandoId) {
      setServicos((atuais) =>
        atuais.map((servico) =>
          servico.id === editandoId ? novoServico : servico
        )
      );
    } else {
      setServicos((atuais) => [...atuais, novoServico]);
    }

    setModalAberto(false);
  }

  return (
    <View style={[ styles.container, { paddingTop: insets.top }, ]}>
      {/* CABEÇALHO */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnMenu} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="menu" size={22} color="#000" />
        </TouchableOpacity>
        <Image source={require("../../assets/images/Teresa_Silva_logo_transparente.png")} style={styles.logo} resizeMode="contain"/>
        <View style={styles.espacoDireita} />
      </View>

      {/* CONTEÚDO */}
      <View style={styles.content}>
        <Text style={styles.titulo}>Serviços</Text>

        <ScrollView style={styles.lista} contentContainerStyle={styles.listaConteudo} showsVerticalScrollIndicator={false}>
          {servicos.map((servico) => (
            <View key={servico.id} style={styles.card}>
              <View style={styles.infoCard}>
                <Text style={styles.nomeServico}>
                  {servico.nome}
                </Text>
                <Text style={styles.labelValor}>Valor R$</Text>
                <Text style={styles.valorServico}>
                  {servico.precoMin} - {servico.precoMax}
                </Text>
              </View>

              <TouchableOpacity style={styles.btnEditar} onPress={() => abrirEdicao(servico)} activeOpacity={0.7} accessibilityLabel={`Editar ${servico.nome}`}>
                <Ionicons name="create" size={25} color="#000"/>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* BOTÃO ADICIONAR */}
        <View style={[ styles.rodape, { paddingBottom: Math.max(insets.bottom, 16) }, ]}>
          <TouchableOpacity style={styles.btnAdicionar} onPress={abrirNovoServico} activeOpacity={0.8}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.textoAdicionar}>
              Adicionar Serviço
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MODAL PARA CADASTRAR OU EDITAR */}
      <Modal visible={modalAberto} transparent animationType="fade" onRequestClose={() => setModalAberto(false)}>
        <KeyboardAvoidingView style={styles.modalFundo} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <View style={styles.modalCard}>
            <View style={styles.modalCabecalho}>
              <Text style={styles.modalTitulo}>
                {editandoId ? "Editar serviço" : "Novo serviço"}
              </Text>

              <TouchableOpacity onPress={() => setModalAberto(false)}>
                <Ionicons name="close" size={25} color="#000" />
              </TouchableOpacity>
            </View>

            <Text style={styles.labelInput}>Nome do serviço</Text>
            <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex.: Alongamento" placeholderTextColor="#888"/>
            <Text style={styles.labelInput}>Preço mínimo (R$)</Text>
            <TextInput style={styles.input} value={precoMin} onChangeText={setPrecoMin} placeholder="Ex.: 120,00" placeholderTextColor="#888" keyboardType="decimal-pad"/>
            <Text style={styles.labelInput}>Preço máximo (R$)</Text>
            <TextInput style={styles.input} value={precoMax} onChangeText={setPrecoMax} placeholder="Ex.: 180,00" placeholderTextColor="#888" keyboardType="decimal-pad"/>
            <TouchableOpacity style={styles.btnSalvar} onPress={salvarServico} activeOpacity={0.8}>
              <Text style={styles.textoSalvar}>Salvar serviço</Text>
            </TouchableOpacity>

            {editandoId && (
              <TouchableOpacity style={styles.btnExcluir} onPress={() => {
                  Alert.alert(
                    "Excluir serviço",
                    "Deseja realmente excluir este serviço?",
                    [
                      {
                        text: "Cancelar",
                        style: "cancel",
                      },
                      {
                        text: "Excluir",
                        style: "destructive",
                        onPress: () => { setServicos((atuais) => atuais.filter((servico) => servico.id !== editandoId));
                          setModalAberto(false);
                        },
                      },
                    ]
                  );
                }}>
                <Text style={styles.textoExcluir}>
                  Excluir serviço
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FUNDO,
  },

  header: {
    height: 94,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },

  btnMenu: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    marginBottom: 70
  },

  logo: {
    width: 300,
    height: 300,
    margin: -80
  },

  espacoDireita: {
    width: 30,
  },

  content: {
    flex: 1,
    backgroundColor: FUNDO,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    paddingHorizontal: 11,
    paddingTop: 10,
  },

  titulo: {
    fontSize: 20,
    fontWeight: "800",
    color: "#000",
    textAlign: "center",
    marginBottom: 12,
  },

  lista: {
    flex: 1,
  },

  listaConteudo: {
    paddingBottom: 12,
  },

  card: {
    minHeight: 67,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7c5d8",
    borderRadius: 8,
    marginBottom: 11,
    paddingVertical: 8,
    paddingHorizontal: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },

  infoCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 20,
  },

  nomeServico: {
    fontSize: 13,
    fontWeight: "800",
    color: "#000",
    textAlign: "center",
    marginBottom: 5,
  },

  labelValor: {
    fontSize: 10,
    color: "#000",
    marginBottom: 2,
  },

  valorServico: {
    fontSize: 10,
    color: "#000",
    textAlign: "center",
  },

  btnEditar: {
    width: 34,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },

  rodape: {
    paddingTop: 10,
    paddingHorizontal: 13,
    backgroundColor: FUNDO,
  },

  btnAdicionar: {
    height: 35,
    backgroundColor: COR_BOTAO,
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  textoAdicionar: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  modalFundo: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  modalCard: {
    backgroundColor: "#FFF8F5",
    borderRadius: 16,
    padding: 20,
  },

  modalCabecalho: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  modalTitulo: {
    fontSize: 19,
    fontWeight: "800",
    color: "#000",
  },

  labelInput: {
    fontSize: 12,
    fontWeight: "700",
    color: "#000",
    marginBottom: 6,
    marginTop: 10,
  },

  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#D9B3A7",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    color: "#000",
  },

  btnSalvar: {
    height: 44,
    backgroundColor: COR_BOTAO,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },

  textoSalvar: {
    color: "#fff",
    fontWeight: "800",
  },

  btnExcluir: {
    alignItems: "center",
    padding: 12,
    marginTop: 4,
  },

  textoExcluir: {
    color: "#C62828",
    fontWeight: "700",
  },
});
