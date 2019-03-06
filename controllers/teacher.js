var express = require('express');
var dateTime = require('date-time');
var userModel = require.main.require('./model/user-model');
var teacherModel = require.main.require('./model/teacher-model');
var studentModel = require.main.require('./model/student-model');
var supportModel = require.main.require('./model/support-model');
var examRoomModel = require.main.require('./model/examRoom-model');
var router = express.Router();

router.get('*', function(req, res, next){
		if(req.session.uId != null){
			next();
		}else{
			res.redirect('/login');
		}
});

router.get('/', (req, res)=>{
		var user = {
			userId: req.session.uId
		};
		res.render('teacher/index', user);
});	


router.get('/userlist', (req, res)=>{
	
	userModel.getAll(function(results){
		if(results.length > 0){
			var user = {
				name: req.session.uId,
				uList: results
			};
			res.render('teacher/userlist', user);
		}
	});	
});

router.get('/profile', (req, res)=>{

	teacherModel.get(req.session.uId, function(result){
		if(result.length > 0){
			res.render('teacher/profile', result[0]);
		}
	});	
});

router.post('/profile', (req, res)=>{
	res.redirect('/teacher/profile/edit');
});

router.get('/profile/edit', (req, res)=>{

	teacherModel.get(req.session.uId, function(result){
		if(result.length >0 ){
			res.render('teacher/editProfile', result[0]);
		}else{
			res.redirect('/profile');
		}
	});
});	

router.post('/profile/edit/', (req, res)=>{

	var teacher ={
		teacherId : req.session.uId,
		teacherName : req.body.teacherName,
		teacherEmail : req.body.teacherEmail,
		teacherAddress : req.body.teacherAddress,
		teacherMobile : req.body.teacherMobile,
		teacherImage : req.body.teacherImage
	};

	teacherModel.update(teacher, function(success){
		if(success){
			res.redirect('/teacher/profile');
		}else{
			res.redirect('/teacher/profile/edit');
		}
	});
});

router.get('/adduser', (req, res)=>{
	res.render('teacher/adduser');
});	

router.post('/adduser', (req, res)=>{
	
	var user ={
		uname : req.body.uname,
		password : req.body.password,
		type : req.body.type
	};
	
	userModel.insert(user, function(success){
		if(success){
			res.redirect('/teacher/userlist');
		}else{
			res.render("/teacher/adduser");
		}
	});
});

router.get('/exam/myExams/view/:id', (req, res)=>{
	examRoomModel.get(req.params.id, function(result){
		if(result.length >0 ){
			res.render('teacher/viewExam', result[0]);
		}else{
			res.redirect('/teacher/exam/myExams');
		}
	});
});

router.get('/exam/myExams/edit/:id', (req, res)=>{
	examRoomModel.get(req.params.id, function(result){
		if(result.length >0 ){
			res.render('teacher/editExam', result[0]);
		}else{
			res.redirect('/teacher/exam/myExams');
		}
	});
});	

router.post('/exam/myExams/edit/:id', (req, res)=>{
	
	var examRoom ={
		examId 		  : req.params.id,
		examTitle 	  : req.body.title,
		examDate 	  : req.body.date,
		examStartTime : req.body.start,
		examEndTime   : req.body.end,
		teacherId	  : req.session.uId
	};
	
	examRoomModel.update(examRoom, function(success){
		if(success){
			res.redirect('/teacher/exam/myExams');
		}else{
			res.render("/teacher/exam/myExams/edit/"+req.params.id);
		}
	});
});

router.get('/exam/myExams/delete/:id', (req, res)=>{

	examRoomModel.get(req.params.id, function(result){
		if(result.length >0 ){
			res.render('teacher/deleteExam', result[0]);
		}else{
			res.redirect('/teacher/exam/myExams');
		}
	});
});	

router.post('/exam/myExams/delete/:id', (req, res)=>{
	
	examRoomModel.delete(req.params.id, function(success){
		if(success){
			res.redirect('/teacher/exam/myExams');
		}else{
			res.redirect("/teacher/exam/myExams/delete/"+req.params.id);
		}
	});
});

router.get('/support', (req, res)=>{
	res.render('teacher/support');
});

router.post('/support', (req, res)=>{
	var support ={
		teacherId : req.session.uId,
		supportText : req.body.supportText,
		supportTime : new Date(),
		supportStatus : "PENDING"
	};
	supportModel.insert(support, function(success){
		if(success){
			res.redirect('/teacher');
		}else{
			res.redirect('/teacher/support');
		}
	});
});	

router.get('/account', (req, res)=>{
	res.render('teacher/account');
});

router.post('/account', (req, res)=>{
	var user ={
		userId : req.session.uId,
		password : req.body.oldPassword
	};

	userModel.validate(user, function(result){
		if(result.length > 0){
			if(result[0].U_TYPE == "TEACHER" && result[0].U_STATUS == "ACTIVE")
			{
				if(req.body.newPassword == req.body.conPassword){
					var updateUser={
						userId : req.session.uId,
						password : req.body.newPassword,
						type : "TEACHER",
						status : "ACTIVE"
					};
					userModel.update(updateUser, function(success){
						if(success){
							res.redirect('/teacher');
						}else{
							res.redirect("/teacher/account");
						}
					});
				}
			}
		}else{
			res.redirect("/teacher/account");
		}
	});
});
router.get('/exam', (req, res)=>{
	res.render('teacher/exam');
});

router.get('/exam/createExam', (req, res)=>{
	res.render('teacher/createExam');
});

router.post('/exam/createExam', (req, res)=>{
	var examRoom ={
		examTitle 	  : req.body.title,
		examDate 	  : req.body.date,
		examStartTime : req.body.start,
		examEndTime   : req.body.end,
		teacherId	  : req.session.uId
	};

	examRoomModel.insert(examRoom, function(success){
		if(success){
			res.redirect('/teacher/exam/myExams');
		}else{
			res.redirect("/teacher/exam/createExam");
		}
	});
});

router.get('/exam/myExams', (req, res)=>{
	examRoomModel.getByTeacherId(req.session.uId, function(results){
		if(results.length > 0){
			var exam = {
				name: req.session.uId,
				examList: results
			};
			res.render('teacher/myExams', exam);
		}
	});
});

module.exports = router;