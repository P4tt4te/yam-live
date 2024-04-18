import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import io from "socket.io-client";
import Engine from "../components/engine.component";

// Replace this URL with your own socket-io host, or start the backend locally
const socketEndpoint = "http://10.60.104.103:3000";
const enableEngine = false;

export default function HomeScreen({ navigation }) {
  const [hasConnection, setConnection] = useState(false);
  const [time, setTime] = useState(null);

  useEffect(function didMount() {
    const socket = io(socketEndpoint, {
      transports: ["websocket"],
    });

    socket.io.on("open", () => setConnection(true));
    socket.io.on("close", () => setConnection(false));

    socket.on("time-msg", (data) => {
      setTime(new Date(data.time).toString());
    });

    return function didUnmount() {
      socket.disconnect();
      socket.removeAllListeners();
    };
  }, []);

  return (
    <View style={styles.container}>
      {enableEngine && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "black",
          }}
        >
          <Engine />
        </View>
      )}

      <View>
        <Button
          title="Jouer en ligne"
          onPress={() => navigation.navigate("OnlineGameScreen")}
        />
      </View>
      <View>
        <Button
          title="Jouer contre le bot"
          onPress={() => navigation.navigate("VsBotGameScreen")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
});
