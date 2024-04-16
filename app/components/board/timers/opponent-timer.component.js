import { StyleSheet, View, Text } from "react-native";
import { useContext, useState, useEffect } from "react";
import { SocketContext } from "../../../contexts/socket.context";

export const OpponentTimer = () => {
  const socket = useContext(SocketContext);
  const [opponentTimer, setOpponentTimer] = useState(0);

  useEffect(() => {
    socket.on("game.timer", (data) => {
      setOpponentTimer(data["opponentTimer"]);
    });
  }, []);
  return (
    <View style={styles.container}>
      <Text>Timer: {opponentTimer}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
