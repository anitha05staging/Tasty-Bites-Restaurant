import http from 'http';

const data = JSON.stringify({
    name: "Test User",
    email: "anithastaging123@gmail.com",
    subject: "Test Subject",
    message: "This is a test message from the app context"
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/contact',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let responseData = '';
    res.on('data', (chunk) => {
        responseData += chunk;
    });
    res.on('end', () => {
        console.log('Response status:', res.statusCode);
        console.log('Response body:', responseData);
    });
});

req.on('error', (error) => {
    console.error('Request error:', error);
});

req.write(data);
req.end();
