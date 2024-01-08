import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";

const pr = new PrismaClient();

const post = async (req, res) => {
	try {
		const uid = req.user.id;
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { title, des, cover, tags, published, category } = req.body;

		const p = await pr.blog.create({
			data: {
				title,
				des,
				cover,
				uid,
				category,
				tags,
				published
			}
		});
		res.json(p);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Internal Server Error");
	}
};

const get = async (req, res) => {
	try {
		const allB = await pr.blog.findMany();

		res.json(allB);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Internal Server Error");
	}
};

const getId = async (req, res) => {
	try {
		const { id } = req.params;

		const p = await pr.blog.findUnique({
			where: { id },
			include: { comments: true }
		});

		if (req.user?.id) {
			pr.history.create({ data: { bid: id } });
		}

		if (!p) {
			return res.status(404).send("Blog not found");
		}
		res.json(p);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Internal Server Error");
	}
};

const put = async (req, res) => {
	try {
		const { id } = req.params;
		const { title, des, cover, tags, published, category } = req.body;
		const uid = req.user.id;
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const blog = await pr.blog.findUnique({ where: { id } });

		if (!blog) {
			return res.status(404).send("Blog not found!");
		}

		if (blog.uid !== uid) {
			return res.status(403).send("You are not authorized to update this blog");
		}

		const p = await pr.blog.update({
			where: { id },
			data: {
				title,
				des,
				cover,
				uid,
				category,
				tags,
				published
			}
		});

		if (!p) {
			return res.status(404).send("Blog not found or you are not authorized to update it");
		}

		return res.status(200).json({ message: "Blog was updated!", updatedBlog: p });
	} catch (err) {
		console.error(err.message);
		return res.status(500).send("Internal Server Error");
	}
};

const del = async (req, res) => {
	try {
		const { id } = req.params;
		const uid = req.user.id;

		const blog = await pr.blog.findUnique({ where: { id } });

		if (!blog) {
			return res.status(404).send("Blog not found!");
		}

		if (blog.uid !== uid) {
			return res.status(403).send("You are not authorized to delete this blog");
		}

		const delRes = await pr.blog.delete({ where: { id, uid } });

		if (!delRes) {
			return res.status(404).send("Blog not found or you are not authorized to delete it");
		}

		return res.status(200).json({ message: "Blog was deleted!" });
	} catch (err) {
		console.error(err.message);
		return res.status(500).send("Internal Server Error");
	}
};

const postComment = async (req, res) => {
	try {
		const uid = req.user.id;
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { bId, comment } = req.body;
		await pr.comments.create({
			data: {
				comment,
				bId,
				uid
			}
		});

		return res.redirect(`/blog/${bId}`);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Internal Server Error");
	}
};

const edit = async (req, res) => {
	try {
		const { id } = req.params;
		const { comment } = req.body;
		const uid = req.user.id;
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const comments = await pr.comments.findUnique({ where: { id } });

		if (!comments) {
			return res.status(404).send("Comment not found!");
		}

		if (comments.uid !== uid) {
			return res.status(403).send("You are not authorized to update this comments");
		}

		const edited = await pr.comments.update({
			where: { id },
			data: { comment }
		});

		res.status(200).json({ message: "Comment was updated!", edited });
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Internal Server Error");
	}
};

const destroy = async (req, res) => {
	try {
		const { id } = req.params;
		const uid = req.user.id;

		const comments = await pr.comments.findUnique({ where: { id } });

		if (!comments) {
			return res.status(404).send("Comment not found!");
		}

		if (comments.uid !== uid) {
			return res.status(403).send("You are not authorized to delete this comments");
		}

		await pr.comments.delete({ where: { id, uid } });

		res.status(200).json({ message: "Comment was deleted!" });
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Internal Server Error");
	}
};

export { postComment, edit, destroy, post, get, getId, put, del };
