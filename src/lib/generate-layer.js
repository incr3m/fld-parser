export default function generateLayer() {
  const d1 = [];
  for (let y = 0; y < 320; y++) {
    for (let x = 0; x < 320; x++) {
      d1.push(d1.length % 2);
    }
  }
  return d1;
}
