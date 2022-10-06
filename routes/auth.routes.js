const router = require("express").Router();
const bcryptjs = require("bcryptjs")
const User = require("../models/User.model")
const saltRounds = 10;
//SIGNUP: display form
router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});


//SIGNUP: process form
router.post("/signup", (req, res, next) => {
    const {email, password} = req.body;


    bcryptjs
        .genSalt(saltRounds)
        .then(salt => {
            return bcryptjs.hash(password, salt)
        })
        .then((hash) => {
            const userDetails = {
                email,
                passwordHash: hash
            }
            return User.create(userDetails);
        })
        .then(userFromDB => {
            res.redirect("/");
        })
        .catch(e => {});
});

//LOGIN: display form
router.get('/login', (req, res) => res.render('auth/login'));

//LOGIN: display form
router.get('/login', (req, res) => res.render('auth/login'));


//LOGIN: process form
router.post("/login", (req, res, next) => {
    const {email, password} = req.body;

    if (!email || !password) {  //back-end validation
        res.render('auth/login', { errorMessage: 'Please enter both, email and password to login.' });
        return;//we use return if we don't have the data we want to stop the code and don't go to the next line of code
    }

    User.findOne({email: email})
        .then( userFromDB => {
            if(!userFromDB){
                // when no user with this email 
                res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
                return;
            } else if (bcryptjs.compareSync(password, userFromDB.passwordHash)) { //the compare method return a boolean
                //login sucessful
                req.session.currentUser = userFromDB;
                res.redirect('/user-profile');
            } else {
                //login failed
                res.render('auth/login', { errorMessage: 'Incorrect credentials.' });
            }
        })
        .catch(error => {
            console.log("Error getting user details from DB", error)
            next(error);
        });

 //user profile       
router.get('/user-profile', (req, res) => {
    res.render('users/user-profile');
});
});
//logout
router.post('/logout', (req,res,next)=>{
    req.session.destroy(err => {
        if (err){
            next(err);
        } else {
            res.redirect('/');
        }
    })
})


module.exports = router;