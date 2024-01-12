function int(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function genPass(length: number): string {
	const up = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const low = "abcdefghijklmnopqrstuvwxyz";
	const num = "0123456789";
	const sym = "`~!@#$%^&*()-_=+[]{}|;:',.<>/?";
	const spacial =
		"€£¥©®™÷×§¶°¨≠∞µαβγδεζηθικλμνξÄÅÉæÆôöòûùよかとカく➾⟁⟂⟃⟄⟅⟆⟇⟈⟉⟊⟋⟌⟍⟎⟏⟐⟑⟒⟓⟔⟕⟖⟗⟘⟙⟚⟛⟜⟝⟞⟟⟠⟡⟢⟣⟤⟥⟦⟧⟨⟩⟪⟫⟬⟭⟮⟯⟰⟱⟲⟳⟴⟵⟶⟷⟸⟹⟺⟻⟼⟽⟾⟿ÿÖÜø£ß¢₩₱°²³ªº¿⌐¬½¼¡«»┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌αßΓπΣστΦΘδφε∩≡±≥≤⌠⌡≈·√ⁿ²ⱭⱮⱯⱰⱱⱲⱳⱴⱵⱶⱷⱸⱹⱺⱻⱼⱽⱾⱿⲀⲁⲂⲃⲄⲅⲆⲇⲈⲉⲊⲋⲌⲍⲎⲏⲐⲑⲒⲓⲗⲘⲜⲝⲞⲟⲠⲡⲢⲣⲤⲥⲦⲧⲨⲩⲪⲫⲬⲭⲮⲯⲲⲳⲴⲵⲶⲷⲸⲹⲺⲻⲼⲽⲾⲿⳀⳁⳄⳅⳆⳇⳈⳉⳊⳋⳌⳍⳎⳏⳐⳑⳒⳓⳔⳕⳖⳗⳘⳙⳚⳛⳜⳝⳞⳟⳠⳡⳢⳣⳤ⳥⳦⳧⳨⳩⳪ⳫⳬⳭⳮ⳯🜀🜁🜂🜃🜄🜅🜆🜇🜈🜉🜊🜋🜌🜍🜎🜏🜐🜑🜒🜓🜔🜕🜖🜗🜘🜙🜚🜛🜜🜝🜞🜟🜠🜡🜢🜣🜤🜥🜦🜧🜨🜩🜪🜫🜬🜭🜮🜯🜰🜱🜲🜳🜴🜵🜶🜷🜸🜹🜺🜻🜼🜽🜾🜿🝀🝁🝂🝃🝄🝅🝆🝇🝈🝉🝊🝋🝌🝍🝎🝏🝐🝑🝒🝓🝔🝕🝖🝗🝘🝙🝚🝛🝜🝝🝞🝟🝠🝡🝢🝣🝤🝥🝦🝧🝨🝩🝪🝫🝬🝭🝮🝯🝰🝱🝲🝳";

	const password: string[] = [];

	function randomIndexString(set: string): number {
		const byte: number = int(1, 528193);
		const index: number = byte % set.length;
		return index;
	}

	function randomIndexArray(set: string[]): number {
		const byte: number = int(1, 528193);
		const index: number = byte % set.length;
		return index;
	}

	function isSimilarOrSequential(char: string, prev: string): boolean {
		const similar = "il1Lo0O";
		const sequential = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		if (similar.includes(char) && similar.includes(prev)) {
			return true;
		}
		const index = sequential.indexOf(char);
		if (index > -1 && (sequential[index - 1] === prev || sequential[index + 1] === prev)) {
			return true;
		}
		return false;
	}

	password.push(up[randomIndexString(up)]);
	password.push(low[randomIndexString(low)]);
	password.push(num[randomIndexString(num)]);
	password.push(sym[randomIndexString(sym)]);
	password.push(spacial[randomIndexString(spacial)]);

	for (let i = password.length - 1; i > 0; i--) {
		const j = randomIndexArray(password);
		[password[i], password[j]] = [password[j], password[i]];
	}

	for (let i = 4; i < length; i++) {
		const set = [up, low, num, sym, spacial][randomIndexArray([up, low, num, sym, spacial])];
		let char = set[randomIndexString(set)];
		const prev = password[i - 1];
		while (isSimilarOrSequential(char, prev)) {
			char = set[randomIndexString(set)];
		}
		password.push(char);
	}

	return password.join("");
}

export { genPass, int };
