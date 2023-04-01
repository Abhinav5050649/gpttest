const jwt = require(`jsonwebtoken`)
const JWT_SECRET = "testingSomethingAwesome"

const fetchU = (req, res, next) => {
    try{
        const token = req.header(`authtoken`)

        if (!token)
        {
            res.status(401).send(`Faulty Authentication`)
        }else{
            try{
                const data = jwt.verify(token, JWT_SECRET)
                req.user = data.user
                next()
            }catch(error){
                res.status(401).send(`Faulty Authentication`)
            }
        }
    }catch(error){
        console.log(error)
        res.status(500).send(`Internal Server Error!`)
    }
}

module.exports = fetchU