import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../Middlewares/auth.js";
import Str from "@supercharge/strings";

const p = new PrismaClient();

const options = {
	secure: true,
	httpOnly: true,
	domain: ".localhost:5173"
};
const newUser = async (req, res) => {
	try {
		const { username, email, password, name } = req.body;

		const User = `@${Str(username).pascal().replaceAll(" ", "").get()}`;
		const mail = email.toLowerCase().replace(" ", "");

		if (
			/[`~!@#$%^&*()-_=+[\]{}|;:',.<>/?€£¥©®™÷×§¶°¨≠∞µαβγδεζηθικλμνξÄÅÉæÆôöòûùよかとカく➾⟁⟂⟃⟄⟅⟆⟇⟈⟉⟊⟋⟌⟍⟎⟏⟐⟑⟒⟓⟔⟕⟖⟗⟘⟙⟚⟛⟜⟝⟞⟟⟠⟡⟢⟣⟤⟥⟦⟧⟨⟩⟪⟫⟬⟭⟮⟯⟰⟱⟲⟳⟴⟵⟶⟷⟸⟹⟺⟻⟼⟽⟾⟿ÿÖÜø£ß¢₩₱°²³ªº¿⌐¬½¼¡«»┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌αßΓπΣστΦΘδφε∩≡±≥≤⌠⌡≈·√ⁿ²ⱭⱮⱯⱰⱱⱲⱳⱴⱵⱶⱷⱸⱹⱺⱻⱼⱽⱾⱿⲀⲁⲂⲃⲄⲅⲆⲇⲈⲉⲊⲋⲌⲍⲎⲏⲐⲑⲒⲓⲗⲘⲜⲝⲞⲟⲠⲡⲢⲣⲤⲥⲦⲧⲨⲩⲪⲫⲬⲭⲮⲯⲲⲳⲴⲵⲶⲷⲸⲹⲺⲻⲼⲽⲾⲿⳀⳁⳄⳅⳆⳇⳈⳉⳊⳋⳌⳍⳎⳏⳐⳑⳒⳓⳔⳕⳖⳗⳘⳙⳚⳛⳜⳝⳞⳟⳠⳡⳢⳣⳤ⳥⳦⳧⳨⳩⳪ⳫⳬⳭⳮ⳯🜀🜁🜂🜃🜄🜅🜆🜇🜈🜉🜊🜋🜌🜍🜎🜏🜐🜑🜒🜓🜔🜕🜖🜗🜘🜙🜚🜛🜜🜝🜞🜟🜠🜡🜢🜣🜤🜥🜦🜧🜨🜩🜪🜫🜬🜭🜮🜯🜰🜱🜲🜳🜴🜵🜶🜷🜸🜹🜺🜻🜼🜽🜾🜿🝀🝁🝂🝃🝄🝅🝆🝇🝈🝉🝊🝋🝌🝍🝎🝏🝐🝑🝒🝓🝔🝕🝖🝗🝘🝙🝚🝛🝜🝝🝞🝟🝠🝡🝢🝣🝤🝥🝦🝧🝨🝩🝪🝫🝬🝭🝮🝯🝰🝱🝲🝳]/.test(
				username
			)
		) {
			return res.status(400).json({
				message: "Username cannot contain special characters except for under_scores and hyphens -."
			});
		}

		if (!username || !email || !password) {
			return res.status(400).json({ message: "Username Password and E-mail are required" });
		}

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const salt = await bcrypt.genSalt(15);
		const hash = await bcrypt.hash(password, salt);

		const user = await p.user.create({
			data: { username: User, email: mail, password: hash, name }
		});

		const token = generateToken(user);

		return res.status(201).cookie("Token", token, options).json({ user, token });
	} catch (err) {
		console.error(err);
		if (
			(err.code === "P2002" && err.meta.target.includes("username")) ||
			(err.code === "P2002" && err.meta.target.includes("email"))
		) {
			return res.status(409).json({ message: "Username or email already exists" });
		}

		return res.status(500).json({ message: "Something went wrong" });
	}
};

const login = async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(400).json({ message: "Missing username or password" });
	}

	const User = `@${Str(username).pascal().replaceAll(" ", "").get()}`;
	try {
		const result = await p.user.findUnique({
			where: {
				username: User
			},
			select: {
				username: true,
				password: true
			}
		});

		if (result) {
			const user = result;

			const match = await bcrypt.compare(password, user.password);

			if (match) {
				const token = generateToken(user);

				return res.status(201).cookie("Token", token, options).json({ user, token });
			} else {
				return res.status(401).json({ message: "Wrong password" });
			}
		} else {
			return res.status(404).json({ message: "User not found" });
		}
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Something went wrong" });
	}
};

const logout = async (req, res) => {
	try {
		return res.status(200).clearCookie("Token", options);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Something went wrong" });
	}
};
const get = async (req, res) => {
	try {
		const { username } = req.params;

		const result = await p.user.findUnique({
			where: {
				username
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
				verified: true
			},
			include: {
				post: true,
				blogs: true,
				videos: true,
				services: true,
				collections: true
			}
		});

		if (result) {
			const user = result;

			return res.status(200).json({ user });
		} else {
			return res.status(404).json({ message: "User not found" });
		}
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Something went wrong" });
	}
};

const edit = async (req, res) => {
	const { username } = req.params;
	const { newUsername, password, about, skills, languages, links, name, email } = req.body;

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
					username
				},
				data: {
					username: newUsername,
					password: hash,
					name,
					email,
					about,
					skills,
					languages,
					links
				}
			});

			const user = result;

			const token = generateToken(user);

			return res.status(201).cookie("Token", token, options).json({ user, token });
		} else {
			return res.status(403).json({ message: "You are not authorized to update this profile" });
		}
	} catch (err) {
		console.error(err);
		if (
			(err.code === "P2002" && err.meta.target.includes("username")) ||
			err.meta.target.includes("email")
		) {
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
					username
				}
			});

			if (result) {
				return res.status(200).json({ message: "User deleted successfully" });
			} else {
				return res.status(404).json({ message: "User not found" });
			}
		} else {
			return res.status(403).json({ message: "You are not authorized to delete this profile" });
		}
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Something went wrong" });
	}
};
const blogs = async (req, res) => {
	try {
		const { username } = req.params;
		const user = await p.user.findUnique({
			where: {
				username
			},
			include: { blogs: true }
		});

		if (user.blogs.length === 0) {
			return res.json({ message: "No blogs found" });
		}

		res.status(200).json({ blogs: user });
	} catch (err) {
		console.error(err);
	}
};
const videos = async (req, res) => {
	try {
		const { username } = req.params;
		const user = await p.user.findUnique({
			where: {
				username
			},
			include: { videos: true }
		});

		if (user.videos.length === 0) {
			return res.json({ message: "No videos found" });
		}

		res.status(200).json({ videos: user });
	} catch (err) {
		console.error(err);
		return res.status(err.code || 500).json({ message: "Something went wrong" });
	}
};
const posts = async (req, res) => {
	try {
		const { username } = req.params;
		const user = await p.user.findUnique({
			where: {
				username
			},
			include: { post: true }
		});

		if (user.post.length === 0) {
			return res.json({ message: "No posts found" });
		}

		res.status(200).json({ posts: user.post });
	} catch (err) {
		console.error(err);
		return res.status(err.code || 500).json({ message: "Something went wrong" });
	}
};
const services = async (req, res) => {
	try {
		const { username } = req.params;
		const user = await p.user.findUnique({
			where: {
				username
			},
			include: {
				services: true
			}
		});

		if (user.services.length === 0) {
			return res.json({ message: "No services found" });
		}

		res.status(200).json({ services: user.services });
	} catch (err) {
		console.error(err);
		return res.status(err.code || 500).json({ message: "Something went wrong" });
	}
};
const collections = async (req, res) => {
	try {
		const { username } = req.params;
		const collections = await p.user.findUnique({
			where: {
				username
			},
			include: {
				collections: true
			}
		});

		if (collections.collections.length === 0) {
			return res.json({ message: "No collections found" });
		}

		res.status(200).json({ collections });
	} catch (err) {
		console.error(err);
		return res.status(err.code || 500).json({ message: "Something went wrong" });
	}
};
export { newUser, login, get, edit, remove, blogs, videos, posts, services, logout, collections };
