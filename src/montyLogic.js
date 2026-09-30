export function openEmptyDoor(prize, selected, random = Math.random) {
  const available = [0, 1, 2].filter(door => door !== prize && door !== selected);
  return available[Math.floor(random() * available.length)];
}
export function otherDoor(selected, opened) {
  return [0, 1, 2].find(door => door !== selected && door !== opened);
}
export function simulateDoors(count, random = Math.random) {
  let stay = 0;
  let swap = 0;
  for (let i = 0; i < count; i++) {
    const prize = Math.floor(random() * 3);
    const selected = Math.floor(random() * 3);
    const opened = openEmptyDoor(prize, selected, random);
    if (selected === prize) stay++;
    if (otherDoor(selected, opened) === prize) swap++;
  }
  return { total: count, stay, swap };
}
