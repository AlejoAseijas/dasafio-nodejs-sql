function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

process.on("message", (cant) => {
  let collection = {};
  if (Number(cant) > 0) {
    for (let i = 0; i < cant; i++) {
      let random = Math.round(getRandomArbitrary(0, 10000));

      if (collection.hasOwnProperty(random)) {
        collection[random] = collection[random] + 1;
      } else {
        collection[random] = 0;
      }
    }
  }

  process.send(collection);
});
