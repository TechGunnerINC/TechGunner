import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client'
import { checkState, verify } from '../Libs/auth'

const db = new PrismaClient()

const bodySchema = {
	body: t.Object({
		title: t.String({ maxLength: 30, error: 'Title Cannot be longer than 30 characters' }),
		content: t.String({
			minLength: 300,
			error: `Blog's body must be at least 300 characters long`
		}),
		tags: t.Array(t.String(), {
			maxItems: 30,
			error: 'You can only add 30 hashtags to the blog'
		}),
		category: t.Array(t.String(), {
			maxItems: 10,
			error: 'You cannot add more than 10 categories to your blog'
		}),
		published: t.Boolean(),
		cover: t.String()
	})
}

const route = new Elysia({ prefix: '/blog' })
	.post(
		'/',
		async ({ body, cookie: { auth }, set }) => {
			try {
				const { title, content, tags, category, published, cover } = body
				const token = verify(auth.value, set)
				if (token) {
					const blog = await db.blog.create({
						data: {
							title,
							content,
							tags,
							category,
							published,
							// @ts-expect-error: v
							uid: token.id,
							cover
						}
					})

					return { blog }
				} else {
					set.status = 401
					return { msg: 'Please Log-in' }
				}
			} catch (e: any) {
				console.log(e)
				set.status = 500
			}
		},
		bodySchema
	)
	.get('/', ({ set }) => {
		try {
			return db.blog.findMany({ take: 500 })
		} catch (e: any) {
			console.error(e)
			set.status = 500
		}
	})
	.get('/:id', async ({ params, set }) => {
		try {
			const blog = await db.blog.findUnique({ where: { id: params.id } })
			if (!blog) {
				set.status = 404
				return { msg: `This Blog doesn't exist` }
			} else return blog
		} catch (e: any) {
			set.status = 500
			console.error(e)
		}
	})
	.put(
		'/:id',
		async ({ params, body, cookie: { auth }, set }) => {
			try {
				const uid = await db.blog.findUnique({ where: { id: params.id }, select: { owner: true } })
				const token = checkState(auth.value, uid?.owner)
				if (token === 'Owner') {
					const { title, content, tags, category, published, cover } = body
					const blog = await db.blog.update({
						where: { id: params.id },
						data: {
							title,
							content,
							tags,
							category,
							published,
							// @ts-expect-error: n
							uid: token.username,
							cover
						}
					})

					return { blog }
				} else {
					set.status = 401
					return { msg: 'You are not authorized to update this blog' }
				}
			} catch (e: any) {
				set.status = 500
				console.error(e)
			}
		},
		bodySchema
	)
	.delete('/:id', async ({ params, cookie: { auth }, set }) => {
		try {
			const uid = await db.blog.findUnique({ where: { id: params.id }, select: { owner: true } })
			const token = checkState(auth.value, uid?.owner)
			if (token === 'Owner') {
				await db.blog.delete({ where: { id: params.id } })
				return { msg: 'Blog deleted successfully' }
			} else {
				set.status = 401
				return { msg: 'You are not authorized to delete this blog' }
			}
		} catch (e: any) {
			set.status = 500
			console.error(e)
		}
	})

export default route
