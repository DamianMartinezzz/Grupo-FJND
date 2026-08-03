
const esDniValido = (dni) => {
    return /^\d{7,8}$/.test(dni);
};

const esTelefonoValido = (telefono) => {
    return /^\d{10}$/.test(telefono);
};

const esMailValido = (mail) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(mail);
};

module.exports = { esDniValido, esTelefonoValido, esMailValido };