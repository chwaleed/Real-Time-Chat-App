import { Server as SocketIOServer } from "socket.io";
import Message from "./models/messagesModel.js";
import { client } from "./redis.js";

const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const disconnect = async (socket) => {
    console.log(`Client Disconnect: ${socket.id}`);
    if (socket.userId) {
      await client.hDel("userSocketMap", socket.userId);
    }
  };

  const sendMessage = async (message) => {
    const senderSocketId = await client.hGet("userSocketMap", message.sender);
    const recipientSocketId = await client.hGet(
      "userSocketMap",
      message.recipient
    );

    try {
      const createdMessage = await Message.create(message);

      const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "id email firstName lastName image color")
        .populate("recipient", "id email firstName lastName image color");

      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receiveMessage", messageData);
      }
      if (senderSocketId) {
        io.to(senderSocketId).emit("receiveMessage", messageData);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      if (senderSocketId) {
        io.to(senderSocketId).emit("sendMessageError", {
          message: "Failed to send message. Please try again.",
        });
      }
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      socket.userId = userId;
      client.hSet("userSocketMap", userId, socket.id);
      console.log(`User connected ${userId} with socket ID: ${socket.id}`);
    } else {
      console.log("User ID not provided during connection");
    }
    socket.on("sendMessage", sendMessage);
    socket.on("disconnect", () => disconnect(socket));
    socket.on("message-delivered", async ({ messageId, recipientId }) => {
      await markAsDelivered(messageId, recipientId);
    });
    socket.on("message-read", async ({ messageId, recipientId }) => {
      await markAsRead(messageId, recipientId);
    });
  });

  const markAsDelivered = async (messageId, recipientId) => {
    try {
      const message = await Message.findByIdAndUpdate(messageId, { status: "delivered" }, { new: true })
        .populate("sender", "id")
        .populate("recipient", "id");
        
      if (message) {
        // Notify the sender that their message was delivered
        const senderSocketId = await client.hGet("userSocketMap", message.sender.id);
        if (senderSocketId) {
          io.to(senderSocketId).emit("message-status-changed", {
            messageId,
            status: "delivered",
          });
        }
        
        // Also notify the recipient (for their own UI updates)
        const recipientSocketId = await client.hGet("userSocketMap", recipientId);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("message-status-changed", {
            messageId,
            status: "delivered",
          });
        }
      }
    } catch (error) {
      console.error("Error marking message as delivered:", error);
    }
  };

  const markAsRead = async (messageId, recipientId) => {
    try {
      const message = await Message.findByIdAndUpdate(messageId, { status: "read" }, { new: true })
        .populate("sender", "id")
        .populate("recipient", "id");
        
      if (message) {
        // Notify the sender that their message was read
        const senderSocketId = await client.hGet("userSocketMap", message.sender.id);
        if (senderSocketId) {
          io.to(senderSocketId).emit("message-status-changed", {
            messageId,
            status: "read",
          });
        }
        
        // Also notify the recipient (for their own UI updates)
        const recipientSocketId = await client.hGet("userSocketMap", recipientId);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("message-status-changed", {
            messageId,
            status: "read",
          });
        }
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };
};

export default setupSocket;
