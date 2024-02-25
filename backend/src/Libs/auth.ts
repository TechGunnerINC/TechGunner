import jwt from 'jsonwebtoken'

function GenToken(user: { username: string; password: string; id: string }) {
	return jwt.sign(
		{ id: user.id, username: user.username, password: user.password },
		Bun.env.JWT as string,
		{ expiresIn: '365d' }
	)
}

function verify(token: string, set: any) {
	try {
		if (!token) {
			set.status = 401
			return { msg: 'Token Not Found, Please login' }
		}

		const valid = jwt.verify(token, Bun.env.JWT as string)
		if (valid) {
			return valid
		} else {
			set.status = 401
			return { msg: 'Invalid Token' }
		}
	} catch (e) {
		console.error(e)
	}
}

function checkState(token: string, username: string | undefined) {
	try {
		const check = jwt.verify(token, Bun.env.JWT as string)
		let state
		// @ts-ignore
		if (check?.username === username) state = 'Owner'
		else if (check) state = 'LoggedIn'
		else state = 'None'
		return state
	} catch (e) {
		console.error(e)
	}
}

export { GenToken, verify, checkState }
