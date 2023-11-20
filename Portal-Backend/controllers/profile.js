import { prisma } from "../index.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getUserFromToken } from "./user.js";
import { s3Client } from "../index.js";

export const myProfile = async (req, res) => {
  try {
    const tokenUser = getUserFromToken(req.headers.authorization);
    const user = await getUser(tokenUser.id);
    res.send(user);
  } catch (err) {
    res.send(err);
  }
};

export const getOtherProfileFromId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const profile = await prisma.profile.findFirst({
      where: { userId: parseInt(userId) },
      include: {
        user: {
          select: {
            profilePicture: true,
          },
        },
      },
    });
    res.send(profile);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

export const uploadProfilePicture = async (req, res) => {
  try {
    const user = getUserFromToken(req.headers.authorization);
    const image = req.files.profilePicture;

    if (image !== null) {
      const imageBuffer = Buffer.from(await image.data);
      const fileExtension = "jpg"; // Change this to match the actual file extension

      const commandParams = {
        Key: `profilePictures/${user.id}.${fileExtension}`, // Unique key for the image
        Bucket: "portal-437",
        Body: imageBuffer,
        Metadata: {
          "Cache-Control": "max-age=60",
        },
      };
      const s3Response = await s3Client.send(
        new PutObjectCommand(commandParams)
      );
      const imageUrl = `${process.env.S3_DOMAIN}/profilePictures/${user.id}.${fileExtension}`;
      await prisma.user.update({
        where: { id: user.id },
        data: { profilePicture: imageUrl },
      });

      console.log("Profile picture uploaded successfully");
      res.send("Success");
    }
  } catch (err) {
    console.log(err);
  }
};

export const getProfilePicture = async (req, res) => {
  try {
    const user = getUserFromToken(req.headers.authorization);
    const userId = user.id;
    const profilePicture = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        profilePicture: true,
      },
    });
    res.send(profilePicture);
  } catch (e) {
    res.send(e);
  }
};

export const getOtherProfilePictureFromId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const profilePicture = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
      select: {
        profilePicture: true,
      },
    });
    res.send(profilePicture);
  } catch (e) {
    throw e;
  }
};

export const setProfileInformation = async (req, res) => {
  try {
    const tokenUser = getUserFromToken(req.headers.authorization);
    const user = await getUser(tokenUser.id);

    const profileAlreadyExists = await prisma.profile.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (profileAlreadyExists) {
      try {
        await prisma.profile.update({
          where: {
            userId: user.id,
          },
          data: {
            name: req.body.name,
            location: req.body.location,
            occupation: req.body.occupation,
            bio: req.body.bio,
          },
        });
        res.send("Success");
      } catch (err) {
        throw err;
      }
    } else {
      const newProfile = await prisma.profile.create({
        data: {
          user: {
            connect: { id: user.id },
          },
          name: req.body.name,
          location: req.body.location,
          occupation: req.body.occupation,
          bio: req.body.bio,
        },
      });
      res.send(newProfile);
    }
  } catch (err) {
    res.send(err);
  }
};

export const getProfileInformation = async (req, res) => {
  try {
    const tokenUser = getUserFromToken(req.headers.authorization);
    const user = await getUser(tokenUser.id);
    const profile = await prisma.profile.findFirst({
      where: {
        userId: user.id,
      },
    });

    // //send whether they follow in this
    // const follows = await getFollows(user, profile.userId);
    // profile["follows"] = follows ? true : false;

    res.send(profile);
  } catch (err) {
    res.send(err);
  }
};
