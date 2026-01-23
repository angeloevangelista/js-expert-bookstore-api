import bcrypt from "bcrypt";

async function main() {
  const password = "angelo123";

  const hashedPassword = await bcrypt.hash(password, 12);

  const valid = await bcrypt.compare("angelo123", hashedPassword);

  console.log({
    password,
    hashedPassword,
    valid,
  });
}

main();
