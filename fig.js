const getColor = color => {
  const colors = new Map();
  colors.set('Desert', { name: 'Desert', hex: '#a93226' });
  colors.set('Jungle', { name: 'Jungle', hex: '#229954' });
  colors.set('Glacial', { name: 'Glacial', hex: '#2471a3' });

  if (colors.has(color)) {
    return colors.get(color);
  }

  const random = Math.floor(Math.random() * (colors.size));
  return colors.get(Array.from(colors.keys())[random]);
};

const getMaterial = material => {
  const materials = new Map();
  materials.set('Bronze', { name: 'Bronze', categories: ['Melee', 'Armor'], damageMod: 0.75, speedMod: 1.5, armorMod: 1, weightMod: 1 });
  materials.set('Iron', { name: 'Iron', categories: ['Melee', 'Armor'], damageMod: 1, speedMod: 1.25, armorMod: 1.5, weightMod: 1.5 });
  materials.set('Steel', { name: 'Steel', categories: ['Melee', 'Armor'], damageMod: 1.5, speedMod: 1, armorMod: 2, weightMod: 1.5 });
  materials.set('Linen', { name: 'Linen', categories: ['Armor'], armorMod: 0.5, weightMod: 0.5 });
  materials.set('Leather', { name: 'Leather', categories: ['Armor'], armorMod: 1, weightMod: 1 });
  materials.set('Elm', { name: 'Elm', categories: ['Casting', 'Ranged'], damageMod: 1, speedMod: 1, focusMod: 1 });
  materials.set('Oak', { name: 'Oak', categories: ['Casting', 'Ranged'], damageMod: 1.15, speedMod: 2, focusMod: 1.5 });
  materials.set('Silver', { name: 'Silver', categories: ['Jewelry'], resistanceMod: 1 });
  materials.set('Gold', { name: 'Gold', categories: ['Jewelry'], resistanceMod: 1.5 });

  if (materials.has(material)) {
    return materials.get(material);
  }

  const random = Math.floor(Math.random() * materials.size);
  return materials.get(Array.from(materials.keys())[random]);
};

const getType = categories => {
  if (!Array.isArray(categories)) {
    return null;
  }

  const types = [
    { name: 'Sword', category: 'Melee', damage: 4, speed: 10 },
    { name: 'Dagger', category: 'Melee', damage: 2, speed: 5 },
    { name: 'Staff', category: 'Casting', damage: 2, speed: 10, focus: 5 },
    { name: 'Bow', category: 'Ranged', damage: 2, speed: 10, distance: 50 },
    { name: 'Vest', category: 'Armor', armor: 2, weight: 10 },
    { name: 'Helm', category: 'Armor', armor: 1, weight: 5 },
    { name: 'Boots', category: 'Armor', armor: 1, weight: 5 },
    { name: 'Ring', category: 'Jewelry', resistance: 5 },
    { name: 'Necklace', category: 'Jewelry', resistance: 7 },
  ];

  const randomCat = categories[Math.floor(Math.random() * categories.length)];
  let result = null;

  while (!result) {
    const random = Math.floor(Math.random() * types.length);
    result = types[random].category === randomCat ? types[random] : null;
  }

  return result;
};

const getFlavor = () => {
  const flavors = [
    { name: 'of the Bear', stat: 'Strength', value: 5 },
    { name: 'of the Fox', stat: 'Intellect', value: 5 },
    { name: 'of the Hare', stat: 'Agility', value: 5 },
    { name: 'of the Wolf', stat: 'Stamina', value: 5 },
    { name: 'of the Owl', stat: 'Focus', value: 5 },
  ];

  const random = Math.floor(Math.random() * flavors.length);
  return flavors[random];
};

const getResistanceType = hexColor => {
  const colors = [
    parseInt(`${hexColor[1]}${hexColor[2]}`, 16),
    parseInt(`${hexColor[3]}${hexColor[4]}`, 16),
    parseInt(`${hexColor[5]}${hexColor[6]}`, 16),
  ];

  const highest = Math.max(...colors);

  switch (colors.indexOf(highest)) {
    case 0:
      return 'Fire';
    case 1:
      return 'Poison';
    case 2:
      return 'Frost';
    default:
      return null;
  }
};

const generateItem = () => {
  const item = {};

  item.color = getColor();
  item.material = getMaterial();
  item.type = getType(item.material.categories);
  item.stats = {};
  item.flavor = getFlavor();

  switch (item.type.category) {
    case 'Melee':
      item.stats.damage = item.type.damage * item.material.damageMod;
      item.stats.speed = item.type.speed * item.material.speedMod;
      break;
    case 'Casting':
      item.stats.damage = item.type.damage * item.material.damageMod;
      item.stats.speed = item.type.speed * item.material.speedMod;
      item.stats.focus = item.type.focus * item.material.focusMod;
      break;
    case 'Ranged':
      item.stats.damage = item.type.damage * item.material.damageMod;
      item.stats.speed = item.type.speed * item.material.speedMod;
      item.stats.distance = item.type.distance;
      break;
    case 'Armor':
      item.stats.armor = item.type.armor * item.material.armorMod;
      item.stats.weight = item.type.weight * item.material.weightMod;
      break;
    case 'Jewelry':
      item.stats[`${getResistanceType(item.color.hex)} resistance`] = item.type.resistance * item.material.resistanceMod;
      break;
    default:
      return null;
  }

  return item;
};

const generate = document.getElementById('generate');
const item = document.getElementById('item');
const itemName = document.getElementById('itemName');
const statsDiv = document.getElementById('stats');
generate.addEventListener('click', () => {
  while (statsDiv.firstChild) {
    statsDiv.removeChild(statsDiv.firstChild);
  }

  const newItem = generateItem();

  const icon = newItem.flavor.name.split(' ')[newItem.flavor.name.split(' ').length - 1].toLowerCase();
  const background = newItem.color.name.toLowerCase();
  item.style.display = 'block';
  item.style.border = `1px solid ${newItem.color.hex}`;
  item.style.backgroundImage = `url("./images/${icon}.png"), url("./images/${background}.png")`;
  item.style.boxShadow = `0 0 10px ${newItem.color.hex}`;
  itemName.innerText = `${newItem.color.name} ${newItem.material.name} ${newItem.type.name} ${newItem.flavor.name}`;

  const stats = Object.entries(newItem.stats);
  stats.forEach(stat => {
    const statDiv = document.createElement('div');
    statDiv.style.marginBottom = '10px';
    statDiv.innerText = `${stat[0]}: ${stat[1]}`;
    statDiv.innerText = statDiv.innerText.charAt(0).toUpperCase() + statDiv.innerText.slice(1);
    statsDiv.appendChild(statDiv);
  });

  const bonusDiv = document.createElement('div');
  bonusDiv.innerText = `Bonus ${newItem.flavor.stat}: ${newItem.flavor.value}`;
  statsDiv.appendChild(bonusDiv);
}, false);
