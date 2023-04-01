const express = require(`express`);
const User = require(`../models/user`);
const {body, validationResult} = require(`express-validator`);
const router = express.Router();
const bcrypt = require(`bcryptjs`);
const jwt = require(`jsonwebtoken`);
const JWT_SECRET = `testingSomethingAwesome`;

//defined routes and Tested. All routes working fine!!!

router.post(`/createuser`, 
[
    body("email").isEmail(),
    body("password").isLength({min: 5}),
],
    async(req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty())
        {
            success = false;
            return res.status(400).send({"success": success, "errors": errors.array()})
        }

        try{
            let user = await User.findOne({email: req.body.email})

            if (user)
            {
                return res.status(400).json({"success": false, "errors": "Account exists!"})
            }

            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);

            user = await User.create({
                email: req.body.email,
                password: secPass,
            })

            const data = {
                user: {
                    id: user.id,
                }
            };

            const authToken = jwt.sign(data, JWT_SECRET);

            res.json({"success": true, "authtoken": authToken});
        }   catch (error) {
            console.error(error);
            res.status(500).send(`Internal Server Error!!!`);
        }
    }
);

router.post(`/login`, 
[
    body("email").isEmail(),
    body("password").isLength({min: 5}),
], async(req, res) => {
        try{
            const user = await User.findOne({"email": req.body.email})

            if (!user)
            {
                return res.status(400).json({"success": false})
            }

            const passwordComparison = await bcrypt.compare(req.body.password, user.password);

            if (!passwordComparison){
                return res.status(400).json({"success": false})
            }

            const data = {
                user: {
                    id: user.id,
                },
            }

            const authToken = jwt.sign(data, JWT_SECRET);

            res.json({"success": true, "authtoken": authToken});
            
        }   catch (error)   {
            console.error(error);
            res.status(500).send(`Internal Server Error!!!`);
        }
    }
)

module.exports = router;