//ovde cemo uraditi proveru podataka unetih za registraciju:
//1)da li lozinka ispunjava dati oblik
//2)da li se poklapaju dve unete lozinke


const User = require('../models/user');

module.exports = (req, res, next) => {
    console.log(req.body);
    let firstIsLetter = /^[A-Za-z]/;
    let oneNumber = /\d+/;
    let oneBigLetter = /[A-Z]+/;
    let oneSpecialCharacter = /[!@#$%^&*]+/;
    let password = "";
    if (!req.body.password.match(firstIsLetter) ||
        !req.body.password.match(oneNumber) ||
        !req.body.password.match(oneBigLetter) ||
        !req.body.password.match(oneSpecialCharacter) || req.body.password.length < 7) {
        return res.status(401).json({
            message: "Lozinka mora da sadrzi najmanje 7 karaktera, bar jedno veliko slovo, jedan broj, jedan specijalni karakter i mora pocinjati slovom"
        });
    }
    if (req.body.password != req.body.passwordAgain) {
        return res.status(401).json({
            message: "Unete lozinke se ne poklapaju"
        });
    }
    next();
}