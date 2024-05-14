import { useEffect, useState, useContext } from "react";
import { Modal, StyleSheet, View, Pressable, Text } from "react-native";
import { SocketContext } from "@/app/contexts/socket.context";

interface ResultProps {
  returnToMainMenu: () => void;
}

const Result = ({ returnToMainMenu }: ResultProps) => {
  const socket = useContext(SocketContext);
  const [isVisible, setIsVisible] = useState(false);
  const [isWinner, setIsWinner] = useState(false);

  useEffect(() => {
    socket.on("game.end", (data) => {
      setIsVisible(true);
      setIsWinner(data);
    });
  }, []);

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Fin de partie</Text>
          <Text style={styles.modalText}>
            {isWinner ? "Vous avez gagné" : "Vous avez perdu"}
          </Text>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={returnToMainMenu}
          >
            <Text style={styles.textStyle}>Retourner au menu</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default Result;
