import http from 'http';

http.createServer((req, res) => {
  res.write('Hello from Terraform + Docker!');
  res.end();
}).listen(3000);