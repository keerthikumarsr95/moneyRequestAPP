const contactSample1 = [
  {
    name: 'keerthi',
    phoneNumber: '+9188676999510'
  },
  {
    name: 'kumar',
    phoneNumber: '+9188676999555'
  }
];

const contactSample2 = [
  {
    name: 'Karthik',
    phoneNumber: '+9188676999510'
  },
  {
    name: 'Bharadwaj',
    phoneNumber: '+911234567890'
  }
];

const samples = {
  contactSample1,
  contactSample2
};

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const getDummyContact = () => {
  const randomNumber = getRandomInt(2);
  return samples[`contactSample${randomNumber + 1}`]
};

module.exports = { get: getDummyContact };