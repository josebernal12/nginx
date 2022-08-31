process.on('message', (cant) => {
    let results = {};
    for (let i = 0; i < cant; i++) {
      const randomNumber = Math.floor(Math.random() * (1000 - 1) + 1);
      if (!results[randomNumber]) {
        results[randomNumber] = 1;
      } else {
        results[randomNumber] = results[randomNumber] + 1;
      }
    }
  
    process.send(results);
    process.exit();
  });
  
  process.send('enviado');