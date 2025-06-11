class Bulb {
  constructor() {
    this.isOn = false;
    this.isHot = false;
  }

  turnOn() {
    this.isOn = true;
    this.isHot = true;
  }

  turnOff() {
    this.isOn = false;
  }
}

class Switch {
  constructor(bulb) {
    this.bulb = bulb;
  }

  turnOn() {
    this.bulb.turnOn();
  }

  turnOff() {
    this.bulb.turnOff();
  }
}

const bulb1 = new Bulb();
const bulb2 = new Bulb();
const bulb3 = new Bulb();

const switch1 = new Switch(bulb1);
const switch2 = new Switch(bulb2);
const switch3 = new Switch(bulb3);

switch1.turnOn();

setTimeout(() => {
  switch1.turnOff();
  switch2.turnOn();

  console.log("Masuk ke ruangan...");

  [bulb1, bulb2, bulb3].forEach((bulb, index) => {
    const id = index + 1;
    if (bulb.isOn) {
      console.log(`Bohlam ${id}: Menyala → switch ke-${index + 1}`);
    } else if (!bulb.isOn && bulb.isHot) {
      console.log(`Bohlam ${id}: Mati tapi hangat → switch ke-${index + 1}`);
    } else {
      console.log(`Bohlam ${id}: Mati dan dingin → switch ke-${index + 1}`);
    }
  });
}, 5000); 
