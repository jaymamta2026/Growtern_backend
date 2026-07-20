import bcrypt from "bcryptjs";

const password = "GA@Tech2025";

const hash = await bcrypt.hash(password, 10);

console.log(hash);