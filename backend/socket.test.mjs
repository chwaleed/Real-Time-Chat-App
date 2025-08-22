import { createServer } from "http";
import { io as Client } from "socket.io-client";
import { Server } from "socket.io";
import setupSocket from "./socket.js";
import mongoose from "mongoose";
import Message from "./models/messagesModel.js";
import { client as redisClient, connectRedis } from "./redis.js";
import { connectWithRetry } from "./index.js";

describe("Socket.IO Tests", () => {
  let io, serverSocket, clientSocket, httpServer;

  beforeAll(async () => {
    await connectRedis();
    await connectWithRetry();
    httpServer = createServer();
    io = new Server(httpServer);
    setupSocket(io);
    await new Promise((resolve) => {
      httpServer.listen(() => {
        const port = httpServer.address().port;
        clientSocket = new Client(`http://localhost:${port}`, {
          query: { userId: "user1" },
        });
        io.on("connection", (socket) => {
          serverSocket = socket;
        });
        clientSocket.on("connect", resolve);
      });
    });
  });

  afterAll(async () => {
    io.close();
    clientSocket.close();
    await mongoose.connection.close();
    await redisClient.quit();
  });

  test("should handle sendMessage event", async () => {
    const messageData = {
      sender: "user1",
      recipient: "user2",
      messageType: "text",
      content: "Hello, world!",
    };

    const messageCreateSpy = jest.spyOn(Message, "create").mockResolvedValue({
      ...messageData,
      _id: "message1",
      populate: jest.fn().mockReturnThis(),
    });

    const messageFindByIdSpy = jest.spyOn(Message, "findById").mockReturnValue({
      populate: jest.fn().mockResolvedValue({
        ...messageData,
        _id: "message1",
        sender: { id: "user1" },
        recipient: { id: "user2" },
      }),
    });

    await new Promise((resolve) => {
      clientSocket.emit("sendMessage", messageData);
      clientSocket.on("receiveMessage", (message) => {
        expect(message.content).toBe("Hello, world!");
        resolve();
      });
    });

    expect(messageCreateSpy).toHaveBeenCalledWith(messageData);
    expect(messageFindByIdSpy).toHaveBeenCalledWith("message1");
  });
});
