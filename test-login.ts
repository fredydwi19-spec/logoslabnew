async function testLogin() {
  const res = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'ketua1@logoslab.com', password: 'password123' })
  });
  console.log(res.status);
  console.log(await res.text());
}
testLogin();
