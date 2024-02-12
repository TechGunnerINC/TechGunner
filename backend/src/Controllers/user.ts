import { CookieOptions, Elysia, t } from 'elysia'
import { PrismaClient, user } from '@prisma/client'
import { GenToken, checkState, verify } from '../Libs/auth'

export const options = {
	domain: process.env.DOMAIN,
	maxAge: 30758400,
	httpOnly: true,
	secure: true,
	priority: 'high'
} as CookieOptions

const db = new PrismaClient()

const route = new Elysia()
	.group('/auth', (route) =>
		route
			.post(
				'/sign-up',
				async ({ body, set, cookie: { auth } }) => {
					try {
						let { username, email, password, name } = body as user

						if (
							/[`~!@#$%^&*()=+[\]|;:',.<>/?€£¥©®™÷×§¶°¨≠∞µαβγδεζηθιμνξ➾⟁⟂⟃⟄⟅⟆⟇⟈⟉⟊⟋⟌⟍⟎⟏⟐⟑⟒⟓⟔⟕⟖⟗⟘⟙⟚⟛⟜⟝⟞⟟⟠⟡⟢⟣⟤⟥⟦⟧⟨⟩⟪⟫⟬⟭⟮⟯⟰⟱⟲⟳⟴⟵⟶⟷⟸⟹⟺⟻⟼⟽⟾⟿ÿÖÜø£ß¢₩₱°²³ªº¿⌐¬½¼¡«»┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌αßΓπΣστΦΘδφε∩≡±≥≤⌠⌡≈·√ⁿ²ⱭⱮⱯⱰⱱⱲⱳⱴⱵⱶⱷⱸⱹⱺⱻⱼⱽⱾⱿⲀⲁⲂⲃⲄⲅⲆⲇⲈⲉⲊⲋⲌⲍⲎⲏⲐⲑⲒⲓⲗⲘⲜⲝⲞⲟⲠⲡⲢⲣⲤⲥⲦⲧⲨⲩⲪⲫⲬⲭⲮⲯⲲⲳⲴⲵⲶⲷⲸⲹⲺⲻⲼⲽⲾⲿⳀⳁⳄⳅⳆⳇⳈⳉⳊⳋⳌⳍⳎⳏⳐⳑⳒⳓⳔⳕⳖⳗⳘⳙⳚⳛⳜⳝⳞⳟⳠⳡⳢⳣⳤ⳥⳦⳧⳨⳩⳪ⳫⳬⳭⳮ⳯🜀🜁🜂🜃🜄🜅🜆🜇🜈🜉🜊🜋🜌🜍🜎🜏🜐🜑🜒🜓🜔🜕🜖🜗🜘🜙🜚🜛🜜🜝🜞🜟🜠🜡🜢🜣🜤🜥🜦🜧🜨🜩🜪🜫🜬🜭🜮🜯🜰🜱🜲🜳🜴🜵🜶🜷🜸🜹🜺🜻🜼🜽🜾🜿🝀🝁🝂🝃🝄🝅🝆🝇🝈🝉🝊🝋🝌🝍🝎🝏🝐🝑🝒🝓🝔🝕🝖🝗🝘🝙🝚🝛🝜🝝🝞🝟🝠🝡🝢🝣🝤🝥🝦🝧🝨🝩🝪🝫🝬🝭🝮🝯🝰🝱🝲🝳]/.test(
								username
							)
						) {
							set.status = 400
							return {
								msg: 'Username cannot contain special characters except for under_scores and hyphens -.'
							}
						}

						if (!username || !email || !password) {
							set.status = 400
							return { msg: 'Username Password and E-mail are required' }
						}

						if (!name) {
							name = username
						}

						const hash = await Bun.password.hash(password)

						const user = await db.user.create({
							data: {
								username: `@${username.toLowerCase().replaceAll(' ', '')}`,
								email: email.toLowerCase(),
								password: hash,
								name
							},
							select: {
								id: true,
								username: true,
								password: true
							}
						})

						const token = GenToken(user)
						console.log(token, verify(token, set))

						auth.property = options
						auth.value = token

						return { user, token }
					} catch (e: any) {
						if (
							(e.code === 'P2002' && e.meta.target.includes('username')) ||
							(e.code === 'P2002' && e.meta.target.includes('email'))
						) {
							set.status = 409
							return { msg: 'Username or email already exists' }
						} else set.status = 500
						console.error(e)
					}
				},
				{
					body: t.Object({
						username: t.String({
							maxLength: 25,
							error: 'Username can not be longer then 25 characters'
						}),
						email: t.String({ format: 'email', error: 'Please enter a valid email' }),
						password: t.String({
							minLength: 50,
							error: 'Password must contain 50 or more characters'
						}),
						name: t.String({ maxLength: 20, error: 'Name can not be longer than 20 characters' })
					})
				}
			)

			.post(
				'/login',
				async ({ body, set, cookie: { auth } }) => {
					try {
						const { username, password } = body

						if (!username || !password) {
							set.status = 400
							return { msg: 'Missing username or password' }
						}

						const User = `@${username.toLowerCase().replaceAll(' ', '')}`
						const user = await db.user.findUnique({
							where: {
								username: User
							},
							select: {
								id: true,
								email: true,
								username: true,
								password: true
							}
						})

						if (user) {
							const match = await Bun.password.verify(password, user.password)

							if (match) {
								const token = GenToken(user)

								set.status = 201

								auth.property = options
								auth.value = token

								return { token }
							} else {
								set.status = 400
								return { msg: 'The username or password are incorrect' }
							}
						}
					} catch (e: any) {
						set.status = 500
						console.error(e)
					}
				},
				{ body: t.Object({ username: t.String(), password: t.String() }) }
			)

			.post('/logout', ({ cookie: { auth }, set }) => {
				try {
					auth.remove(options)
				} catch (e: any) {
					set.status = 500
					console.error(e)
				}
			})
	)
	.group('/profile/:username', (route) =>
		route
			.get('/', async ({ params, set, cookie: { auth } }) => {
				try {
					const { username } = params

					const user = await db.user.findUnique({
						where: {
							username
						},
						select: {
							username: true,
							name: true,
							about: true,
							banner: true,
							pp: true,
							followers: true,
							interests: true,
							joined: true,
							verified: true,
							links: true,
							skillLevel: true,
							skillName: true,
							langName: true,
							langLevel: true,
							level: true,
							needs: true,
							points: true
						}
					})

					if (user) {
						const state = checkState(auth.value, user.username)
						return {
							user,
							state
						}
					} else {
						set.status = 404
						return { msg: 'User not found' }
					}
				} catch (e: any) {
					set.status = 500
					console.error(e)
				}
			})

			.put(
				'/',
				async ({ params, body, cookie: { auth }, set }) => {
					try {
						const { username } = params
						const {
							newUsername,
							password,
							about,
							skillName,
							skillLevel,
							langName,
							langLevel,
							links,
							name,
							email
						} = body
						const token = checkState(auth.value, username)

						if (token === 'Owner') {
							const hash = await Bun.password.hash(password)

							const user = await db.user.update({
								where: {
									username
								},
								data: {
									username: newUsername,
									password: hash,
									name,
									email,
									about,
									links,
									skillName,
									skillLevel,
									langName,
									langLevel
								}
							})

							const token = GenToken(user)

							auth.property = options
							auth.value = token

							return { user, token }
						} else {
							set.status = 401
							return { msg: 'You are not authorized to update this profile' }
						}
					} catch (e: any) {
						if (
							(e.code === 'P2002' && e.meta.target.includes('username')) ||
							(e.code === 'P2002' && e.meta.target.includes('email'))
						) {
							set.status = 409
							return { msg: 'Username already exists' }
						}

						set.status = 500
						console.error(e)
					}
				},
				{
					params: t.Object({ username: t.String() }),
					body: t.Object({
						newUsername: t.String({
							maxLength: 25,
							error: 'Username can not be longer then 25 characters'
						}),
						email: t.String({ format: 'email', error: 'Please enter a valid email' }),
						password: t.String({
							minLength: 50,
							error: 'Password must contain 50 or more characters'
						}),
						name: t.String({ maxLength: 20, error: 'Name can not be longer than 20 characters' }),
						about: t.String(),
						links: t.Array(t.String()),
						skillName: t.String({ maxLength: 20 }),
						skillLevel: t.String(),
						langLevel: t.String(),
						langName: t.String()
					})
				}
			)

			.delete(
				'/',
				async ({ set, body, cookie: { auth }, params }) => {
					try {
						const { username } = params
						const { password } = body
						const token = await checkState(auth.value, username)
						if (token === 'Owner') {
							const user = (await db.user.findUnique({
								where: { username },
								select: { password: true }
							})) as user
							if (user) {
								const correct = await Bun.password.verify(password, user.password)
								if (correct) {
									await db.user.delete({
										where: {
											username
										}
									})
								} else {
									set.status = 401
									return { msg: 'Wrong password' }
								}
							} else {
								set.status = 404
								return { msg: `User with the username of ${username}, does not exist` }
							}
						} else {
							set.status = 401
							return { msg: 'You are not authorized to delete this profile' }
						}
					} catch (e: any) {
						set.status = 500
						console.error(e)
					}
				},
				{ params: t.Object({ username: t.String() }), body: t.Object({ password: t.String() }) }
			)
			.get('/blogs', async ({ params, set }) => {
				try {
					const { username } = params

					const blogs = await db.user.findMany({ where: { username }, select: { blogs: true } })

					if (blogs.length === 0) {
						return { msg: `${username} hasn't uploaded any Blog Posts` }
					} else if (!blogs) {
						set.status = 404
						return { msg: `User with the username of ${username} doesn't exist` }
					} else {
						return { blogs }
					}
				} catch (e: any) {
					set.status = 500
					console.error(e)
				}
			})
			.get('/videos', async ({ params, set }) => {
				try {
					const { username } = params
					const videos = await db.user.findUnique({
						where: {
							username
						},
						select: { videos: true }
					})

					if (videos?.videos.length === 0) {
						return { msg: `${username} hasn't uploaded any videos yet` }
					} else {
						return { videos }
					}
				} catch (e: any) {
					set.status = 500
					console.error(e)
				}
			})
			.get('/posts', async ({ params, set }) => {
				try {
					const { username } = params
					const post = await db.user.findUnique({
						where: {
							username
						},
						select: { post: true }
					})

					if (post?.post.length === 0) {
						return { msg: `${username} hasn't uploaded any photos yet` }
					} else {
						return { post }
					}
				} catch (e: any) {
					set.status = 500
					console.error(e)
				}
			})
			.get('/gigs', async ({ params, set }) => {
				try {
					const { username } = params
					const gigs = await db.user.findUnique({
						where: {
							username
						},
						select: { gigs: true }
					})

					if (gigs?.gigs.length === 0) {
						return { msg: `${username} hasn't created any gigs yet` }
					} else {
						return { gigs }
					}
				} catch (e: any) {
					set.status = 500
					console.error(e)
				}
			})
			.get('/collections', async ({ params, set }) => {
				try {
					const { username } = params
					const collections = await db.user.findUnique({
						where: {
							username
						},
						select: { collections: true }
					})

					if (collections?.collections.length === 0) {
						return { msg: `${username} don't have any public collections` }
					} else return { collections }
				} catch (e: any) {
					set.status = 500
					console.error(e)
				}
			})
	)
export default route