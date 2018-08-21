const express = require('express');
const router = express.Router();

router.get('/info', urlencodeParser, function(req, res){
	if(!req.body) return res.sendStatus(400);
	var req_email;
	if(req.session.user_email){
		req_email = req.session.user_email;
	}else if(req.query.email){
		req_email = req.query.email;
	}else{
		res.send(JSON.stringify({'status':0,'message': "Cannot get dog information."}));
		res.end();
		return;
	}
	// connect to database
	MongoClient.connect(url, function(err, client){
		assert.equal(null, err);
		if(err){
			console.log("Connot connect correctly to the database");
			res.sendStatus(500);
			return;
		}
		// correctly connected to the database.
		var db = client.db("groomingAppointment");
		db.collection("client").find({"email":req_email}).toArray(function(err, result){
			if(err) throw err;
			if(result.length != 0){
				res.send(JSON.stringify({'status':1, 'message': result[0].dogs}));
			}else{
				res.send(JSON.stringify({'status':0,'message': "Cannot get user information."}));
			}
			client.close();
			res.end();
		});
	});
});

router.post('/upload/profile', upload.single('editDogImage'), function(req, res){
	var userEmail = req.body.email;
	MongoClient.connect(url, function(err, client){
		assert.equal(null, err);
		if(err){
			console.log("Connot connect correctly to the database");
			return;
		}
		console.log("Correctly connected to the database");
		// md5 crypto password and compare with database
		var db = client.db("groomingAppointment");
		db.collection("client").find({"email": userEmail}).toArray(function(err, result){
			if(err) throw err;
			if(result.length != 0){
				// insert dog
				var dogName = req.body.editDogName;
				var dogNameForCompare = dogName.toLowerCase();
				// make comparision with the dog already in the database,
				//if their name are same, fail to add a dog and show user message to change a name
				var dogList = result[0].dogs;
				// check if the dog name is already being used
				if(dogList){
					for(var i=0; i<dogList.length; i++){
						if(dogList[i].d_name.toLowerCase() === dogNameForCompare){
							res.send(JSON.stringify({'status': 0, 'message': "Dog name already registered. Please try another name."}));
							res.end();
							client.close();
							return;
						}
					}
				}
				// if not return, that means no dog is matched in the database, insert it.
				var dogBreed = req.body.editDogBreed;
				var dogDateOfBirth = req.body.editDogDateOfBirth;
				var dogImagePath;
				if(req.file){
					dogImagePath = req.file.path;
				}else{
					dogImagePath = "data/dogs/dog-default.jpg";
				}
				var newDog = {
					d_name : dogName,
					d_breed : dogBreed,
					d_dateOfBirth : dogDateOfBirth,
					d_imagePath : dogImagePath
				}
				db.collection("client").updateOne(
					{email: userEmail},
					{
						$addToSet: {
							"dogs": newDog
						}
					}
				);
				res.send(JSON.stringify({'status': 1,'message': "Dog profile uploaded successfully."}));
			}else{
				res.send(JSON.stringify({'status': 2, 'message': "Failed to update dog profile, no user found."}));
			}
			res.end();
			client.close();
		});
	});
});

module.exports = router;
