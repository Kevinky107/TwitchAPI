const port = process.env.PORT || 3000;

const { app } = require('./src/app');

app.listen(port, () =>
	console.log(`Server listening on http://localhost:${port}`)
)