var express = require('express');
var router = express.Router();

const { getUser, getUserContinue } = require('../instascrape.js')


router.get('/user_profile/:username', async (req, res) => {
  	
	var username = req.params.username; //Use params to search for specific user 

	try {
	  let result = await getUser(username)
	  res.send(result);
	  
	} catch (e) {
	  console.error(' err ' ,e);
	  res.status(e.statusCode).send({error:e.message})
	}

});


router.get('/user_profile_continue/:username', async (req, res) => {
  	
  	var username = req.params.username; //Use params to search for specific user 
	try {
	  let result = await getUserContinue(username)
	  res.send(result);
	  
	} catch (e) {
	  console.error(e);
	  res.status(e.statusCode).send({error:e.message})

	}
    
});


module.exports = router;

