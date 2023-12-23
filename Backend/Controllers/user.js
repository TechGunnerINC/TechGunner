import bcrypt from "bcrypt";
import crypto from "crypto";
import { validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
import { generateToken, token } from "../Middlewares/auth.js";
const p = new PrismaClient();
const newUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const Username = `@${username.toLowerCase().replaceAll(" ", "")}`;

    if (/[`!@#$%^&*()+=[\]{};':",.<>/?~]/.test(username)) {
      return res
        .status(400)
        .json({ message: "Username cannot contain special characters" });
    }

    if (!username && !email && !password) {
      return res.status(400).json({ message: "Missing user data" });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(15);
    const hash = await bcrypt.hash(password, salt);

    const user = await p.user.create({
      data: { username: Username, email, password: hash },
    });

    const token = generateToken(user);

    return res
      .status(201)
      .setHeader("Authorization", `Bearer ${token}`)
      .redirect(`profile/${Username}`);
  } catch (err) {
    console.error(err.message);
    if (err.code === "P2002" && err.meta.target.includes("username")) {
      return res
        .status(409)
        .json({ message: "Username or email already exists" });
    }

    return res.status(500).json({ message: "Something went wrong" });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username && !password) {
    return res.status(400).json({ message: "Missing username or password" });
  }

  try {
    const result = await p.user.findUnique({
      where: {
        username,
      },
      select: {
        username: true,
        password: true,
      },
    });

    if (result) {
      const user = result;

      const match = await bcrypt.compare(password, user.password);

      if (match) {
        const token = generateToken(user);

        return res
          .status(200)
          .setHeader("Authorization", `Bearer ${token}`)
          .redirect(`/profile/${user.username}`);
      } else {
        return res.status(401).json({ message: "Wrong password" });
      }
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const logout = async (req, res) => {
  try {
    return res.status(200).setHeader("Authorization", null).redirect("/");
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
const get = async (req, res) => {
  try {
    const { username } = req.params;

    const result = await p.user.findUnique({
      where: {
        username,
      },
      select: {
        username: true,
        name: true,
        pp: true,
        about: true,
        skills: true,
        followers: true,
        joined: true,
        languages: true,
        links: true,
        level: true,
        points: true,
        verified: true,
      },
      include: {
        post: true,
        blogs: true,
        videos: true,
        services: true,
        collections: true,
      },
    });

    if (result) {
      const user = result;

      return res.status(200).json({ user });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const edit = async (req, res) => {
  const { username } = req.params;
  const {
    newUsername,
    password,
    about,
    skills,
    languages,
    links,
    name,
    email,
  } = req.body;

  try {
    if (username === req.user.username) {
      const salt = await bcrypt.genSalt(15);
      const hash = await bcrypt.hash(password, salt);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const result = await p.user.update({
        where: {
          username,
        },
        data: {
          username: newUsername,
          password: hash,
          name,
          email,
          about,
          skills,
          languages,
          links,
        },
      });

      const user = result;

      const token = generateToken(user);

      return res
        .status(200)
        .setHeader("Authorization", `Bearer ${token}`)
        .json({
          message: "Profile updated successfully",
        });
    } else {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this profile" });
    }
  } catch (err) {
    console.error(err.message);
    if (err.code === "P2002" && err.meta.target.includes("username")) {
      return res.status(409).json({ message: "Username already exists" });
    }

    return res.status(500).json({ message: "Something went wrong" });
  }
};

const remove = async (req, res) => {
  const { username } = req.params;

  try {
    if (username === req.user.username) {
      const result = await p.user.delete({
        where: {
          username,
        },
      });

      if (result) {
        return res.status(200).json({ message: "User deleted successfully" });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } else {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this profile" });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
const blogs = async (req, res) => {
  try {
    const { username } = req.params;
    const blogs = await p.user.findUnique({
      where: {
        username,
      },
      include: { blogs: true },
    });
    res.status(200).json({ blogs });
  } catch (err) {
    console.error(err);
  }
};
const videos = async (req, res) => {
  try {
    const { username } = req.params;
    const videos = await p.user.findUnique({
      where: {
        username,
      },
      include: { videos: true },
    });
    res.status(200).json({ videos });
  } catch (err) {
    console.error(err);
    return res
      .status(err.code || 500)
      .json({ message: "Something went wrong" });
  }
};
const posts = async (req, res) => {
  try {
    const { username } = req.params;
    const posts = await p.user.findUnique({
      where: {
        username,
      },
      include: { posts: true },
    });
    res.status(200).json({ posts });
  } catch (err) {
    console.error(err.message);
    return res
      .status(err.code || 500)
      .json({ message: "Something went wrong" });
  }
};
const services = async (req, res) => {
  try {
    const { username } = req.params;
    const services = await p.user.findUnique({
      where: {
        username,
      },
      include: {
        services: true,
      },
    });
    res.status(200).json({ services });
  } catch (err) {
    console.error(err.message);
    return res
      .status(err.code || 500)
      .json({ message: "Something went wrong" });
  }
};
const collections = async (req, res) => {
  try {
    const { username } = req.params;
    const collections = await p.user.findUnique({
      where: {
        username,
      },
      include: {
        collections: true,
      },
    });
    res.status(200).json({ collections });
  } catch (err) {
    console.error(err.message);
    return res
      .status(err.code || 500)
      .json({ message: "Something went wrong" });
  }
};
export {
  newUser,
  login,
  get,
  edit,
  remove,
  blogs,
  videos,
  posts,
  services,
  logout,
  collections,
};
