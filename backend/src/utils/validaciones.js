
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

function esFechaNacimientoValida(fecha_nacimiento) {
    if (!fecha_nacimiento) return true; // si no la mandaron no hay que validar nada

    const nacimiento = new Date(fecha_nacimiento);
    const hoy = new Date();

    if (isNaN(nacimiento.getTime())) return false; // formato inválido

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }

    return edad >= 0 && edad <= 120;
}




module.exports = { esDniValido, esTelefonoValido, esMailValido, esFechaNacimientoValida };