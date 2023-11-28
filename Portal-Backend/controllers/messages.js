import { prisma } from "../index.js";

import { getUserFromToken, getUser, getFollows } from "./user.js";

export const getConversation = async (req, res) => {
  try {
    const user = getUserFromToken(req.headers.authorization);
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: user.id,
            receiverId: parseInt(req.params.userId),
          },
          {
            receiverId: user.id,
            senderId: parseInt(req.params.userId),
          },
        ],
      },
    });
    res.send(messages);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};
