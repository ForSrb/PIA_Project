module.exports = (req, res, next) => {  
    let firstIsLetter = /^[A-Za-z]/;
    let oneNumber = /\d+/;
    let oneBigLetter = /[A-Z]+/;
    let oneSpecialCharacter = /[!@#$%^&*]+/;
    let password = "";
    if(!req.body.newPassword.match(firstIsLetter) || 
    !req.body.newPassword.match(oneNumber) || 
    !req.body.newPassword.match(oneBigLetter) ||
    !req.body.newPassword.match(oneSpecialCharacter) || req.body.newPassword.length < 7) {
        return res.status(401).json({
            message: "Nova lozinka mora da sadrzi najmanje 7 karaktera, bar jedno veliko slovo, jedan broj, jedan specijalni karakter i mora pocinjati slovom"
        });
    }
    if(req.body.newPassword != req.body.newPasswordAgain) {
        return res.status(401).json({
            message: "Unete nove lozinke se ne poklapaju"
        });
    }
    next();
}