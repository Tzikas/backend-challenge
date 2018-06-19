
var schedule = require('node-schedule');
var request = require('request') 
var cheerio = require('cheerio');

const getUser = (username) => {
    return new Promise(function(resolve, reject) {
	request.get(`https://www.instagram.com/${username}`, (error, response, html) => {
		if (error) {
		    return reject(error);
		}else{
		    //scrape data from instagram.com 
		    const $ = cheerio.load(html);


		    //Since instagram is using react, I'm extracting the data from their meta tags.  
		    let description = $('meta[property="og:description"]').attr("content")
		    if(!description ) {
			  return reject({statusCode:400, message:'user does not exist'});
		    }
		    let fullName = $('meta[property="og:title"]').attr("content").split('•')[0] 
		    fullName = fullName.slice(0, fullName.indexOf("(@")).trim()

		    let user = { 
			data : { 
			      fullName,
			      imageUrl: $('meta[property="og:image"]').attr("content"),
			      followers: description.split(' ')[0], 
			      following: description.split(' ')[2],
			      posts: description.split(' ')[4]
			} 	
		    }
		    console.log(user); //show result 		    
		    return resolve(user); 
		}
	    });
    })

}


const getUserContinue = (username) => {
	return new Promise(function(resolve, reject) {
		 let sched = schedule.scheduleJob("* */2 * * * *", async() => {  //use node-scheduler to schedule events every 2 mins.  
			try {
			    var user = await getUser(username);  //Use function above to get user each time.  
			} catch(error) {
			    sched.cancel();
			    console.error(error) 
			    return reject(error);
			}
		});
	})
}



module.exports = {getUser, getUserContinue};
