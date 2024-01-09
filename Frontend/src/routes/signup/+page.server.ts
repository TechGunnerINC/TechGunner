import type { Actions } from "./$types";
import axios from "axios";

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const username = data.get("username");
		const password = data.get("password");
		const email = data.get("email");
		let name = data.get("name");

		if (!name) {
			name = username;
		}

		const port = 3000 || 5000;

		await axios.post(`http://localhost:${port}/auth/signup`, {
			email,
			password,
			username,
			name
		});

		return { success: true };
	}
};
